-- Store the recipient's note on the exchange record so it persists before acceptance.
-- accept_exchange reads recipient_note from the row instead of taking a parameter.

ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS recipient_note text;

-- Drop the 2-param overload introduced by 20260421100000 (p_note parameter approach).
DROP FUNCTION IF EXISTS accept_exchange(uuid, text);

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
  WHERE id                   = p_exchange_id
    AND recipient_profile_id = v_profile_id
    AND status               = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange not found or already responded';
  END IF;

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

  UPDATE exchanges SET
    status                  = 'accepted',
    recipient_shared_fields = v_fields
  WHERE id = p_exchange_id;

  -- Upsert initiator into vault, carrying the saved recipient_note.
  IF v_exchange.initiator_profile_id IS NOT NULL THEN
    INSERT INTO vault_contacts (
      user_id, profile_id, name, role, photo_url, email, phone, instagram, tiktok, youtube, website, notes
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
      v_exchange.initiator_shared_fields->>'website',
      v_exchange.recipient_note
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
      notes     = COALESCE(EXCLUDED.notes,     vault_contacts.notes),
      updated_at = now();
  ELSE
    INSERT INTO vault_contacts (user_id, name, email, phone, notes)
    VALUES (
      v_uid,
      v_exchange.initiator_shared_fields->>'name',
      COALESCE(
        NULLIF(v_exchange.initiator_shared_fields->>'email', ''),
        CASE WHEN v_exchange.initiator_shared_fields->>'contact' LIKE '%@%'
             THEN split_part(v_exchange.initiator_shared_fields->>'contact', ' / ', 1)
             ELSE NULL END
      ),
      COALESCE(
        NULLIF(v_exchange.initiator_shared_fields->>'phone', ''),
        CASE WHEN v_exchange.initiator_shared_fields->>'contact' NOT LIKE '%@%'
             THEN v_exchange.initiator_shared_fields->>'contact'
             WHEN v_exchange.initiator_shared_fields->>'contact' LIKE '% / %'
             THEN NULLIF(split_part(v_exchange.initiator_shared_fields->>'contact', ' / ', 2), '')
             ELSE NULL END
      ),
      v_exchange.recipient_note
    );
  END IF;
END;
$$;
