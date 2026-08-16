-- =====================================================================
-- 003_categories.sql
-- Reference data: item categories (PUBLIC read, admin managed).
-- =====================================================================

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  icon        text,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.categories is
  'Lookup table of item categories (Electronics, ID Cards, Bags, ...). Fully PUBLIC read-only reference data; only administrators may insert/update. Referenced by public.items.category_id.';
comment on column public.categories.slug is
  'URL safe identifier used in filter query strings. PUBLIC.';
comment on column public.categories.icon is
  'Lucide icon name rendered by the frontend. PUBLIC.';
comment on column public.categories.is_active is
  'Soft disable: inactive categories stay referenced by old items but are hidden from new report forms.';

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
