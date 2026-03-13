-- Add profile_id FK to vault_contacts
ALTER TABLE vault_contacts
  ADD COLUMN profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Enum for exchange request status
CREATE TYPE exchange_request_status AS ENUM ('pending', 'seen', 'archived');

-- Exchange requests table
CREATE TABLE exchange_requests (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid REFERENCES profiles(id) NOT NULL,
  requester_user_id   uuid REFERENCES auth.users(id),
  requester_name      text NOT NULL,
  requester_contact   text NOT NULL,
  note                text,
  status              exchange_request_status NOT NULL DEFAULT 'pending',
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Indexes (#15)
CREATE INDEX ON exchange_requests (profile_id);
CREATE INDEX ON vault_contacts (profile_id);

-- One vault entry per (user, profile) when profile_id is set — enables idempotent upsert
CREATE UNIQUE INDEX vault_contacts_user_profile_unique
  ON vault_contacts (user_id, profile_id)
  WHERE profile_id IS NOT NULL;

-- One exchange request per authenticated (requester, profile) pair — prevents spam (#17)
CREATE UNIQUE INDEX exchange_requests_profile_user_unique
  ON exchange_requests (profile_id, requester_user_id)
  WHERE requester_user_id IS NOT NULL;

-- RLS
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;

-- Simplified: profiles.id = auth.uid() in this schema (#16)
CREATE POLICY "owner can view exchange_requests"
  ON exchange_requests FOR SELECT
  USING (profile_id = auth.uid());

-- Anyone (including anonymous) can submit a request
CREATE POLICY "anyone can insert exchange_requests"
  ON exchange_requests FOR INSERT
  WITH CHECK (true);

-- Owner can update status (mark seen / archived)
CREATE POLICY "owner can update exchange_requests"
  ON exchange_requests FOR UPDATE
  USING (profile_id = auth.uid());

-- Atomic exchange: adds profile to requester's vault + creates exchange request in one transaction (#1)
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
  p_note              text    DEFAULT NULL
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
    (profile_id, requester_user_id, requester_name, requester_contact, note)
  VALUES
    (p_profile_id, v_uid, p_requester_name, p_requester_contact, p_note)
  ON CONFLICT (profile_id, requester_user_id) WHERE requester_user_id IS NOT NULL DO NOTHING;
END;
$$;

-- Support index for the 24 h guest dedup check in create_guest_exchange_request
CREATE INDEX ON exchange_requests (profile_id, requester_contact, created_at);

-- Atomic guest insert: check-then-insert without TOCTOU (#17)
-- SECURITY DEFINER so anon users can read exchange_requests for the dedup check
CREATE OR REPLACE FUNCTION create_guest_exchange_request(
  p_profile_id        uuid,
  p_requester_name    text,
  p_requester_contact text,
  p_note              text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reject if same (profile_id, requester_contact) was submitted within the last 24 h
  IF EXISTS (
    SELECT 1 FROM exchange_requests
    WHERE profile_id        = p_profile_id
      AND requester_contact = p_requester_contact
      AND created_at        > now() - interval '24 hours'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO exchange_requests (profile_id, requester_name, requester_contact, note)
  VALUES (p_profile_id, p_requester_name, p_requester_contact, p_note);
END;
$$;

-- Grant execute permissions so PostgREST can call these functions
GRANT EXECUTE ON FUNCTION perform_exchange(uuid, text, text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_guest_exchange_request(uuid, text, text, text) TO anon, authenticated;
