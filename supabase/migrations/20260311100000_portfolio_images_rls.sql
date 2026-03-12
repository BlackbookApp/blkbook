-- Enable RLS on portfolio_images
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can view portfolio images — required for public profiles
CREATE POLICY "public can view portfolio_images"
  ON portfolio_images FOR SELECT
  USING (true);

-- Authenticated users can insert images for their own profile
CREATE POLICY "owner can insert portfolio_images"
  ON portfolio_images FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Authenticated users can update their own images
CREATE POLICY "owner can update portfolio_images"
  ON portfolio_images FOR UPDATE
  USING (profile_id = auth.uid());

-- Authenticated users can delete their own images
CREATE POLICY "owner can delete portfolio_images"
  ON portfolio_images FOR DELETE
  USING (profile_id = auth.uid());
