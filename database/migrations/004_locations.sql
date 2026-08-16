-- =====================================================================
-- 004_locations.sql
-- Reference data: campus locations (PUBLIC read, admin managed).
-- =====================================================================

create table if not exists public.locations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  location_type text not null default 'other'
                  check (location_type in ('hall', 'lecture_hall', 'library', 'department',
                                           'sports', 'transport', 'dining', 'office', 'other')),
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.locations is
  'Lookup table of general campus locations (halls, lecture theatres, libraries, bus stops). Only GENERAL locations are stored here so public listings never reveal an exact hiding/holding place. Referenced by lost_reports, found_reports and handovers.';
comment on column public.locations.name is
  'General location name shown publicly, e.g. "Balme Library".';
comment on column public.locations.location_type is
  'Grouping used for admin analytics (items by location).';

grant select on public.locations to anon;
grant select, insert, update, delete on public.locations to authenticated;
grant all on public.locations to service_role;
