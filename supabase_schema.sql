-- Supabase Schema for Deinxel Web Services
-- Safe to run more than once in the Supabase SQL editor.

create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Client'),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Public inquiry messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text,
  budget text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Bookings / project requests
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text,
  email text,
  phone text,
  company text,
  service_type text not null,
  project_type text,
  meeting_date date,
  meeting_time text,
  budget text,
  timeline text,
  requirements text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings add column if not exists name text;
alter table public.bookings add column if not exists email text;
alter table public.bookings add column if not exists phone text;
alter table public.bookings add column if not exists company text;
alter table public.bookings add column if not exists budget text;
alter table public.bookings add column if not exists timeline text;
alter table public.bookings add column if not exists updated_at timestamptz not null default now();

-- Orders / project progress shown in the client portal
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'revision', 'completed', 'delivered')),
  progress integer not null default 0 check (progress between 0 and 100),
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists progress integer not null default 0 check (progress between 0 and 100);
alter table public.orders add column if not exists updated_at timestamptz not null default now();

-- Optional asset metadata for admin/client reporting.
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  order_id uuid references public.orders on delete set null,
  file_name text not null,
  file_path text not null,
  bucket text not null default 'clients',
  created_at timestamptz not null default now()
);

-- Chat Messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users on delete cascade not null,
  recipient_id uuid references auth.users on delete cascade,
  content text not null,
  file_url text,
  created_at timestamptz not null default now()
);

alter table public.chat_messages add column if not exists recipient_id uuid references auth.users on delete cascade;

-- Updated-at automation
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.assets enable row level security;
alter table public.chat_messages enable row level security;

-- Reset policies for repeatable setup.
drop policy if exists "Profiles are readable by owner or admins" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner or admins" on public.profiles;

create policy "Profiles are readable by owner or admins"
on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Profiles are updatable by owner or admins"
on public.profiles for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Anyone can create inquiries" on public.contact_messages;
drop policy if exists "Admins can manage inquiries" on public.contact_messages;

create policy "Anyone can create inquiries"
on public.contact_messages for insert
with check (true);

create policy "Admins can manage inquiries"
on public.contact_messages for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can create bookings" on public.bookings;
drop policy if exists "Users can read matching bookings" on public.bookings;
drop policy if exists "Admins can manage bookings" on public.bookings;

create policy "Anyone can create bookings"
on public.bookings for insert
with check (user_id is null or auth.uid() = user_id);

create policy "Users can read matching bookings"
on public.bookings for select
using (
  auth.uid() = user_id
  or email = auth.jwt()->>'email'
  or public.is_admin(auth.uid())
);

create policy "Admins can manage bookings"
on public.bookings for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Users can read own orders" on public.orders;
drop policy if exists "Admins can manage orders" on public.orders;

create policy "Users can read own orders"
on public.orders for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Admins can manage orders"
on public.orders for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Users can read own assets" on public.assets;
drop policy if exists "Admins can manage assets" on public.assets;

create policy "Users can read own assets"
on public.assets for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Admins can manage assets"
on public.assets for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Users can send chat messages" on public.chat_messages;
drop policy if exists "Users can read their chat messages" on public.chat_messages;
drop policy if exists "Admins can manage chat messages" on public.chat_messages;

create policy "Users can send chat messages"
on public.chat_messages for insert
with check (auth.uid() = sender_id);

create policy "Users can read their chat messages"
on public.chat_messages for select
using (
  auth.uid() = sender_id
  or auth.uid() = recipient_id
  or public.is_admin(auth.uid())
  or (recipient_id is null and public.is_admin(sender_id))
);

create policy "Admins can manage chat messages"
on public.chat_messages for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Storage bucket and policies for client assets.
insert into storage.buckets (id, name, public)
values ('clients', 'clients', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users can read client files" on storage.objects;
drop policy if exists "Users can upload client files" on storage.objects;
drop policy if exists "Users can update client files" on storage.objects;
drop policy if exists "Users can delete client files" on storage.objects;

create policy "Users can read client files"
on storage.objects for select
using (
  bucket_id = 'clients'
  and (
    public.is_admin(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "Users can upload client files"
on storage.objects for insert
with check (
  bucket_id = 'clients'
  and auth.uid() is not null
  and (
    public.is_admin(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "Users can update client files"
on storage.objects for update
using (
  bucket_id = 'clients'
  and (
    public.is_admin(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
)
with check (
  bucket_id = 'clients'
  and (
    public.is_admin(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "Users can delete client files"
on storage.objects for delete
using (
  bucket_id = 'clients'
  and (
    public.is_admin(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);
