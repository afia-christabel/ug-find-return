-- =====================================================================
-- 013_messages.sql
-- Claim-scoped messaging. There is NO open/public messaging in this system.
-- =====================================================================

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  claim_id    uuid not null references public.claims (id) on delete cascade,
  sender_id   uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  message     text not null check (char_length(trim(message)) between 1 and 2000),
  read_at     timestamptz,
  created_at  timestamptz not null default now(),
  constraint messages_no_self_message check (sender_id <> receiver_id)
);

comment on table public.messages is
  'Messages exchanged inside a single claim. Every message MUST belong to a claim: users can only communicate when the claim workflow permits it (claim under review, approved, or handover in progress). Administrators can read claim threads for dispute resolution.';
comment on column public.messages.claim_id is 'Conversation scope. No claim => no conversation.';
comment on column public.messages.sender_id is 'Author profile; must be a participant of the claim or an administrator.';
comment on column public.messages.receiver_id is 'Counterparty profile (claimant, finder or reviewing administrator).';
comment on column public.messages.message is 'PRIVATE message body, visible only to the two participants and administrators.';
comment on column public.messages.read_at is 'Set when the receiver opens the thread; powers unread badges.';

grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;
