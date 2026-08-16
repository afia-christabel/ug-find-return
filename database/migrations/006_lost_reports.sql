-- =====================================================================
-- 006_lost_reports.sql
-- Details supplied by the person who LOST an item.
-- =====================================================================

create table if not exists public.lost_reports (
  id                          uuid primary key default gen_random_uuid(),
  item_id                     uuid not null unique references public.items (id) on delete cascade,
  owner_id                    uuid not null references public.profiles (id) on delete cascade,
  date_lost                   date not null check (date_lost <= current_date),
  approximate_time            text,
  location_id                 uuid references public.locations (id) on delete set null,
  specific_area               text,
  private_identifying_details text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.lost_reports is
  'One row per lost item report (1:1 with items where item_type = lost). Holds circumstance data plus the owner''s PRIVATE identifying details used later to verify ownership. Relates to items, profiles (owner), locations and matches.';
comment on column public.lost_reports.owner_id is
  'The person who lost the item. PRIVATE: never rendered on public listings.';
comment on column public.lost_reports.date_lost is
  'PUBLIC date the item went missing.';
comment on column public.lost_reports.approximate_time is
  'PUBLIC free-text time window, e.g. "between 14:00 and 16:00".';
comment on column public.lost_reports.specific_area is
  'SEMI-PRIVATE narrower area ("second floor reading room"). Visible to the owner and administrators only.';
comment on column public.lost_reports.private_identifying_details is
  'HIGHLY SENSITIVE. Scratches, cracks, stickers, serial numbers, IMEI, contents. Readable ONLY by the owner and administrators (see 020_rls.sql). Never selected by public queries and never returned to a claimant.';

grant select, insert, update on public.lost_reports to authenticated;
grant all on public.lost_reports to service_role;
