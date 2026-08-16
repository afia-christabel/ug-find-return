-- =====================================================================
-- 017_audit_logs.sql
-- Append-only audit trail for every security relevant action.
-- =====================================================================

create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

comment on table public.audit_logs is
  'Append-only audit trail: user registered, report created/edited, claim submitted, evidence uploaded, admin reviewed claim, claim approved/rejected, handover created/completed, item recovered, user suspended, dispute resolved. Normal users can NEVER insert, update or delete rows; entries are written by SECURITY DEFINER functions and triggers. Only administrators may read the log.';
comment on column public.audit_logs.user_id is 'Actor. Null for system generated entries.';
comment on column public.audit_logs.action is 'Stable action code, e.g. claim.approved, handover.completed.';
comment on column public.audit_logs.entity_type is 'Entity family touched: item | claim | evidence | handover | profile | report.';
comment on column public.audit_logs.metadata is 'ADMIN-ONLY structured context. Never store passwords, tokens or raw expected answers here.';

-- Only administrators read; writes go through log_audit_event().
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;

create or replace function public.log_audit_event(
  _action text,
  _entity_type text default null,
  _entity_id uuid default null,
  _metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _id uuid;
begin
  insert into public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), _action, _entity_type, _entity_id, coalesce(_metadata, '{}'::jsonb))
  returning id into _id;
  return _id;
end;
$$;

comment on function public.log_audit_event(text, text, uuid, jsonb) is
  'Only supported way for application code to append to audit_logs. SECURITY DEFINER so users can record their own actions without being able to read, edit or delete the log.';

grant execute on function public.log_audit_event(text, text, uuid, jsonb) to authenticated;
