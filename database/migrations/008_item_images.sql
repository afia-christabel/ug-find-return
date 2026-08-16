-- =====================================================================
-- 008_item_images.sql
-- Images attached to an item. Two visibilities: public and verification.
-- =====================================================================

create table if not exists public.item_images (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references public.items (id) on delete cascade,
  storage_path text not null,
  bucket_id    text not null default 'public-item-images'
                 check (bucket_id in ('public-item-images', 'private-evidence')),
  visibility   text not null default 'public'
                 check (visibility in ('public', 'verification')),
  caption      text,
  sort_order   integer not null default 0,
  uploaded_by  uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now()
);

comment on table public.item_images is
  'Photographs of an item. visibility = public images live in the public-item-images bucket and are shown in listings. visibility = verification images live in the private-evidence bucket and are used ONLY by administrators when verifying ownership.';
comment on column public.item_images.storage_path is
  'Object path inside bucket_id. Combine with the Supabase Storage client; never build raw URLs for private buckets.';
comment on column public.item_images.visibility is
  'public | verification. Verification images are SENSITIVE and never returned to claimants.';
comment on column public.item_images.sort_order is 'Display order of public gallery images.';

grant select on public.item_images to anon;
grant select, insert, update, delete on public.item_images to authenticated;
grant all on public.item_images to service_role;
