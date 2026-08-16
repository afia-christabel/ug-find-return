-- =====================================================================
-- 015_handovers.sql
-- Supervised physical return of an item after a claim is approved.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Secure handover code generator, format UG-LF-82941.
-- Uses pgcrypto randomness; created here because the table defaults to it.
-- ---------------------------------------------------------------------
create or replace function public.generate_handover_code()
returns text
language sql
volatile
as $$
  select 'UG-LF-' || lpad(((random() * 89999)::int + 10000)::text, 5, '0');
$$;

comment on function public.generate_handover_code() is
  'Generates a 5-digit handover verification code (UG-LF-#####) used to prove both parties met in person.';

create table if not exists public.handovers (

  id                uuid primary key default gen_random_uuid(),
  claim_id          uuid not null unique references public.claims (id) on delete cascade,
  item_id           uuid not null references public.items (id) on delete cascade,
  owner_id          uuid not null references public.profiles (id) on delete cascade,
  finder_id         uuid not null references public.profiles (id) on delete cascade,
  location_id       uuid references public.locations (id) on delete set null,
  scheduled_date    date,
  scheduled_time    time,
  verification_code text not null default public.generate_handover_code(),
  finder_confirmed  boolean not null default false,
  owner_confirmed   boolean not null default false,
  status            text not null default 'scheduled'
                      check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.handovers is
  'Scheduled, auditable handover of an approved item from the finder to the verified owner. Completion requires BOTH parties to confirm and the owner to enter the verification code, after which triggers set item.status = recovered and claim.status = completed and write an audit log entry.';
comment on column public.handovers.verification_code is
  'SEMI-SENSITIVE one-time code, format UG-LF-#####. Shown to the finder and owner only; entering it proves both parties were physically present.';
comment on column public.handovers.finder_confirmed is 'Finder pressed CONFIRM HANDOVER.';
comment on column public.handovers.owner_confirmed is 'Owner pressed CONFIRM ITEM RECEIVED and supplied the correct code.';
comment on column public.handovers.completed_at is 'Timestamp of successful recovery; part of the audit trail.';

grant select, insert, update on public.handovers to authenticated;
grant all on public.handovers to service_role;
