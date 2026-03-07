'use server';

import {
  getMyProfile,
  updateProfile,
  addPortfolioImage,
  removePortfolioImage,
} from '@/lib/data/profiles';
import type { Profile, ProfileUpdate } from '@/lib/data/profiles';

export async function getMyProfileAction(): Promise<Profile | null> {
  return getMyProfile();
}

export async function updateProfileAction(
  updates: ProfileUpdate
): Promise<{ error: string | null }> {
  return updateProfile(updates);
}

export async function addPortfolioImageAction(
  url: string,
  position: number
): Promise<{ error: string | null }> {
  return addPortfolioImage(url, position);
}

export async function removePortfolioImageAction(id: string): Promise<{ error: string | null }> {
  return removePortfolioImage(id);
}
