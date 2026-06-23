-- Run in Supabase SQL editor to add AI Ideas table

set session characteristics as transaction read write;
set default_transaction_read_only = off;

create table if not exists public.ai_ideas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  confidence integer not null check (confidence between 0 and 100),
  signals_count integer not null default 0,
  tags text[] not null default '{}',
  source_post_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists ai_ideas_created_at_idx on public.ai_ideas (created_at desc);
create index if not exists ai_ideas_confidence_idx on public.ai_ideas (confidence desc);
create index if not exists ai_ideas_category_idx on public.ai_ideas (category);

alter table public.ai_ideas enable row level security;

create policy "Public read access for ai_ideas"
  on public.ai_ideas
  for select
  to anon, authenticated
  using (true);

-- Service role bypasses RLS for inserts from the AI generation job
