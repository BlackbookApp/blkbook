-- ============================================================
-- Add tiktok + youtube to vault_contacts
-- ============================================================

ALTER TABLE vault_contacts
  ADD COLUMN IF NOT EXISTS tiktok text,
  ADD COLUMN IF NOT EXISTS youtube text;

-- ============================================================
-- Rewrite perform_exchange to accept tiktok/youtube
-- Drop old signature first (arg count changed)
-- ============================================================

DROP FUNCTION IF EXISTS perform_exchange(uuid, text, text, text, text, text, text, text, jsonb, text);

CREATE OR REPLACE FUNCTION perform_exchange(
  p_recipient_profile_id  uuid,
  -- Recipient data → stored in initiator's vault
  p_recipient_name        text,
  p_recipient_role        text    DEFAULT NULL,
  p_recipient_photo_url   text    DEFAULT NULL,
  p_recipient_email       text    DEFAULT NULL,
  p_recipient_phone       text    DEFAULT NULL,
  p_recipient_instagram   text    DEFAULT NULL,
  p_recipient_tiktok      text    DEFAULT NULL,
  p_recipient_youtube     text    DEFAULT NULL,
  p_recipient_website     text    DEFAULT NULL,
  -- Initiator's chosen fields snapshot (JSONB)
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

  -- Add recipient to initiator's vault (idempotent via partial unique index)
  INSERT INTO vault_contacts
    (user_id, profile_id, name, role, photo_url, email, phone, instagram, tiktok, youtube, website)
  VALUES
    (v_uid, p_recipient_profile_id, p_recipient_name, p_recipient_role,
     p_recipient_photo_url, p_recipient_email, p_recipient_phone,
     p_recipient_instagram, p_recipient_tiktok, p_recipient_youtube, p_recipient_website)
  ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL
  DO UPDATE SET
    name      = EXCLUDED.name,
    role      = COALESCE(EXCLUDED.role,      vault_contacts.role),
    photo_url = COALESCE(EXCLUDED.photo_url, vault_contacts.photo_url),
    email     = COALESCE(EXCLUDED.email,     vault_contacts.email),
    phone     = COALESCE(EXCLUDED.phone,     vault_contacts.phone),
    instagram = COALESCE(EXCLUDED.instagram, vault_contacts.instagram),
    tiktok    = COALESCE(EXCLUDED.tiktok,    vault_contacts.tiktok),
    youtube   = COALESCE(EXCLUDED.youtube,   vault_contacts.youtube),
    website   = COALESCE(EXCLUDED.website,   vault_contacts.website),
    updated_at = now();

  -- Create exchange record (idempotent via member unique index)
  INSERT INTO exchanges
    (initiator_profile_id, recipient_profile_id, initiator_shared_fields, initiator_note)
  VALUES
    (v_profile_id, p_recipient_profile_id, p_initiator_fields, p_note)
  ON CONFLICT (initiator_profile_id, recipient_profile_id)
    WHERE initiator_profile_id IS NOT NULL
  DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION perform_exchange(uuid, text, text, text, text, text, text, text, text, text, jsonb, text) TO authenticated;

-- ============================================================
-- Rewrite accept_exchange to:
--   1. Include tiktok/youtube when upserting initiator into vault
--   2. Build recipient snapshot pulling socials from profile_components
-- ============================================================

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

  -- Lock the row; validates recipient + pending status
  SELECT * INTO v_exchange
  FROM exchanges
  WHERE id                   = p_exchange_id
    AND recipient_profile_id = v_profile_id
    AND status               = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange not found or already responded';
  END IF;

  -- Build full snapshot of recipient's profile.
  -- Socials (instagram/tiktok/youtube) come from the social_stat component.
  WITH social_items AS (
    SELECT jsonb_array_elements(pc.data->'items') AS item
    FROM profile_components pc
    WHERE pc.profile_id = v_profile_id
      AND pc.type = 'social_stat'
    LIMIT 50
  )
  SELECT jsonb_strip_nulls(jsonb_build_object(
    'name',      p.full_name,
    'username',  p.username,
    'role',      p.role,
    'photo_url', p.avatar_url,
    'email',     p.social_links->>'email',
    'phone',     p.social_links->>'phone',
    'website',   p.social_links->>'website',
    'location',  p.location,
    'instagram', (SELECT item->>'handle' FROM social_items WHERE lower(item->>'platform') = 'instagram' LIMIT 1),
    'tiktok',    (SELECT item->>'handle' FROM social_items WHERE lower(item->>'platform') = 'tiktok'    LIMIT 1),
    'youtube',   (SELECT item->>'handle' FROM social_items WHERE lower(item->>'platform') = 'youtube'   LIMIT 1)
  ))
  INTO v_fields
  FROM profiles p WHERE p.id = v_profile_id;

  -- Mark accepted + store recipient's snapshot
  UPDATE exchanges SET
    status                  = 'accepted',
    recipient_shared_fields = v_fields
  WHERE id = p_exchange_id;

  -- Upsert initiator into recipient's vault
  IF v_exchange.initiator_profile_id IS NOT NULL THEN
    INSERT INTO vault_contacts (
      user_id, profile_id, name, role, photo_url, email, phone, instagram, tiktok, youtube, website
    ) VALUES (
      v_uid,
      v_exchange.initiator_profile_id,
      v_exchange.initiator_shared_fields->>'name',
      v_exchange.initiator_shared_fields->>'role',
      v_exchange.initiator_shared_fields->>'photo_url',
      v_exchange.initiator_shared_fields->>'email',
      v_exchange.initiator_shared_fields->>'phone',
      v_exchange.initiator_shared_fields->>'instagram',
      v_exchange.initiator_shared_fields->>'tiktok',
      v_exchange.initiator_shared_fields->>'youtube',
      v_exchange.initiator_shared_fields->>'website'
    )
    ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL
    DO UPDATE SET
      name      = EXCLUDED.name,
      role      = COALESCE(EXCLUDED.role,      vault_contacts.role),
      photo_url = COALESCE(EXCLUDED.photo_url, vault_contacts.photo_url),
      email     = COALESCE(EXCLUDED.email,     vault_contacts.email),
      phone     = COALESCE(EXCLUDED.phone,     vault_contacts.phone),
      instagram = COALESCE(EXCLUDED.instagram, vault_contacts.instagram),
      tiktok    = COALESCE(EXCLUDED.tiktok,    vault_contacts.tiktok),
      youtube   = COALESCE(EXCLUDED.youtube,   vault_contacts.youtube),
      website   = COALESCE(EXCLUDED.website,   vault_contacts.website),
      updated_at = now();
  ELSE
    -- Guest initiator: create new entry (split contact into email/phone by heuristic)
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
