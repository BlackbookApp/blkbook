import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { COMPONENT_DEFAULTS, ROLE_COMPONENT_SAMPLES } from '@/config/componentSchemas';
import type { ComponentType, RoleType } from '@/config/roleSchemas';

export interface ProfileComponent {
  id: string;
  profile_id: string;
  type: ComponentType;
  data: unknown;
  position: number;
  ai_generated: boolean;
  is_predefined: boolean;
  is_visible: boolean;
}

export async function getProfileComponents(profileId: string): Promise<ProfileComponent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile_components')
    .select('id, profile_id, type, data, position, ai_generated, is_predefined, is_visible')
    .eq('profile_id', profileId)
    .order('position', { ascending: true });

  if (error || !data) return [];
  return data as ProfileComponent[];
}

export async function updateComponentVisibility(
  componentId: string,
  isVisible: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profile_components')
    .update({ is_visible: isVisible })
    .eq('id', componentId);
  return { error: error?.message ?? null };
}

/** Bypasses RLS — use only in server-side test/admin contexts. */
export async function getProfileComponentsAdmin(profileId: string): Promise<ProfileComponent[]> {
  const { data, error } = await adminClient
    .from('profile_components')
    .select('id, profile_id, type, data, position, ai_generated, is_predefined, is_visible')
    .eq('profile_id', profileId)
    .order('position', { ascending: true });

  if (error || !data) return [];
  return data as ProfileComponent[];
}

export async function insertComponentsForProfile(
  profileId: string,
  types: ComponentType[],
  role: RoleType,
  mode: 'ai',
  heroData: { name: string; tagline: string | null; avatarUrl: string | null }
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const samples = ROLE_COMPONENT_SAMPLES[role];

  const rows = types.map((type, i) => {
    let data: unknown;
    if (type === 'profile_hero_centered') {
      data = {
        name: heroData.name,
        image_url: heroData.avatarUrl,
        tagline: heroData.tagline,
        location: null,
      };
    } else if (mode === 'ai' && samples[type] !== undefined) {
      data = samples[type];
    } else {
      data = COMPONENT_DEFAULTS[type];
    }
    return {
      profile_id: profileId,
      type,
      position: (i + 1) * 1000,
      data,
      is_predefined: true,
      ai_generated: mode === 'ai',
    };
  });

  const { error } = await supabase.from('profile_components').insert(rows);

  return { error: error?.message ?? null };
}
