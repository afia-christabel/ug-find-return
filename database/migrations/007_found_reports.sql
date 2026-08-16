-- =====================================================================
-- 007_found_reports.sql
-- Details supplied by the person who FOUND an item.
-- =====================================================================

create table if not exists public.found_reports (
  id                          uuid primary key default gen_random_uuid(),
  item_id                     uuid not null unique references public.items (id) on delete cascade,
  finder_id                   uuid not null references public.profiles (id) on delete cascade,
  date_found                  date not null check (date_found <= current_date),
  time_found                  time,
  location_id                 uuid references public.locations (id) on delete set null,
  specific_area               text,
  private_identifying_details text,
  finder_notes                text,
  safekeeping_confirmed       boolean not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.found_reports is
  'One row per found item report (1:1 with items where item_type = found). The private_identifying_details column is the source used to generate ownership verification questions, which is the anti-fraud core of the platform.';
comment on column public.found_reports.finder_id is
  'The finder holding the item. PRIVATE: publicly represented only as "Verified University User".';
comment on column public.found_reports.date_found is 'PUBLIC date the item was found.';
comment on column public.found_reports.time_found is 'PUBLIC approximate clock time.';
comment on column public.found_reports.specific_area is
  'SEMI-PRIVATE narrower area. Visible to the finder and administrators only, so claimants cannot guess location answers.';
comment on column public.found_reports.private_identifying_details is
  'HIGHLY SENSITIVE. Basis for verification_questions.expected_answer. Readable ONLY by the finder and administrators. Must never reach a claimant.';
comment on column public.found_reports.finder_notes is
  'PRIVATE finder remarks for administrators (handover preferences, condition notes).';
comment on column public.found_reports.safekeeping_confirmed is
  'True when the finder accepted the safekeeping declaration in step 6 of the report form.';

grant select, insert, update on public.found_reports to authenticated;
grant all on public.found_reports to service_role;
