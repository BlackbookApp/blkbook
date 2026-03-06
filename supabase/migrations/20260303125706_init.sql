-- profiles table
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  role            text,
  location        text,
  bio             text,
  avatar_url      text,
  website         text,
  instagram       text,
  linkedin        text,
  phone           text,
  style           text,   -- 'visual' | 'editorial'
  palette         text,   -- 'blanc' | 'noir'
  brand_statement text,
  portfolio_images text[] default '{}',
  membership_type text default 'guest' check (membership_type in ('guest', 'member')),
  profile_complete boolean default false,
  is_published boolean default false, 
  invited_by      uuid references public.profiles(id) on delete set null,
  invite_code     text unique not null default substr(md5(random()::text), 1, 8),
  invites_remaining int default 10,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- invitations table
create table public.invitations (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  inviter_id    uuid references public.profiles(id) on delete cascade,
  invitee_email text,
  used_by       uuid references public.profiles(id) on delete set null,
  used_at       timestamptz,
  expires_at    timestamptz default (now() + interval '30 days'),
  created_at    timestamptz default now()
);

alter table public.invitations enable row level security;
create policy "invitations_select_own" on public.invitations for select using (auth.uid() = inviter_id);
create policy "invitations_validate_anon" on public.invitations for select
  using (used_by is null and expires_at > now());
create policy "invitations_insert_own" on public.invitations for insert
  with check (auth.uid() = inviter_id);

-- mark_invite_used: security definer bypasses RLS
create or replace function public.mark_invite_used(p_code text, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update invitations set used_by = p_user_id, used_at = now()
  where code = p_code and used_by is null and expires_at > now();
end; $$;

-- bootstrap seed invite
insert into public.invitations (code, inviter_id) values ('BLACKBOOK_SEED', null);
