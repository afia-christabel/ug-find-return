-- =====================================================================
-- 012_evidence.sql
-- Private ownership evidence attached to a claim.
-- =====================================================================

create table if not exists public.evidence (
  id            uuid primary key default gen_random_uuid(),
  claim_id      uuid not null references public.claims (id) on delete cascade,
  submitted_by  uuid not null references public.profiles (id) on delete cascade,
  type          text not null
                  check (type in ('previous_photo', 'receipt', 'serial_number', 'imei',
                                  'warranty', 'police_report', 'other')),
  description   text,
  storage_path  text,
  text_value    text,
  status        text not null default 'submitted'
                  check (status in ('submitted', 'accepted', 'rejected')),
  reviewed_by   uuid references public.profiles (id) on delete set null,
  review_notes  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint evidence_has_payload check (storage_path is not null or text_value is not null)
);

comment on table public.evidence is
  'Ownership evidence submitted with a claim: previous photographs, receipts, serial numbers, IMEI, warranty documents. ALWAYS PRIVATE. Files live in the private-evidence storage bucket and are readable only by the submitter and administrators (see 021_storage.sql). Evidence is never published on item listings.';
comment on column public.evidence.storage_path is
  'Object path inside the private-evidence bucket. Access requires a signed URL created for an authorised user.';
comment on column public.evidence.text_value is
  'SENSITIVE text evidence (serial number, IMEI). Stored separately from files so it can be compared during verification.';
comment on column public.evidence.status is 'submitted -> accepted | rejected by an administrator.';
comment on column public.evidence.review_notes is 'ADMIN-ONLY review remarks.';

grant select, insert, update on public.evidence to authenticated;
grant all on public.evidence to service_role;
