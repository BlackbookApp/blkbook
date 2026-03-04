-- Schema redesign: enums, username, portfolio_images table, social_links JSONB

-- 1. Enums
CREATE TYPE profile_style AS ENUM ('visual', 'editorial');
CREATE TYPE profile_palette AS ENUM ('blanc', 'noir');
CREATE TYPE membership_type AS ENUM ('guest', 'member');

-- 2. Add username slug
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

-- 3. Fix invites_remaining nullability
UPDATE profiles SET invites_remaining = 0 WHERE invites_remaining IS NULL;
ALTER TABLE profiles ALTER COLUMN invites_remaining SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN invites_remaining SET DEFAULT 10;

-- 4. Migrate style/palette/membership_type to enum types
-- Drop the check constraint and defaults before altering column types
ALTER TABLE profiles DROP CONSTRAINT profiles_membership_type_check;

ALTER TABLE profiles
  ALTER COLUMN style DROP DEFAULT,
  ALTER COLUMN palette DROP DEFAULT,
  ALTER COLUMN membership_type DROP DEFAULT;

ALTER TABLE profiles
  ALTER COLUMN style TYPE profile_style USING style::profile_style,
  ALTER COLUMN palette TYPE profile_palette USING palette::profile_palette,
  ALTER COLUMN membership_type TYPE membership_type USING membership_type::membership_type;

-- Restore defaults
ALTER TABLE profiles ALTER COLUMN membership_type SET DEFAULT 'guest';
ALTER TABLE profiles ALTER COLUMN style SET DEFAULT 'visual';

-- 5. Create portfolio_images table
CREATE TABLE portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migrate existing portfolio_images array data
INSERT INTO portfolio_images (profile_id, url, position)
SELECT
  id,
  unnest(portfolio_images),
  generate_subscripts(portfolio_images, 1) - 1
FROM profiles
WHERE portfolio_images IS NOT NULL AND array_length(portfolio_images, 1) > 0;

-- 6. Replace social columns with JSONB
ALTER TABLE profiles
  ADD COLUMN social_links JSONB NOT NULL DEFAULT '{}';

-- Migrate existing social data into JSONB
UPDATE profiles SET social_links = (
  SELECT jsonb_strip_nulls(jsonb_build_object(
    'instagram', instagram,
    'linkedin', linkedin,
    'phone', phone,
    'website', website
  ))
);

ALTER TABLE profiles
  DROP COLUMN instagram,
  DROP COLUMN linkedin,
  DROP COLUMN phone,
  DROP COLUMN website,
  DROP COLUMN portfolio_images;
