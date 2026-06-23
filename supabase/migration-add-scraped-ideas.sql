-- Run in Supabase SQL editor to add Scraped Ideas table

set session characteristics as transaction read write;
set default_transaction_read_only = off;

create table if not exists public.scraped_ideas (
  id text primary key,
  title text not null,
  description text,
  subreddit text not null,
  permalink text not null,
  author text not null,
  upvotes integer not null default 0,
  comments_count integer not null default 0,
  tags text[] not null default '{}',
  created_utc timestamptz not null,
  fetched_at timestamptz not null default now()
);

create index if not exists scraped_ideas_created_utc_idx on public.scraped_ideas (created_utc desc);
create index if not exists scraped_ideas_upvotes_idx on public.scraped_ideas (upvotes desc);
create index if not exists scraped_ideas_subreddit_idx on public.scraped_ideas (subreddit);

alter table public.scraped_ideas enable row level security;

create policy "Public read access for scraped_ideas"
  on public.scraped_ideas
  for select
  to anon, authenticated
  using (true);

-- Service role bypasses RLS for inserts from the fetch job
