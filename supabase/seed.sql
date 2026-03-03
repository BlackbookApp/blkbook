-- Seed user (password: "password123")
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'seed@blackbook.local',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Seed User"}',
  now(),
  now()
);

insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'seed@blackbook.local',
  'email',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"seed@blackbook.local"}',
  now(),
  now()
);

insert into public.profiles (
  id,
  full_name,
  invite_code,
  invites_remaining,
  membership_type
) values (
  '00000000-0000-0000-0000-000000000001',
  'Seed User',
  'SEEDUSER',
  10,
  'member'
);

-- Invitation from seed user (use this link: /invite?ref=SEED0001)
insert into public.invitations (code, inviter_id)
values ('SEED0001', '00000000-0000-0000-0000-000000000001');
