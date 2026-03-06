import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  position: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links: SocialLinks;
  style: 'visual' | 'editorial' | null;
  palette: 'blanc' | 'noir' | null;
  brand_statement: string | null;
  portfolio_images: PortfolioImage[];
  membership_type: 'guest' | 'member' | null;
  profile_complete: boolean;
  is_published: boolean;
  invited_by: string | null;
  invite_code: string;
  invites_remaining: number;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*, portfolio_images(id, url, position)')
    .eq('id', user.id)
    .single();

  if (error) return null;

  const { portfolio_images, ...rest } = data as typeof data & {
    portfolio_images: PortfolioImage[];
  };

  return {
    ...rest,
    social_links: (rest.social_links as SocialLinks) ?? {},
    portfolio_images: (portfolio_images ?? []).sort(
      (a: PortfolioImage, b: PortfolioImage) => a.position - b.position
    ),
  } as Profile;
}

async function generateUsername(fullName: string): Promise<string> {
  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let candidate = base;
  let suffix = 2;
  while (true) {
    const { data } = await adminClient
      .from('profiles')
      .select('id')
      .eq('username', candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function createProfile(
  userId: string,
  fullName: string | null,
  invitedBy: string | null
): Promise<void> {
  const username = fullName ? await generateUsername(fullName) : null;
  await adminClient.from('profiles').insert({
    id: userId,
    full_name: fullName,
    invited_by: invitedBy,
    username,
  });
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await adminClient
    .from('profiles')
    .select('*, portfolio_images(id, url, position)')
    .eq('username', username)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) return null;

  const { portfolio_images, ...rest } = data as typeof data & {
    portfolio_images: PortfolioImage[];
  };

  return {
    ...rest,
    social_links: (rest.social_links as SocialLinks) ?? {},
    portfolio_images: (portfolio_images ?? []).sort(
      (a: PortfolioImage, b: PortfolioImage) => a.position - b.position
    ),
  } as Profile;
}

export async function publishProfile(): Promise<{ error: string | null }> {
  return updateProfile({ is_published: true });
}

export type ProfileUpdate = Partial<
  Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'portfolio_images'>
>;

export async function updateProfile(updates: ProfileUpdate): Promise<{ error: string | null }> {
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

export async function addPortfolioImage(
  url: string,
  position: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('portfolio_images')
    .insert({ profile_id: user.id, url, position });

  return { error: error?.message ?? null };
}

export async function removePortfolioImage(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);
  return { error: error?.message ?? null };
}
