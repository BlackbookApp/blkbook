-- Migrate testimonials from flat columns to JSONB array
ALTER TABLE profiles
  ADD COLUMN testimonials JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Migrate existing data
UPDATE profiles
SET testimonials = jsonb_build_array(
  jsonb_build_object(
    'quote', testimonial_quote,
    'author', testimonial_author,
    'title', testimonial_title
  )
)
WHERE testimonial_quote IS NOT NULL AND testimonial_quote != '';

-- Drop old columns
ALTER TABLE profiles
  DROP COLUMN testimonial_quote,
  DROP COLUMN testimonial_author,
  DROP COLUMN testimonial_title;
