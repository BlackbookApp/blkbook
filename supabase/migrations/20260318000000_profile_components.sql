create table profile_components (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid references profiles(id) on delete cascade,
  type          text not null,
  position      integer not null default 1000,
  data          jsonb not null default '{}',
  is_predefined boolean not null default false,
  ai_generated  boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index on profile_components(profile_id, position);

alter table profile_components enable row level security;

create policy "owner access"
  on profile_components for all
  using (profile_id in (
    select id from profiles where user_id = auth.uid()
  ));

create policy "public read for live profiles"
  on profile_components for select
  using (profile_id in (
    select id from profiles where is_published = true
  ));

create or replace function merge_component_data(
  p_component_id uuid,
  p_patch        jsonb
)
returns profile_components language plpgsql security definer as $$
declare result profile_components;
begin
  update profile_components
  set data = data || p_patch, ai_generated = false, updated_at = now()
  where id = p_component_id
    and profile_id in (select id from profiles where user_id = auth.uid())
  returning * into result;
  if not found then raise exception 'Access denied'; end if;
  return result;
end; $$;
