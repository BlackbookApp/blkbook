'use server';

import { createClient } from '@/lib/supabase/server';
import { updateProfile } from '@/lib/data/profiles';
import { insertComponentsForProfile } from '@/lib/data/components';
import { ROLE_SCHEMAS } from '@/config/roleSchemas';
import type { RoleType } from '@/config/roleSchemas';

export async function saveOnboardingAction(params: {
  roleType: RoleType;
  buildMethod: 'ai';
  fullName: string;
  roleTitle: string;
  avatarUrl: string | null;
}): Promise<{ profileId: string | null; error: string | null }> {
  const { roleType, buildMethod, fullName, roleTitle, avatarUrl } = params;

  // 1. Update profile fields
  const { error: profileError } = await updateProfile({
    full_name: fullName,
    role: roleTitle || null,
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
  });

  if (profileError) return { profileId: null, error: profileError };

  // 2. Get the profile ID
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { profileId: null, error: 'Not authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { profileId: null, error: 'Profile not found' };

  // 3. Replace the component stack for the selected role
  await supabase.from('profile_components').delete().eq('profile_id', profile.id);

  const { error: componentsError } = await insertComponentsForProfile(
    profile.id,
    ROLE_SCHEMAS[roleType],
    roleType,
    buildMethod,
    { name: fullName, tagline: roleTitle || null, avatarUrl }
  );

  if (componentsError) return { profileId: null, error: componentsError };

  return { profileId: profile.id, error: null };
}
