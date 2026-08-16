-- =====================================================================
-- 002_profiles.sql
-- Application user profiles + authorization helper functions.
-- =====================================================================

create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  student_id          text unique not null,
  full_name           text not null,
  email               text not null,
  phone               text,
  profile_photo_url   text,
  programme           text,
  level               text,
  hall                text,
  role                text not null default 'student'
                        check (role in ('student', 'admin')),
  verification_status text not null default 'pending'
                        check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.profiles is
  'One row per authenticated application user. Mirrors auth.users and holds university profile data. A user is simply a verified student; "finder", "claimant" and "reporter" are activities, not roles.';
comment on column public.profiles.id is
  'Primary key, equals auth.users.id. Never client-generated.';
comment on column public.profiles.student_id is
  'University student/staff identifier. SENSITIVE: never exposed on public item listings.';
comment on column public.profiles.full_name is
  'Display name. Visible to administrators and to counterparties inside an approved claim conversation only.';
comment on column public.profiles.email is
  'University email. SENSITIVE: private to the owner and administrators.';
comment on column public.profiles.phone is
  'Contact phone. SENSITIVE: private to the owner and administrators; shared only through a handover once a claim is approved.';
comment on column public.profiles.profile_photo_url is
  'Path/URL inside the profile-images storage bucket.';
comment on column public.profiles.role is
  'ADMIN-ONLY field: student | admin. Enforced database-side; normal users can never change it (see 020_rls.sql and 019_triggers.sql).';
comment on column public.profiles.verification_status is
  'ADMIN-ONLY field: pending | verified | rejected | suspended. Controls whether the user may report items and submit claims.';

-- ---------------------------------------------------------------------
-- Authorization helpers.
-- SECURITY DEFINER so RLS policies can call them without recursion.
-- ---------------------------------------------------------------------
create or replace function public.is_admin(_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user_id and role = 'admin'
  );
$$;

comment on function public.is_admin(uuid) is
  'True when the given user (default: current user) is an administrator. Used by RLS policies; bypasses RLS safely via SECURITY DEFINER.';

create or replace function public.is_verified_user(_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user_id and verification_status = 'verified'
  );
$$;

comment on function public.is_verified_user(uuid) is
  'True when the user account is verified and not suspended. Gate for creating reports and claims.';

-- Data API grants (Supabase does not grant these implicitly).
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
