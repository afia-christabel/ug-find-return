-- =====================================================================
-- 001_extensions.sql
-- University of Ghana Lost & Found System
--
-- Purpose: enable required PostgreSQL extensions and create generic
-- infrastructure used by every later migration.
--
-- Run this FIRST on a fresh Supabase project (SQL Editor or CLI).
-- =====================================================================

-- pgcrypto: gen_random_uuid() for UUID primary keys.
create extension if not exists "pgcrypto";

-- pg_trgm: trigram indexes powering fuzzy text search on item names,
-- brands and models (used by the search screen and matching engine).
create extension if not exists "pg_trgm";

-- unaccent: accent-insensitive text search helper.
create extension if not exists "unaccent";

-- ---------------------------------------------------------------------
-- Generic updated_at trigger function.
-- Attached to every table exposing updated_at (see 019_triggers.sql).
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function that stamps updated_at = now() on every UPDATE.';

-- ---------------------------------------------------------------------
-- Reference number sequence.
-- Human readable PUBLIC identifier for items, e.g. LF-2026-000001.
-- ---------------------------------------------------------------------
create sequence if not exists public.item_reference_seq start 1;

create or replace function public.generate_reference_number()
returns text
language sql
volatile
as $$
  select 'LF-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.item_reference_seq')::text, 6, '0');
$$;

comment on function public.generate_reference_number() is
  'Returns the next public item reference number, format LF-<year>-<6 digits>.';
