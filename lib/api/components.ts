import { createClient } from '../supabase/client';
import { COMPONENT_DEFAULTS } from '../../config/componentSchemas';
import type { ComponentType } from '../../config/roleSchemas';

// Bulk insert — called once after AI generates the component stack
export async function insertComponents(
  profileId: string,
  types: ComponentType[],
  isPredefined: boolean,
  dataOverrides?: unknown[]
) {
  const supabase = createClient();

  const rows = types.map((type, i) => ({
    profile_id: profileId,
    type,
    position: (i + 1) * 1000,
    data: dataOverrides?.[i] ?? COMPONENT_DEFAULTS[type],
    is_predefined: isPredefined,
    ai_generated: !!dataOverrides,
  }));

  const { data, error } = await supabase.from('profile_components').insert(rows).select();

  if (error) throw error;
  return data;
}

// Atomic patch — only updates changed keys, never overwrites others
export async function patchComponentData(componentId: string, patch: Record<string, unknown>) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('merge_component_data', {
    p_component_id: componentId,
    p_patch: patch,
  });

  if (error) throw error;
  return data;
}

// Add one component from the library — always goes to the bottom
export async function addComponentFromLibrary(profileId: string, type: ComponentType) {
  const supabase = createClient();

  const { data: last } = await supabase
    .from('profile_components')
    .select('position')
    .eq('profile_id', profileId)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from('profile_components')
    .insert({
      profile_id: profileId,
      type,
      position: (last?.position ?? 0) + 1000,
      data: COMPONENT_DEFAULTS[type],
      is_predefined: false,
      ai_generated: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update position after reorder
export async function updateComponentPosition(componentId: string, newPosition: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profile_components')
    .update({ position: newPosition })
    .eq('id', componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
