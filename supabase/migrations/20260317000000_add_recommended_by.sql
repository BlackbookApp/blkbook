-- Add recommended_by column to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS recommended_by text[] NOT NULL DEFAULT '{}';
