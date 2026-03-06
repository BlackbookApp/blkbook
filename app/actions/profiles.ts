'use server';

import { getMyProfile, updateProfile } from '@/lib/data/profiles';
import type { Profile, ProfileUpdate } from '@/lib/data/profiles';

export async function getMyProfileAction(): Promise<Profile | null> {
  return getMyProfile();
}

export async function updateProfileAction(
  updates: ProfileUpdate
): Promise<{ error: string | null }> {
  return updateProfile(updates);
}
