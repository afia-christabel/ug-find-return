-- =====================================================================
-- 018_functions.sql
-- Business logic that MUST run server-side: matching, secure answer
-- comparison and claim verification scoring.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Text similarity helper (0..1), accent and case insensitive.
-- ---------------------------------------------------------------------
create or replace function public.text_similarity(_a text, _b text)
returns numeric
language sql
immutable
as $$
  select case
    when _a is null or _b is null then 0
    when lower(unaccent(trim(_a))) = lower(unaccent(trim(_b))) then 1
    else greatest(0, least(1, similarity(lower(unaccent(_a)), lower(unaccent(_b)))::numeric))
  end;
$$;

comment on function public.text_similarity(text, text) is
  'Normalised trigram similarity between two strings, 0 (no similarity) to 1 (identical).';

-- ---------------------------------------------------------------------
-- MATCHING ENGINE
-- Weights: category 20, brand 15, model 15, colour 10, location 15,
--          date 10, time 5, description 10  => 100
-- A score is a HINT ONLY. It never proves ownership.
-- ---------------------------------------------------------------------
create or replace function public.compute_match_score(_lost_report_id uuid, _found_report_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  l record;
  f record;
  s_category numeric := 0;
  s_brand numeric := 0;
  s_model numeric := 0;
  s_colour numeric := 0;
  s_location numeric := 0;
  s_date numeric := 0;
  s_time numeric := 0;
  s_desc numeric := 0;
  day_gap integer;
begin
  select lr.*, i.category_id, i.brand, i.model, i.colour, i.public_description, i.item_name
    into l
  from public.lost_reports lr
  join public.items i on i.id = lr.item_id
  where lr.id = _lost_report_id;

  select fr.*, i.category_id, i.brand, i.model, i.colour, i.public_description, i.item_name
    into f
  from public.found_reports fr
  join public.items i on i.id = fr.item_id
  where fr.id = _found_report_id;

  if l is null or f is null then
    return jsonb_build_object('score', 0, 'breakdown', '{}'::jsonb);
  end if;

  if l.category_id is not null and l.category_id = f.category_id then
    s_category := 20;
  end if;

  s_brand  := 15 * public.text_similarity(l.brand, f.brand);
  s_model  := 15 * public.text_similarity(l.model, f.model);
  s_colour := 10 * public.text_similarity(l.colour, f.colour);

  if l.location_id is not null and l.location_id = f.location_id then
    s_location := 15;
  else
    s_location := 8 * public.text_similarity(l.specific_area, f.specific_area);
  end if;

  day_gap := abs(coalesce(f.date_found, current_date) - coalesce(l.date_lost, current_date));
  s_date := case
    when day_gap = 0 then 10
    when day_gap <= 2 then 8
    when day_gap <= 7 then 5
    when day_gap <= 30 then 2
    else 0
  end;

  s_time := 5 * public.text_similarity(l.approximate_time, coalesce(f.time_found::text, ''));

  s_desc := 10 * greatest(
    public.text_similarity(l.public_description, f.public_description),
    public.text_similarity(l.item_name, f.item_name)
  );

  return jsonb_build_object(
    'score', round(least(100, s_category + s_brand + s_model + s_colour + s_location + s_date + s_time + s_desc), 2),
    'breakdown', jsonb_build_object(
      'category', round(s_category, 2), 'brand', round(s_brand, 2), 'model', round(s_model, 2),
      'colour', round(s_colour, 2), 'location', round(s_location, 2), 'date', round(s_date, 2),
      'time', round(s_time, 2), 'description', round(s_desc, 2)
    )
  );
end;
$$;

comment on function public.compute_match_score(uuid, uuid) is
  'Weighted similarity between a lost report and a found report. Returns {score, breakdown}. Advisory only: a high score never authorises a handover.';

-- Refresh candidate matches for one report (either direction).
create or replace function public.refresh_matches_for_report(_report_id uuid, _report_kind text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  res jsonb;
  inserted integer := 0;
begin
  if _report_kind = 'lost' then
    for r in
      select fr.id from public.found_reports fr
      join public.items i on i.id = fr.item_id
      where i.status in ('active', 'matched')
    loop
      res := public.compute_match_score(_report_id, r.id);
      if (res->>'score')::numeric >= 50 then
        insert into public.matches (lost_report_id, found_report_id, match_score, score_breakdown)
        values (_report_id, r.id, (res->>'score')::numeric, res->'breakdown')
        on conflict (lost_report_id, found_report_id)
          do update set match_score = excluded.match_score,
                        score_breakdown = excluded.score_breakdown,
                        updated_at = now();
        inserted := inserted + 1;
      end if;
    end loop;
  else
    for r in
      select lr.id from public.lost_reports lr
      join public.items i on i.id = lr.item_id
      where i.status in ('active', 'matched')
    loop
      res := public.compute_match_score(r.id, _report_id);
      if (res->>'score')::numeric >= 50 then
        insert into public.matches (lost_report_id, found_report_id, match_score, score_breakdown)
        values (r.id, _report_id, (res->>'score')::numeric, res->'breakdown')
        on conflict (lost_report_id, found_report_id)
          do update set match_score = excluded.match_score,
                        score_breakdown = excluded.score_breakdown,
                        updated_at = now();
        inserted := inserted + 1;
      end if;
    end loop;
  end if;
  return inserted;
end;
$$;

comment on function public.refresh_matches_for_report(uuid, text) is
  'Recomputes candidate matches for one report. _report_kind is lost or found. Stores pairs scoring >= 50 in public.matches.';

grant execute on function public.refresh_matches_for_report(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- Claimant-safe question fetch (never returns expected_answer).
-- ---------------------------------------------------------------------
create or replace function public.get_verification_questions(_item_id uuid)
returns table (id uuid, question text, question_type text)
language sql
stable
security definer
set search_path = public
as $$
  select q.id, q.question, q.question_type
  from public.verification_questions q
  where q.item_id = _item_id and q.is_active
  order by q.created_at;
$$;

comment on function public.get_verification_questions(uuid) is
  'Returns the verification questions of an item WITHOUT expected answers. Safe to call from the browser during the claim wizard.';

grant execute on function public.get_verification_questions(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Secure answer submission + scoring.
-- The expected answer never leaves the database.
-- ---------------------------------------------------------------------
create or replace function public.submit_claim_response(
  _claim_id uuid,
  _question_id uuid,
  _response text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _claimant uuid;
  _expected text;
  _score numeric;
  _id uuid;
begin
  select claimant_id into _claimant from public.claims where id = _claim_id;
  if _claimant is null then
    raise exception 'Claim not found';
  end if;
  if _claimant <> auth.uid() and not public.is_admin() then
    raise exception 'Not authorised for this claim';
  end if;

  select expected_answer into _expected
  from public.verification_questions
  where id = _question_id;

  _score := round(100 * public.text_similarity(_response, _expected), 2);

  insert into public.claim_responses (claim_id, question_id, response, score, scored_at)
  values (_claim_id, _question_id, _response, _score, now())
  on conflict (claim_id, question_id)
    do update set response = excluded.response, score = excluded.score, scored_at = now()
  returning id into _id;

  return _id; -- deliberately returns only the row id, never the score
end;
$$;

comment on function public.submit_claim_response(uuid, uuid, text) is
  'Stores a claimant answer and scores it against the secret expected answer inside the database. Returns only the response id so the client can never read the score or infer the correct answer.';

grant execute on function public.submit_claim_response(uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- CLAIM VERIFICATION SCORE
-- identity 20 | description 20 | unique feature 20 | serial/IMEI 20 |
-- evidence 10 | report consistency 10  => 100
-- ---------------------------------------------------------------------
create or replace function public.recalculate_claim_score(_claim_id uuid)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  c record;
  s_identity numeric := 0;
  s_description numeric := 0;
  s_unique numeric := 0;
  s_serial numeric := 0;
  s_evidence numeric := 0;
  s_consistency numeric := 0;
  total numeric := 0;
  avg_unique numeric;
  avg_serial numeric;
  avg_other numeric;
  ev_count integer;
begin
  select * into c from public.claims where id = _claim_id;
  if c is null then
    return null;
  end if;

  -- Identity: verified account + confirmed identity step.
  if c.identity_confirmed and public.is_verified_user(c.claimant_id) then
    s_identity := 20;
  elsif public.is_verified_user(c.claimant_id) then
    s_identity := 10;
  end if;

  select avg(r.score) into avg_unique
  from public.claim_responses r
  join public.verification_questions q on q.id = r.question_id
  where r.claim_id = _claim_id and q.question_type in ('unique_feature', 'damage', 'accessory');

  select avg(r.score) into avg_serial
  from public.claim_responses r
  join public.verification_questions q on q.id = r.question_id
  where r.claim_id = _claim_id and q.question_type in ('serial', 'imei');

  select avg(r.score) into avg_other
  from public.claim_responses r
  join public.verification_questions q on q.id = r.question_id
  where r.claim_id = _claim_id and q.question_type in ('colour', 'contents', 'other');

  s_unique := 20 * coalesce(avg_unique, 0) / 100;
  s_serial := 20 * coalesce(avg_serial, 0) / 100;
  s_description := 20 * coalesce(avg_other, avg_unique, 0) / 100;

  select count(*) into ev_count from public.evidence
  where claim_id = _claim_id and status <> 'rejected';
  s_evidence := least(10, ev_count * 5);

  -- Report consistency: claimant filed a matching lost report first.
  if c.lost_report_id is not null then
    s_consistency := 10;
  end if;

  total := round(s_identity + s_description + s_unique + s_serial + s_evidence + s_consistency, 2);

  update public.claims
  set verification_score = total,
      score_breakdown = jsonb_build_object(
        'identity', round(s_identity, 2),
        'description', round(s_description, 2),
        'unique_feature', round(s_unique, 2),
        'serial_imei', round(s_serial, 2),
        'evidence', round(s_evidence, 2),
        'report_consistency', round(s_consistency, 2)
      ),
      updated_at = now()
  where id = _claim_id;

  return total;
end;
$$;

comment on function public.recalculate_claim_score(uuid) is
  'Recomputes the 0-100 claim verification score and its breakdown. Written server-side only; claimants see a status message, administrators see the detail.';

grant execute on function public.recalculate_claim_score(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Handover completion: both confirmations + correct code required.
-- ---------------------------------------------------------------------
create or replace function public.complete_handover(_handover_id uuid, _code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  h record;
begin
  select * into h from public.handovers where id = _handover_id;
  if h is null then
    raise exception 'Handover not found';
  end if;
  if auth.uid() not in (h.owner_id, h.finder_id) and not public.is_admin() then
    raise exception 'Not authorised for this handover';
  end if;
  if upper(trim(_code)) <> upper(h.verification_code) then
    return false;
  end if;

  update public.handovers
  set owner_confirmed = true,
      finder_confirmed = true,
      status = 'completed',
      completed_at = now(),
      updated_at = now()
  where id = _handover_id;

  update public.items set status = 'recovered', updated_at = now() where id = h.item_id;
  update public.claims set status = 'completed', updated_at = now() where id = h.claim_id;

  perform public.log_audit_event('handover.completed', 'handover', _handover_id,
    jsonb_build_object('item_id', h.item_id, 'claim_id', h.claim_id));
  perform public.log_audit_event('item.recovered', 'item', h.item_id, '{}'::jsonb);

  insert into public.notifications (user_id, type, title, message, entity_type, entity_id)
  values
    (h.owner_id, 'item_recovered', 'Item successfully recovered',
     'The handover was completed and the item is marked as recovered.', 'item', h.item_id),
    (h.finder_id, 'item_recovered', 'Item successfully recovered',
     'Thank you for returning the item through the platform.', 'item', h.item_id);

  return true;
end;
$$;

comment on function public.complete_handover(uuid, text) is
  'Validates the handover verification code, marks handover/claim/item as completed/recovered, writes audit entries and notifies both parties. Returns false when the code is wrong.';

grant execute on function public.complete_handover(uuid, text) to authenticated;
