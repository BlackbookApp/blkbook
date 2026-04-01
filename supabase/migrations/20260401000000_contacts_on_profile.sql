-- Migrate contact fields (instagram, linkedin, email, phone, whatsapp, website)
-- from each user's social_stat component into the profile social_links column.
UPDATE profiles p
SET social_links = COALESCE(
  (
    SELECT jsonb_object_agg(key, handle)
    FROM (
      SELECT
        item->>'platform' AS key,
        item->>'handle'   AS handle
      FROM profile_components pc,
           jsonb_array_elements(pc.data->'items') AS item
      WHERE pc.profile_id = p.id
        AND pc.type = 'social_stat'
        AND item->>'platform' IN ('linkedin','email','phone','whatsapp','website')
        AND item->>'handle' IS NOT NULL
        AND item->>'handle' != ''
    ) contacts
  ),
  '{}'::jsonb
);

-- Trim social_stat components to audience-only platforms: instagram, tiktok, youtube.
UPDATE profile_components
SET data = jsonb_set(
  data,
  '{items}',
  COALESCE(
    (
      SELECT jsonb_agg(item)
      FROM jsonb_array_elements(data->'items') AS item
      WHERE item->>'platform' IN ('instagram','tiktok','youtube')
    ),
    '[]'::jsonb
  )
)
WHERE type = 'social_stat';
