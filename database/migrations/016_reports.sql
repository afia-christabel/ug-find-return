-- =====================================================================
-- 016_reports.sql
-- Abuse / integrity reports raised by users about items or claims.
-- (Not to be confused with lost_reports / found_reports.)
-- =====================================================================

create table if not exists public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.profiles (id) on delete cascade,
  item_id      uuid references public.items (id) on delete cascade,
  claim_id     uuid references public.claims (id) on delete cascade,
  reason       text not null
                 check (reason in ('fraudulent_claim', 'false_report', 'inappropriate_content',
                                   'duplicate', 'spam', 'harassment', 'other')),
  description  text,
  status       text not null default 'open'
                 check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  reviewed_by  uuid references public.profiles (id) on delete set null,
  review_notes text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint reports_target_present check (item_id is not null or claim_id is not null)
);

comment on table public.reports is
  'Integrity reports raised by users (e.g. "this claim looks fraudulent"). Each report targets an item and/or a claim. PRIVATE: readable by the reporter and administrators only; the reported party is never shown the reporter identity.';
comment on column public.reports.reporter_id is 'Reporting user. SENSITIVE: never disclosed to the reported party.';
comment on column public.reports.reason is 'Structured reason code used for admin triage.';
comment on column public.reports.status is 'open -> reviewing -> actioned | dismissed.';
comment on column public.reports.review_notes is 'ADMIN-ONLY outcome notes.';

grant select, insert, update on public.reports to authenticated;
grant all on public.reports to service_role;
