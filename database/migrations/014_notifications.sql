-- =====================================================================
-- 014_notifications.sql
-- In-app notifications (no external email/SMS provider assumed).
-- =====================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  type        text not null
                check (type in ('match_found', 'claim_submitted', 'claim_under_review',
                                'evidence_required', 'claim_approved', 'claim_rejected',
                                'claim_disputed', 'handover_scheduled', 'item_recovered',
                                'message_received', 'admin_alert', 'system')),
  title       text not null,
  message     text not null,
  entity_type text,
  entity_id   uuid,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

comment on table public.notifications is
  'In-app notification inbox. One row per recipient. Rows are created by database triggers and by service functions (match found, claim submitted, evidence required, claim approved, handover scheduled, item recovered). Users may read and mark their own notifications read; they can never create notifications for other users.';
comment on column public.notifications.user_id is 'Recipient. PRIVATE: RLS restricts every row to its recipient (and administrators).';
comment on column public.notifications.entity_type is 'Deep-link target type: item | claim | match | handover | message.';
comment on column public.notifications.entity_id is 'Deep-link target id used by the frontend to route the user.';
comment on column public.notifications.read_at is 'Null while unread.';

grant select, insert, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
