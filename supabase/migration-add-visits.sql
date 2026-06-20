-- Run in Supabase SQL editor for campaign visit tracking (Naano, Reddit, LinkedIn)

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ref text,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists visits_created_at_idx on public.visits (created_at desc);
create index if not exists visits_utm_source_idx on public.visits (utm_source);

alter table public.visits enable row level security;
