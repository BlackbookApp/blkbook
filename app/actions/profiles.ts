'use server';

import {
  getMyProfile,
  updateProfile,
  publishProfile,
  addPortfolioImage,
  removePortfolioImage,
  getProfileUsername,
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
  profileId: string,
  url: string,
  position: number
): Promise<{ error: string | null }> {
  return addPortfolioImage(profileId, url, position);
}

export async function removePortfolioImageAction(
  profileId: string,
  id: string
): Promise<{ error: string | null }> {
  return removePortfolioImage(profileId, id);
}

export async function getProfileUsernameAction(profileId: string): Promise<string | null> {
  return getProfileUsername(profileId);
}

export async function publishProfileAction(): Promise<{ error: string | null }> {
  return publishProfile();
}
