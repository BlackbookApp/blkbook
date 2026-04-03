import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export interface SocialLinks {
  linkedin?: string;
  website?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  position: number;
}

export interface TestimonialEntry {
  quote: string;
  author?: string | null;
  title?: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links: SocialLinks;
  style: 'visual' | 'editorial' | null;
  palette: 'blanc' | 'noir' | null;
  brand_statement: string | null;
  logo_url: string | null;
  testimonials: TestimonialEntry[];
  portfolio_images: PortfolioImage[];
  recommended_by: string[] | null;
  membership_type: 'guest' | 'member' | null;
  profile_complete: boolean;
  is_published: boolean;
  invited_by: string | null;
  invite_code: string;
  invites_remaining: number;
  username: string | null;
  cta_buttons: string[] | null;
  has_seen_tour: boolean;
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
    .select('*, portfolio_images(id, url, position), profile_components(type, data)')
    .eq('user_id', user.id)
    .single();

  if (error) return null;

  const { portfolio_images, profile_components, ...rest } = data as typeof data & {
    portfolio_images: PortfolioImage[];
    profile_components: { type: string; data: Record<string, unknown> }[];
  };

  const hero = (profile_components ?? []).find(
    (c: { type: string; data: Record<string, unknown> }) => c.type === 'profile_hero_centered'
  );
  const heroName = (hero?.data?.name as string | null | undefined) ?? null;
  const heroAvatarUrl = (hero?.data?.image_url as string | null | undefined) ?? null;
  const heroTagline = (hero?.data?.tagline as string | null | undefined) ?? null;
  const heroLocation = (hero?.data?.location as string | null | undefined) ?? null;

  return {
    ...rest,
    full_name: heroName ?? rest.full_name,
    avatar_url: heroAvatarUrl ?? rest.avatar_url,
    role: heroTagline ?? rest.role,
    location: heroLocation,
    social_links: (rest.social_links as SocialLinks) ?? {},
    testimonials: (rest.testimonials as TestimonialEntry[]) ?? [],
    recommended_by: (rest.recommended_by as string[]) ?? [],
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
    user_id: userId,
    full_name: fullName,
    invited_by: invitedBy,
    username,
  });
}

/** Bypasses is_published filter — use only in server-side test/admin contexts. */
export async function getProfileByUsernameAdmin(username: string): Promise<Profile | null> {
  const { data, error } = await adminClient
    .from('profiles')
    .select('*, portfolio_images(id, url, position)')
    .eq('username', username)
    .maybeSingle();

  if (error || !data) return null;

  const { portfolio_images, ...rest } = data as typeof data & {
    portfolio_images: PortfolioImage[];
  };

  return {
    ...rest,
    social_links: (rest.social_links as SocialLinks) ?? {},
    testimonials: (rest.testimonials as TestimonialEntry[]) ?? [],
    recommended_by: (rest.recommended_by as string[]) ?? [],
    portfolio_images: (portfolio_images ?? []).sort(
      (a: PortfolioImage, b: PortfolioImage) => a.position - b.position
    ),
  } as Profile;
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
    testimonials: (rest.testimonials as TestimonialEntry[]) ?? [],
    recommended_by: (rest.recommended_by as string[]) ?? [],
    portfolio_images: (portfolio_images ?? []).sort(
      (a: PortfolioImage, b: PortfolioImage) => a.position - b.position
    ),
  } as Profile;
}

export async function getProfileUsername(profileId: string): Promise<string | null> {
  const { data } = await adminClient
    .from('profiles')
    .select('username')
    .eq('id', profileId)
    .maybeSingle();
  return data?.username ?? null;
}

export async function publishProfile(): Promise<{ error: string | null }> {
  return updateProfile({ is_published: true });
}

export async function markTourSeen(): Promise<{ error: string | null }> {
  return updateProfile({ has_seen_tour: true });
}

export type ProfileUpdate = Partial<
  Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'portfolio_images'>
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
    .eq('user_id', user.id);

  return { error: error?.message ?? null };
}

export async function resetProfileComplete(
  profileId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({ profile_complete: false, updated_at: new Date().toISOString() })
    .eq('id', profileId)
    .eq('user_id', userId);
  if (profileError) return { error: profileError.message };

  const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { profile_complete: false },
  });
  if (authError) return { error: authError.message };

  return { error: null };
}

export async function addPortfolioImage(
  profileId: string,
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
    .insert({ profile_id: profileId, url, position });

  return { error: error?.message ?? null };
}

export async function removePortfolioImage(
  profileId: string,
  id: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', id)
    .eq('profile_id', profileId);
  return { error: error?.message ?? null };
}
