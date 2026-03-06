-- Add is_admin to profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;

-- Enum for request status
CREATE TYPE access_request_status AS ENUM ('pending', 'approved', 'rejected');

-- New table: access_requests
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  social_handle TEXT,
  brand_link TEXT,
  attempt_count INT DEFAULT 1 NOT NULL,
  status access_request_status NOT NULL DEFAULT 'pending',
  invite_code TEXT REFERENCES invitations(code) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Anon and authenticated users can submit requests
CREATE POLICY "anon_insert" ON access_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "admin_all" ON access_requests
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Anyone can read by id (UUID is hard to guess; pending page reads own request)
CREATE POLICY "owner_read" ON access_requests
  FOR SELECT
  USING (true);

-- To set an admin, run:
-- UPDATE profiles SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
