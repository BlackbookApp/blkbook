-- ============================================================
-- Decouple profiles.id from auth.users.id
-- Add user_id as the auth reference; profiles.id becomes its
-- own independent UUID PK.
-- ============================================================

-- 1. Add user_id column (nullable first, backfill, then constrain)
ALTER TABLE profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
UPDATE profiles SET user_id = id;
ALTER TABLE profiles ALTER COLUMN user_id SET NOT NULL;
CREATE UNIQUE INDEX profiles_user_id_unique ON profiles(user_id); -- 1:1 for now

-- 2. Drop FK from profiles.id → auth.users (id becomes plain UUID PK)
ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Update profiles RLS
DROP POLICY "profiles_update_own" ON profiles;
DROP POLICY "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- 4. Update portfolio_images RLS
DROP POLICY "owner can insert portfolio_images" ON portfolio_images;
DROP POLICY "owner can update portfolio_images" ON portfolio_images;
DROP POLICY "owner can delete portfolio_images" ON portfolio_images;
CREATE POLICY "owner can insert portfolio_images" ON portfolio_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "owner can update portfolio_images" ON portfolio_images FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "owner can delete portfolio_images" ON portfolio_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid()));

-- 5. Update exchanges RLS
DROP POLICY "recipient can view exchanges" ON exchanges;
DROP POLICY "initiator can view own exchanges" ON exchanges;
DROP POLICY "recipient can respond to exchange" ON exchanges;
CREATE POLICY "recipient can view exchanges" ON exchanges FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = recipient_profile_id AND user_id = auth.uid()));
CREATE POLICY "initiator can view own exchanges" ON exchanges FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = initiator_profile_id AND user_id = auth.uid()));
CREATE POLICY "recipient can respond to exchange" ON exchanges FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = recipient_profile_id AND user_id = auth.uid()));

-- 6. Update invitations RLS
DROP POLICY "invitations_select_own" ON invitations;
DROP POLICY "invitations_insert_own" ON invitations;
CREATE POLICY "invitations_select_own" ON invitations FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = inviter_id AND user_id = auth.uid()));
CREATE POLICY "invitations_insert_own" ON invitations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = inviter_id AND user_id = auth.uid()));

-- 7. Rewrite RPCs

-- perform_exchange: look up profile id from user_id
CREATE OR REPLACE FUNCTION perform_exchange(
  p_recipient_profile_id  uuid,
  p_recipient_name        text,
  p_recipient_role        text    DEFAULT NULL,
  p_recipient_photo_url   text    DEFAULT NULL,
  p_recipient_email       text    DEFAULT NULL,
  p_recipient_phone       text    DEFAULT NULL,
  p_recipient_instagram   text    DEFAULT NULL,
  p_recipient_website     text    DEFAULT NULL,
  p_initiator_fields      jsonb   DEFAULT '{}',
  p_note                  text    DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid        uuid := auth.uid();
  v_profile_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_uid;
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  INSERT INTO vault_contacts
    (user_id, profile_id, name, role, photo_url, email, phone, instagram, website)
  VALUES
    (v_uid, p_recipient_profile_id, p_recipient_name, p_recipient_role,
     p_recipient_photo_url, p_recipient_email, p_recipient_phone,
     p_recipient_instagram, p_recipient_website)
  ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL
  DO UPDATE SET
    name       = EXCLUDED.name,
    role       = COALESCE(EXCLUDED.role,      vault_contacts.role),
    photo_url  = COALESCE(EXCLUDED.photo_url, vault_contacts.photo_url),
    email      = COALESCE(EXCLUDED.email,     vault_contacts.email),
    phone      = COALESCE(EXCLUDED.phone,     vault_contacts.phone),
    instagram  = COALESCE(EXCLUDED.instagram, vault_contacts.instagram),
    website    = COALESCE(EXCLUDED.website,   vault_contacts.website),
    updated_at = now();

  INSERT INTO exchanges
    (initiator_profile_id, recipient_profile_id, initiator_shared_fields, initiator_note)
  VALUES
    (v_profile_id, p_recipient_profile_id, p_initiator_fields, p_note)
  ON CONFLICT (initiator_profile_id, recipient_profile_id)
    WHERE initiator_profile_id IS NOT NULL
  DO NOTHING;
END;
$$;

-- accept_exchange: look up profile id from user_id
CREATE OR REPLACE FUNCTION accept_exchange(p_exchange_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid        uuid := auth.uid();
  v_profile_id uuid;
  v_exchange   exchanges%ROWTYPE;
  v_fields     jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_uid;
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  SELECT * INTO v_exchange
  FROM exchanges
  WHERE id                  = p_exchange_id
    AND recipient_profile_id = v_profile_id
    AND status               = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange not found or already responded';
  END IF;

  SELECT jsonb_strip_nulls(jsonb_build_object(
    'name',      full_name,
    'username',  username,
    'role',      role,
    'photo_url', avatar_url,
    'email',     social_links->>'email',
    'phone',     social_links->>'phone',
    'instagram', social_links->>'instagram',
    'website',   social_links->>'website',
    'location',  location
  ))
  INTO v_fields
  FROM profiles WHERE id = v_profile_id;

  UPDATE exchanges SET
    status                  = 'accepted',
    recipient_shared_fields = v_fields
  WHERE id = p_exchange_id;

  IF v_exchange.initiator_profile_id IS NOT NULL THEN
    INSERT INTO vault_contacts (
      user_id, profile_id, name, role, photo_url, email, phone, instagram, website
    ) VALUES (
      v_uid,
      v_exchange.initiator_profile_id,
      v_exchange.initiator_shared_fields->>'name',
      v_exchange.initiator_shared_fields->>'role',
      v_exchange.initiator_shared_fields->>'photo_url',
      v_exchange.initiator_shared_fields->>'email',
      v_exchange.initiator_shared_fields->>'phone',
      v_exchange.initiator_shared_fields->>'instagram',
      v_exchange.initiator_shared_fields->>'website'
    )
    ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL
    DO UPDATE SET
      name       = EXCLUDED.name,
      role       = COALESCE(EXCLUDED.role,      vault_contacts.role),
      photo_url  = COALESCE(EXCLUDED.photo_url, vault_contacts.photo_url),
      email      = COALESCE(EXCLUDED.email,     vault_contacts.email),
      phone      = COALESCE(EXCLUDED.phone,     vault_contacts.phone),
      instagram  = COALESCE(EXCLUDED.instagram, vault_contacts.instagram),
      website    = COALESCE(EXCLUDED.website,   vault_contacts.website),
      updated_at = now();
  ELSE
    INSERT INTO vault_contacts (user_id, name, email, phone)
    VALUES (
      v_uid,
      v_exchange.initiator_shared_fields->>'name',
      CASE WHEN v_exchange.initiator_shared_fields->>'contact' LIKE '%@%'
           THEN v_exchange.initiator_shared_fields->>'contact' ELSE NULL END,
      CASE WHEN v_exchange.initiator_shared_fields->>'contact' NOT LIKE '%@%'
           THEN v_exchange.initiator_shared_fields->>'contact' ELSE NULL END
    );
  END IF;
END;
$$;

-- get_has_exchanged: look up profile id from user_id
CREATE OR REPLACE FUNCTION get_has_exchanged(p_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid        uuid := auth.uid();
  v_profile_id uuid;
BEGIN
  IF v_uid IS NULL THEN RETURN false; END IF;
  SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_uid;
  IF v_profile_id IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (
    SELECT 1 FROM exchanges
    WHERE initiator_profile_id = v_profile_id
      AND recipient_profile_id = p_profile_id
  );
END;
$$;

-- mark_invite_used: look up profile id from user_id before setting used_by
CREATE OR REPLACE FUNCTION public.mark_invite_used(p_code text, p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_profile_id uuid;
BEGIN
  SELECT id INTO v_profile_id FROM profiles WHERE user_id = p_user_id;
  IF v_profile_id IS NULL THEN RETURN; END IF;
  UPDATE invitations SET used_by = v_profile_id, used_at = now()
  WHERE code = p_code AND used_by IS NULL AND expires_at > now();
END;
$$;
