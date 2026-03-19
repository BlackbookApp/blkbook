import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { COMPONENT_DEFAULTS } from '@/config/componentSchemas';
import type { ComponentType } from '@/config/roleSchemas';

export interface ProfileComponent {
  id: string;
  type: ComponentType;
  data: unknown;
  position: number;
  ai_generated: boolean;
  is_predefined: boolean;
}

export async function getProfileComponents(profileId: string): Promise<ProfileComponent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profile_components')
    .select('id, type, data, position, ai_generated, is_predefined')
    .eq('profile_id', profileId)
    .order('position', { ascending: true });

  if (error || !data) return [];
  return data as ProfileComponent[];
}

export async function insertComponentsForProfile(
  profileId: string,
  types: ComponentType[]
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const rows = types.map((type, i) => ({
    profile_id: profileId,
    type,
    position: (i + 1) * 1000,
    data: COMPONENT_DEFAULTS[type],
    is_predefined: true,
    ai_generated: false,
  }));

  const { error } = await supabase.from('profile_components').insert(rows);

  return { error: error?.message ?? null };
}
