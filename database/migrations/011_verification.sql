-- =====================================================================
-- 011_verification.sql
-- Ownership verification: questions, claimant answers and secure scoring.
-- This is the anti-fraud core of the platform.
-- =====================================================================

create table if not exists public.verification_questions (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid not null references public.items (id) on delete cascade,
  question        text not null,
  expected_answer text not null,
  question_type   text not null default 'unique_feature'
                    check (question_type in ('unique_feature', 'damage', 'colour', 'accessory',
                                             'contents', 'serial', 'imei', 'other')),
  weight          numeric(5, 2) not null default 1 check (weight > 0),
  is_active       boolean not null default true,
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.verification_questions is
  'Ownership verification questions derived from an item''s private identifying details. Authored by the finder (or an administrator) for found items. CRITICAL: expected_answer must NEVER reach a claimant. Client code reads questions through the public.claim_questions view or the get_verification_questions() function, both of which omit expected_answer; direct SELECT on this table is restricted to administrators and the item author by RLS.';
comment on column public.verification_questions.question is
  'Question text shown to the claimant. Safe to expose.';
comment on column public.verification_questions.expected_answer is
  'HIGHLY SENSITIVE SECRET. Never selected by client queries; compared only inside the SECURITY DEFINER function score_claim_response().';
comment on column public.verification_questions.question_type is
  'Maps the question to a claim scoring bucket (serial/imei -> serial score, unique_feature -> unique feature score, ...).';
comment on column public.verification_questions.weight is
  'Relative weight of this question inside its scoring bucket.';

grant select, insert, update, delete on public.verification_questions to authenticated;
grant all on public.verification_questions to service_role;

-- ---------------------------------------------------------------------
-- Safe projection of questions (no expected_answer).
-- security_invoker so the caller's RLS on items still applies.
-- ---------------------------------------------------------------------
create or replace view public.claim_questions
with (security_invoker = on) as
  select id, item_id, question, question_type, weight, created_at
  from public.verification_questions
  where is_active;

comment on view public.claim_questions is
  'Claimant-safe view of verification_questions: exposes question text only, never expected_answer. Application code MUST use this view (or get_verification_questions()) when rendering the claim wizard.';

grant select on public.claim_questions to authenticated;

-- ---------------------------------------------------------------------
-- Claim responses: the claimant's answers plus a server-computed score.
-- ---------------------------------------------------------------------
create table if not exists public.claim_responses (
  id          uuid primary key default gen_random_uuid(),
  claim_id    uuid not null references public.claims (id) on delete cascade,
  question_id uuid not null references public.verification_questions (id) on delete cascade,
  response    text not null,
  score       numeric(5, 2) check (score >= 0 and score <= 100),
  scored_at   timestamptz,
  created_at  timestamptz not null default now(),
  unique (claim_id, question_id)
);

comment on table public.claim_responses is
  'Answers given by a claimant to the ownership verification questions of a claim. The score column is written ONLY by the database function score_claim_response(); clients cannot compute or fake it. Claimants may read their own responses but never the score interpretation logic.';
comment on column public.claim_responses.response is
  'PRIVATE claimant answer. Readable by the claimant and administrators.';
comment on column public.claim_responses.score is
  'ADMIN-FACING per-answer similarity score 0-100, computed server-side.';

grant select, insert on public.claim_responses to authenticated;
grant all on public.claim_responses to service_role;
