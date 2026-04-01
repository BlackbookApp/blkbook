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
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  notes: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  profile_id?: string | null;
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

export async function getVaultContactById(id: string): Promise<VaultContact | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vault_contacts').select('*').eq('id', id).single();
  if (error) {
    // PGRST116 = row not found — treat as null; rethrow anything else
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function isProfileInVault(profileId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { count } = await supabase
    .from('vault_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('profile_id', profileId);
  return (count ?? 0) > 0;
}

export async function getVaultContactByLinkedinUrl(
  linkedinUrl: string
): Promise<VaultContact | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('vault_contacts')
    .select('*')
    .eq('user_id', user.id)
    .eq('linkedin_url', linkedinUrl)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
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
