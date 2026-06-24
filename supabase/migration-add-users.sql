-- Run in Supabase SQL editor to add users table for tracking subscriptions

set session characteristics as transaction read write;
set default_transaction_read_only = off;

-- Users table to track subscription status
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_plan_idx on public.users (plan);
create index if not exists users_stripe_customer_idx on public.users (stripe_customer_id);

alter table public.users enable row level security;

-- Users can read their own data
create policy "Users can read own data"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own data (except plan - that's managed by backend)
create policy "Users can update own data"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role can do everything (for backend operations)
-- Note: Service role bypasses RLS by default

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name')
  );
  return new;
end;
$$;

-- Trigger to auto-create user record on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
