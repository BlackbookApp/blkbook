'use server';

import { getProfileComponents } from '@/lib/data/components';
import type { ProfileComponent } from '@/lib/data/components';

export async function getProfileComponentsAction(profileId: string): Promise<ProfileComponent[]> {
  return getProfileComponents(profileId);
}
