-- =====================================================================
-- 010_claims.sql
-- Ownership claims submitted against a found item.
-- =====================================================================

create table if not exists public.claims (
  id                 uuid primary key default gen_random_uuid(),
  item_id            uuid not null references public.items (id) on delete cascade,
  claimant_id        uuid not null references public.profiles (id) on delete cascade,
  lost_report_id     uuid references public.lost_reports (id) on delete set null,
  status             text not null default 'claim_submitted'
                       check (status in ('draft', 'claim_submitted', 'under_review',
                                         'more_evidence_required', 'disputed',
                                         'approved', 'rejected', 'withdrawn', 'completed')),
  verification_score numeric(5, 2) check (verification_score >= 0 and verification_score <= 100),
  score_breakdown    jsonb not null default '{}'::jsonb,
  identity_confirmed boolean not null default false,
  declaration_signed boolean not null default false,
  submitted_at       timestamptz not null default now(),
  reviewed_at        timestamptz,
  reviewed_by        uuid references public.profiles (id) on delete set null,
  review_notes       text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (item_id, claimant_id)
);

comment on table public.claims is
  'Stores ownership claims submitted by users for found items. Claims require verification before handover. A claimant may hold at most one claim per item. When two or more active claims exist for the same item, a trigger marks them disputed and notifies administrators (see 019_triggers.sql) - the finder never decides who receives the item.';
comment on column public.claims.claimant_id is
  'Profile submitting the claim. PRIVATE from other users; visible to administrators.';
comment on column public.claims.lost_report_id is
  'Optional link to the claimant''s own lost report; strengthens report-consistency scoring.';
comment on column public.claims.status is
  'claim_submitted -> under_review -> approved/rejected/more_evidence_required/disputed -> completed after handover.';
comment on column public.claims.verification_score is
  'ADMIN-FACING total 0-100: identity 20, description 20, unique feature 20, serial/IMEI 20, evidence 10, report consistency 10. Claimants only ever see a coarse status message.';
comment on column public.claims.score_breakdown is
  'ADMIN-ONLY per-criterion score detail.';
comment on column public.claims.review_notes is
  'ADMIN-ONLY reviewer notes. Required whenever a claim decision is recorded.';

grant select, insert, update on public.claims to authenticated;
grant all on public.claims to service_role;
