-- =====================================================================
-- 005_items.sql
-- Central item record. One row per reported thing (lost OR found).
-- =====================================================================

create table if not exists public.items (
  id                 uuid primary key default gen_random_uuid(),
  reference_number   text not null unique default public.generate_reference_number(),
  item_type          text not null check (item_type in ('lost', 'found')),
  category_id        uuid references public.categories (id) on delete set null,
  item_name          text not null check (char_length(trim(item_name)) between 2 and 120),
  brand              text,
  model              text,
  colour             text,
  public_description text check (char_length(coalesce(public_description, '')) <= 2000),
  status             text not null default 'pending_review'
                       check (status in ('pending_review', 'active', 'matched', 'claim_submitted',
                                         'under_verification', 'disputed', 'handover_scheduled',
                                         'recovered', 'archived', 'rejected')),
  moderation_note    text,
  created_by         uuid not null references public.profiles (id) on delete cascade,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.items is
  'Central item record shared by lost and found workflows. Contains ONLY publicly displayable attributes; every private/identifying detail lives in lost_reports.private_identifying_details or found_reports.private_identifying_details. Related: item_images, lost_reports, found_reports, claims, verification_questions.';
comment on column public.items.reference_number is
  'PUBLIC human readable reference, e.g. LF-2026-000001. Generated server-side by generate_reference_number(); never trust a client supplied value.';
comment on column public.items.item_type is
  'lost = someone lost it, found = someone is holding it. Drives which report table carries the details.';
comment on column public.items.public_description is
  'PUBLIC description. Users are instructed to keep unique identifying marks OUT of this field so they can be used for ownership verification.';
comment on column public.items.status is
  'Lifecycle: pending_review -> active -> matched/claim_submitted -> under_verification -> handover_scheduled -> recovered. disputed when several claimants appear; archived/rejected are administrative end states.';
comment on column public.items.moderation_note is
  'ADMIN-ONLY note explaining approval, rejection or archival.';
comment on column public.items.created_by is
  'Author profile. SENSITIVE relationship: for found items the frontend must render the author as "Verified University User" and never expose identity.';

grant select on public.items to anon;
grant select, insert, update on public.items to authenticated;
grant all on public.items to service_role;
