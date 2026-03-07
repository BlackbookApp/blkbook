-- Add logo and testimonial fields to profiles
ALTER TABLE profiles
  ADD COLUMN logo_url TEXT,
  ADD COLUMN testimonial_quote TEXT,
  ADD COLUMN testimonial_author TEXT,
  ADD COLUMN testimonial_title TEXT;

-- Portfolio storage bucket (public read, auth'd upload)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "portfolio_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "portfolio_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio'
    AND (string_to_array(name, '/'))[1] = auth.uid()::text
  );

CREATE POLICY "portfolio_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio'
    AND (string_to_array(name, '/'))[1] = auth.uid()::text
  );

CREATE POLICY "portfolio_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio'
    AND (string_to_array(name, '/'))[1] = auth.uid()::text
  );
