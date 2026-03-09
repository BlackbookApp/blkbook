import 'server-only';
import { createClient } from '@/lib/supabase/server';

export interface VaultContact {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type VaultContactInsert = Omit<VaultContact, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export async function getMyVaultContacts(): Promise<VaultContact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vault_contacts').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createVaultContact(input: VaultContactInsert): Promise<VaultContact> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('vault_contacts')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVaultContact(
  id: string,
  input: Partial<VaultContactInsert>
): Promise<VaultContact> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('vault_contacts')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVaultContact(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('vault_contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw error;
}
