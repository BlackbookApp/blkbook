ALTER TABLE profile_components
ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
