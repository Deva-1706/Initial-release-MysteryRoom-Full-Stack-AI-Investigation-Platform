-- MysteryRoom Phase 2: complete persistence schema.
-- Safe to run more than once in Supabase SQL Editor.
-- Existing rows are preserved. Existing columns are not overwritten.

create table if not exists public.mysteries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null default '',
  premise text not null default '',
  difficulty text not null default 'Medium',
  base_points integer not null default 150,
  suspects jsonb not null default '[]'::jsonb,
  clues jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  solution jsonb not null default '{}'::jsonb,
  discovered_clue_ids jsonb not null default '[]'::jsonb,
  revealed_hint_indexes jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  accusation jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add fields that may be absent from an earlier starter table.
alter table public.mysteries
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists title text not null default '',
  add column if not exists premise text not null default '',
  add column if not exists difficulty text not null default 'Medium',
  add column if not exists base_points integer not null default 150,
  add column if not exists suspects jsonb not null default '[]'::jsonb,
  add column if not exists clues jsonb not null default '[]'::jsonb,
  add column if not exists hints jsonb not null default '[]'::jsonb,
  add column if not exists solution jsonb not null default '{}'::jsonb,
  add column if not exists discovered_clue_ids jsonb not null default '[]'::jsonb,
  add column if not exists revealed_hint_indexes jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'active',
  add column if not exists accusation jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists mysteries_user_created_idx
  on public.mysteries (user_id, created_at desc);

create index if not exists mysteries_user_status_updated_idx
  on public.mysteries (user_id, status, updated_at desc);

alter table public.mysteries enable row level security;

drop policy if exists "Mystery owners can read their cases" on public.mysteries;
create policy "Mystery owners can read their cases"
  on public.mysteries for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own mysteries" on public.mysteries;
create policy "Users can create their own mysteries"
  on public.mysteries for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Mystery owners can update their cases" on public.mysteries;
create policy "Mystery owners can update their cases"
  on public.mysteries for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Mystery owners can delete their cases" on public.mysteries;
create policy "Mystery owners can delete their cases"
  on public.mysteries for delete to authenticated
  using (auth.uid() = user_id);
