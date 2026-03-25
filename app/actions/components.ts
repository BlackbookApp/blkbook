'use server';

import { getProfileComponents, updateComponentVisibility } from '@/lib/data/components';
import type { ProfileComponent } from '@/lib/data/components';

export async function getProfileComponentsAction(profileId: string): Promise<ProfileComponent[]> {
  return getProfileComponents(profileId);
}

export async function updateComponentVisibilityAction(
  componentId: string,
  isVisible: boolean
): Promise<{ error: string | null }> {
  return updateComponentVisibility(componentId, isVisible);
}
