'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  instagram: string | null;
  linkedin: string | null;
  phone: string | null;
  style: string | null;
  palette: string | null;
  brand_statement: string | null;
  portfolio_images: string[];
  membership_type: 'guest' | 'member';
  profile_complete: boolean;
  is_published: boolean;
  invited_by: string | null;
  invite_code: string;
  invites_remaining: number;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error) return null;
  return data as Profile;
}

export async function createProfile(
  userId: string,
  fullName: string | null,
  invitedBy: string | null
): Promise<void> {
  const admin = createAdminClient();
  await admin.from('profiles').insert({
    id: userId,
    full_name: fullName,
    invited_by: invitedBy,
  });
}

export async function publishProfile(): Promise<{ error: string | null }> {
  return updateProfile({ is_published: true });
}

export async function updateProfile(
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  return { error: error?.message ?? null };
}
