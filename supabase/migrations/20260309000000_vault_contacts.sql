create table vault_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  role text,
  city text,
  email text,
  phone text,
  instagram text,
  website text,
  notes text,
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table vault_contacts enable row level security;
create policy "owner_all" on vault_contacts for all using (auth.uid() = user_id);
create index vault_contacts_user_id_name_idx on vault_contacts(user_id, name);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger vault_contacts_updated_at
before update on vault_contacts
for each row execute function update_updated_at();
