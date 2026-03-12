-- Add requester_role to exchange_requests so inbox shows the requester's role
ALTER TABLE exchange_requests
  ADD COLUMN requester_role text;

-- Drop old function signatures before replacing with new ones
DROP FUNCTION IF EXISTS perform_exchange(uuid, text, text, text, text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS create_guest_exchange_request(uuid, text, text, text);

-- perform_exchange: now also stores requester_role
CREATE OR REPLACE FUNCTION perform_exchange(
  p_profile_id        uuid,
  p_profile_name      text,
  p_requester_name    text,
  p_requester_contact text,
  p_profile_role      text    DEFAULT NULL,
  p_profile_photo_url text    DEFAULT NULL,
  p_profile_email     text    DEFAULT NULL,
  p_profile_phone     text    DEFAULT NULL,
  p_profile_instagram text    DEFAULT NULL,
  p_profile_website   text    DEFAULT NULL,
  p_note              text    DEFAULT NULL,
  p_requester_role    text    DEFAULT NULL
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

  -- Add the viewed profile to requester's vault (idempotent via partial unique index)
  INSERT INTO vault_contacts
    (user_id, name, role, photo_url, email, phone, instagram, website, profile_id)
  VALUES
    (v_uid, p_profile_name, p_profile_role, p_profile_photo_url,
     p_profile_email, p_profile_phone, p_profile_instagram, p_profile_website, p_profile_id)
  ON CONFLICT (user_id, profile_id) WHERE profile_id IS NOT NULL DO NOTHING;

  -- Notify profile owner (idempotent via partial unique index)
  INSERT INTO exchange_requests
    (profile_id, requester_user_id, requester_name, requester_contact, requester_role, note)
  VALUES
    (p_profile_id, v_uid, p_requester_name, p_requester_contact, p_requester_role, p_note)
  ON CONFLICT (profile_id, requester_user_id) WHERE requester_user_id IS NOT NULL DO NOTHING;
END;
$$;

-- create_guest_exchange_request: returns true if inserted, false if deduped (same contact within 24h)
CREATE OR REPLACE FUNCTION create_guest_exchange_request(
  p_profile_id        uuid,
  p_requester_name    text,
  p_requester_contact text,
  p_note              text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM exchange_requests
    WHERE profile_id        = p_profile_id
      AND requester_contact = p_requester_contact
      AND created_at        > now() - interval '24 hours'
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO exchange_requests (profile_id, requester_name, requester_contact, note)
  VALUES (p_profile_id, p_requester_name, p_requester_contact, p_note);

  RETURN true;
END;
$$;

-- get_has_exchanged: lets an authenticated user check if they already exchanged with a profile
-- SECURITY DEFINER bypasses the owner-only SELECT policy
CREATE OR REPLACE FUNCTION get_has_exchanged(p_profile_id uuid) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM exchange_requests
    WHERE profile_id      = p_profile_id
      AND requester_user_id = v_uid
  );
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION perform_exchange(uuid, text, text, text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_guest_exchange_request(uuid, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_has_exchanged(uuid) TO authenticated;
