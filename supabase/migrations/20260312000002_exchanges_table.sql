-- ============================================================
-- Replace exchange_requests with a unified exchanges table
-- ============================================================

-- Drop everything from previous exchange migrations
DROP TABLE IF EXISTS exchange_requests CASCADE;
DROP FUNCTION IF EXISTS create_guest_exchange_request(uuid, text, text, text);
DROP FUNCTION IF EXISTS get_has_exchanged(uuid);
-- perform_exchange signatures from prior migrations
DROP FUNCTION IF EXISTS perform_exchange CASCADE;

-- ============================================================
-- New exchanges table
-- ============================================================
CREATE TABLE exchanges (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who initiated (null = guest)
  initiator_profile_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  -- Snapshot of fields the initiator chose to share
  initiator_shared_fields jsonb NOT NULL DEFAULT '{}',
  initiator_note          text,

  -- Who received (always a member — you exchange with someone's profile)
  recipient_profile_id    uuid REFERENCES profiles(id) NOT NULL,
  -- Filled in when recipient accepts (full auto-share)
  recipient_shared_fields jsonb,

  status                  text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX ON exchanges (recipient_profile_id, status);
CREATE INDEX ON exchanges (initiator_profile_id);

-- One exchange per (member initiator, recipient) pair — idempotent
CREATE UNIQUE INDEX exchanges_member_unique
  ON exchanges (initiator_profile_id, recipient_profile_id)
  WHERE initiator_profile_id IS NOT NULL;

-- Guest dedup index: contact string within 24h window
CREATE INDEX ON exchanges (recipient_profile_id, ((initiator_shared_fields->>'contact')), created_at)
  WHERE initiator_profile_id IS NULL;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;

-- Recipient can see exchanges sent to them
CREATE POLICY "recipient can view exchanges"
  ON exchanges FOR SELECT
  USING (recipient_profile_id = auth.uid());

-- Member initiator can see exchanges they started
CREATE POLICY "initiator can view own exchanges"
  ON exchanges FOR SELECT
  USING (initiator_profile_id = auth.uid());

-- Anyone (including anon guests) can initiate
CREATE POLICY "anyone can initiate exchange"
  ON exchanges FOR INSERT
  WITH CHECK (true);

-- Recipient can accept / decline
CREATE POLICY "recipient can respond to exchange"
  ON exchanges FOR UPDATE
  USING (recipient_profile_id = auth.uid());

-- ============================================================
-- RPC: perform_exchange  (authenticated member initiates)
-- Atomically:
--   1. Adds recipient's profile to initiator's vault
--   2. Creates exchange record with initiator's selected fields
-- ============================================================
CREATE OR REPLACE FUNCTION perform_exchange(
  p_recipient_profile_id  uuid,
  -- Recipient data → goes into initiator's vault
  p_recipient_name        text,
  p_recipient_role        text    DEFAULT NULL,
  p_recipient_photo_url   text    DEFAULT NULL,
  p_recipient_email       text    DEFAULT NULL,
  p_recipient_phone       text    DEFAULT NULL,
  p_recipient_instagram   text    DEFAULT NULL,
  p_recipient_website     text    DEFAULT NULL,
  -- Initiator's chosen fields snapshot
  p_initiator_fields      jsonb   DEFAULT '{}',
  p_note                  text    DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Add recipient to initiator's vault (idempotent via partial unique index)
  INSERT INTO vault_contacts
    (user_id, profile_id, name, role, photo_url, email, phone, instagram, website)
  VALUES
    (v_uid, p_recipient_profile_id, p_recipient_name, p_recipient_role,
     p_recipient_photo_url, p_recipient_email, p_recipient_phone,
     p_recipient_instagram, p_recipient_website)
  ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL
  DO UPDATE SET
    name          = EXCLUDED.name,
    role          = COALESCE(EXCLUDED.role, vault_contacts.role),
    photo_url     = COALESCE(EXCLUDED.photo_url, vault_contacts.photo_url),
    email         = COALESCE(EXCLUDED.email, vault_contacts.email),
    phone         = COALESCE(EXCLUDED.phone, vault_contacts.phone),
    instagram     = COALESCE(EXCLUDED.instagram, vault_contacts.instagram),
    website       = COALESCE(EXCLUDED.website, vault_contacts.website),
    updated_at    = now();

  -- Create exchange record (idempotent via member unique index)
  INSERT INTO exchanges
    (initiator_profile_id, recipient_profile_id, initiator_shared_fields, initiator_note)
  VALUES
    (v_uid, p_recipient_profile_id, p_initiator_fields, p_note)
  ON CONFLICT (initiator_profile_id, recipient_profile_id)
    WHERE initiator_profile_id IS NOT NULL
  DO NOTHING;
END;
$$;

-- ============================================================
-- RPC: accept_exchange  (recipient accepts)
-- Atomically:
--   1. Validates ownership and pending status
--   2. Snapshots recipient's full profile → recipient_shared_fields
--   3. Marks exchange accepted
--   4. Upserts initiator into recipient's vault (merges by profile_id)
-- ============================================================
CREATE OR REPLACE FUNCTION accept_exchange(p_exchange_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid      uuid := auth.uid();
  v_exchange exchanges%ROWTYPE;
  v_fields   jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Lock the row; validates recipient + pending status
  SELECT * INTO v_exchange
  FROM exchanges
  WHERE id                  = p_exchange_id
    AND recipient_profile_id = v_uid
    AND status               = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange not found or already responded';
  END IF;

  -- Build full snapshot of recipient's current profile (auto-share everything filled)
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
  FROM profiles WHERE id = v_uid;

  -- Mark accepted + store recipient's snapshot
  UPDATE exchanges SET
    status                  = 'accepted',
    recipient_shared_fields = v_fields
  WHERE id = p_exchange_id;

  -- Upsert initiator into recipient's vault
  IF v_exchange.initiator_profile_id IS NOT NULL THEN
    -- Member initiator: merge by profile_id
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

-- ============================================================
-- RPC: create_guest_exchange  (unauthenticated guest initiates)
-- Returns true if created, false if deduped (same contact < 24h)
-- ============================================================
CREATE OR REPLACE FUNCTION create_guest_exchange(
  p_recipient_profile_id  uuid,
  p_initiator_fields      jsonb,   -- { name, contact }
  p_note                  text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_contact text := p_initiator_fields->>'contact';
BEGIN
  IF EXISTS (
    SELECT 1 FROM exchanges
    WHERE recipient_profile_id               = p_recipient_profile_id
      AND initiator_profile_id               IS NULL
      AND initiator_shared_fields->>'contact' = v_contact
      AND created_at                          > now() - interval '24 hours'
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO exchanges (recipient_profile_id, initiator_shared_fields, initiator_note)
  VALUES (p_recipient_profile_id, p_initiator_fields, p_note);

  RETURN true;
END;
$$;

-- ============================================================
-- RPC: get_has_exchanged  (check if current user already initiated)
-- ============================================================
CREATE OR REPLACE FUNCTION get_has_exchanged(p_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (
    SELECT 1 FROM exchanges
    WHERE initiator_profile_id = v_uid
      AND recipient_profile_id = p_profile_id
  );
END;
$$;

-- ============================================================
-- Grants
-- ============================================================
GRANT EXECUTE ON FUNCTION perform_exchange(uuid, text, text, text, text, text, text, text, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_exchange(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_guest_exchange(uuid, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_has_exchanged(uuid) TO authenticated;
