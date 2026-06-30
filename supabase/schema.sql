-- =============================================================================
-- POP Card — Supabase schema
-- =============================================================================
-- Run this once in the Supabase SQL editor (or `supabase db push`) on a fresh
-- project. It creates one row per signed-up user across a handful of tables,
-- all scoped by `user_id = auth.uid()` via Row Level Security — so every
-- student's data (and only theirs) is reachable through the anon/public API
-- key once they're logged in. Nothing here is shared across users except the
-- public-card read path, which is opened deliberately (see "Public reads").
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles — one row per auth.users row, created automatically on sign up
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  avatar_url text,
  skills text[] not null default '{}',
  career_goals text[] not null default '{}',
  hobbies text[] not null default '{}',
  languages text[] not null default '{}',

  -- education
  university_name text not null default '',
  college_name text not null default '',
  degree text not null default '',
  branch text not null default '',
  current_semester text not null default '',
  graduation_year text not null default '',
  cgpa text not null default '',
  tenth_percentage text not null default '',
  twelfth_percentage text not null default '',
  academic_summary text not null default '',

  -- verification
  tenth_status text not null default 'pending' check (tenth_status in ('pending','review','verified','rejected')),
  twelfth_status text not null default 'pending' check (twelfth_status in ('pending','review','verified','rejected')),
  identity_status text not null default 'pending' check (identity_status in ('pending','review','verified','rejected')),

  -- builder settings
  show_education boolean not null default true,
  show_cgpa boolean not null default true,
  show_tenth boolean not null default true,
  show_twelfth boolean not null default true,
  show_certificates boolean not null default true,
  show_achievements boolean not null default true,
  show_skills boolean not null default true,
  show_goals boolean not null default true,
  show_hobbies boolean not null default true,
  theme text not null default 'indigo-purple',
  custom_username text unique not null,

  -- preferences
  profile_public boolean not null default true,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  recruiter_mode boolean not null default true,
  index_search boolean not null default true,
  notify_profile_views boolean not null default true,
  notify_cert_verified boolean not null default true,
  notify_weekly_digest boolean not null default false,
  notify_recruiter_contact boolean not null default true,
  notify_system_updates boolean not null default true,

  profile_views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Anyone can view a public profile by username"
  on public.profiles for select
  using (profile_public = true);

-- ---------------------------------------------------------------------------
-- 2. certificates
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organization text not null,
  date text not null default '',
  url text not null default '#',
  image_url text,
  status text not null default 'pending' check (status in ('pending','review','verified','rejected')),
  created_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

create policy "Users can manage their own certificates"
  on public.certificates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view certificates of a public profile"
  on public.certificates for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = certificates.user_id and p.profile_public = true
    )
  );

-- ---------------------------------------------------------------------------
-- 3. achievements
-- ---------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_name text not null,
  date text not null default '',
  description text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "Users can manage their own achievements"
  on public.achievements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view achievements of a public profile"
  on public.achievements for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = achievements.user_id and p.profile_public = true
    )
  );

-- ---------------------------------------------------------------------------
-- 4. activity — recent-activity feed shown on the dashboard home
-- ---------------------------------------------------------------------------
create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.activity enable row level security;

create policy "Users can manage their own activity"
  on public.activity for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. Auto-create a profile row whenever someone signs up
-- ---------------------------------------------------------------------------
-- Captures full name / phone passed in via `options.data` on
-- `supabase.auth.signUp(...)` (see src/app/auth/register/page.tsx) plus the
-- email, so every signed-up user's name, email, and phone land in
-- `profiles` immediately — visible in Table Editor right after sign-up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g'));
  base_username := trim(both '-' from base_username);
  if base_username = '' then
    base_username := 'user';
  end if;
  final_username := base_username;

  while exists (select 1 from public.profiles where custom_username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || '-' || suffix;
  end loop;

  insert into public.profiles (id, full_name, email, phone, custom_username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    final_username
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep profiles.email in sync if it's ever changed via Supabase Auth directly.
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles set email = new.email, updated_at = now() where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute procedure public.handle_user_email_update();

-- ---------------------------------------------------------------------------
-- 6. Storage buckets — avatar / certificate / achievement photo uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('achievements', 'achievements', true)
on conflict (id) do nothing;

-- Each user may only write inside a folder named after their own user id
-- (e.g. `avatars/<uid>/photo.jpg`), enforced by checking the first path
-- segment against auth.uid(). Public read is open since these power the
-- public POP Card page.
create policy "Public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload own avatar" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own avatar" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own avatar" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Public read certificate photos" on storage.objects for select using (bucket_id = 'certificates');
create policy "Users upload own certificate photos" on storage.objects for insert
  with check (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own certificate photos" on storage.objects for update
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own certificate photos" on storage.objects for delete
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Public read achievement photos" on storage.objects for select using (bucket_id = 'achievements');
create policy "Users upload own achievement photos" on storage.objects for insert
  with check (bucket_id = 'achievements' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own achievement photos" on storage.objects for update
  using (bucket_id = 'achievements' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own achievement photos" on storage.objects for delete
  using (bucket_id = 'achievements' and (storage.foldername(name))[1] = auth.uid()::text);
