-- MysteryRoom Phase 2 + Phase 3 database migration
-- Safe to run more than once. Execute in Supabase SQL Editor.

-- Phase 2: persistence and efficient per-user investigation history.
-- The existing mysteries table already stores investigation state in:
-- discovered_clue_ids, revealed_hint_indexes, status, accusation,
-- created_at and updated_at. This migration adds ownership and indexes.

alter table public.mysteries
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Ensure updated_at is available for saved progress timestamps.
alter table public.mysteries
  add column if not exists updated_at timestamptz not null default now();

create index if not exists mysteries_user_id_created_at_idx
  on public.mysteries (user_id, created_at desc);

create index if not exists mysteries_user_id_status_updated_at_idx
  on public.mysteries (user_id, status, updated_at desc);

-- Phase 3: keep direct browser access closed. The Express API validates
-- Supabase Auth access tokens and scopes every read/update/delete by user_id.
-- The server's Supabase secret key must never be exposed to the browser.
alter table public.mysteries enable row level security;

-- Existing anonymous/demo rows remain user_id = NULL. They are not silently
-- assigned to a user account. New mysteries are owned by the authenticated user.
