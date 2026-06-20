-- Run in Supabase SQL editor (paste everything below as one query)

set session characteristics as transaction read write;
set default_transaction_read_only = off;

create table if not exists public.posts (
  id text primary key,
  title text not null,
  snippet text,
  subreddit text not null,
  permalink text not null,
  created_utc timestamptz not null,
  category text,
  pain_score integer check (pain_score between 1 and 10),
  tagged_at timestamptz,
  fetched_at timestamptz not null default now(),
  saved boolean not null default false,
  saved_at timestamptz
);

create index if not exists posts_created_utc_idx on public.posts (created_utc desc);
create index if not exists posts_pain_score_idx on public.posts (pain_score desc nulls last);
create index if not exists posts_subreddit_idx on public.posts (subreddit);
create index if not exists posts_saved_idx on public.posts (saved) where saved = true;

alter table public.posts enable row level security;

create policy "Public read access"
  on public.posts
  for select
  to anon, authenticated
  using (true);

-- Service role bypasses RLS for inserts/updates from the cron job.
