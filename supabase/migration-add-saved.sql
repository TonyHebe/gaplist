-- Run in Supabase SQL editor if you already created the posts table

alter table public.posts add column if not exists saved boolean not null default false;
alter table public.posts add column if not exists saved_at timestamptz;

create index if not exists posts_saved_idx on public.posts (saved) where saved = true;
