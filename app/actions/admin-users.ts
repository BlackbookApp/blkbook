'use server';

import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { insertComponentsForProfileAdmin } from '@/lib/data/components';
import { ROLE_SCHEMAS } from '@/config/roleSchemas';
import type { RoleType, ComponentType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

async function assertAdmin(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await adminClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();
  if (!profile?.is_admin) return { error: 'Forbidden' };

  return { userId: user.id };
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_type: 'guest' | 'member' | null;
  is_published: boolean;
  is_admin: boolean;
  created_at: string;
  username: string;
}

export async function getAllUsersAction(): Promise<AdminUser[]> {
  const auth = await assertAdmin();
  if ('error' in auth) return [];

  const [{ data: authData, error: authError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
      adminClient
        .from('profiles')
        .select(
          'id, user_id, full_name, avatar_url, membership_type, is_published, is_admin, created_at, username'
        )
        .order('created_at', { ascending: false }),
    ]);

  if (authError || profilesError || !authData || !profiles) return [];

  const emailMap = new Map<string, string>();
  for (const u of authData.users) {
    emailMap.set(u.id, u.email ?? '');
  }

  return profiles.map((p) => ({
    id: p.id,
    user_id: p.user_id,
    email: emailMap.get(p.user_id) ?? '',
    full_name: p.full_name,
    avatar_url: p.avatar_url,
    membership_type: p.membership_type as 'guest' | 'member' | null,
    is_published: p.is_published ?? false,
    is_admin: p.is_admin ?? false,
    created_at: p.created_at,
    username: p.username,
  }));
}

export async function deleteUserAction(userId: string): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  return { error: error?.message ?? null };
}

export async function generateUsernameAction(fullName: string): Promise<string> {
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

export interface CreateUserParams {
  email: string;
  password: string;
  roleType: RoleType;
  fullName: string;
  roleTitle: string;
  company: string;
  location: string;
  avatarUrl: string | null;
  selectedButtons: string[];
  buttonValues: Record<string, string>;
  membershipType: 'guest' | 'member';
  isPublished: boolean;
  isAdmin: boolean;
  username: string;
  componentDrafts: Record<string, unknown>;
}

export async function createUserAction(
  params: CreateUserParams
): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  // Check username uniqueness
  const { data: existingUsername } = await adminClient
    .from('profiles')
    .select('id')
    .eq('username', params.username)
    .maybeSingle();
  if (existingUsername) return { error: 'Username is already taken' };

  // Create auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
  });
  if (authError || !authData.user) {
    return { error: authError?.message ?? 'Failed to create auth user' };
  }

  const newUserId = authData.user.id;

  try {
    // Build social_links from non-empty button values
    const socialLinks = Object.fromEntries(
      Object.entries(params.buttonValues).filter(([, v]) => v.trim().length > 0)
    );

    // Create profile row
    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .insert({
        user_id: newUserId,
        full_name: params.fullName,
        role: params.roleTitle || null,
        location: params.location || null,
        avatar_url: params.avatarUrl,
        social_links: socialLinks,
        cta_buttons: params.selectedButtons,
        membership_type: params.membershipType,
        is_published: params.isPublished,
        is_admin: params.isAdmin,
        username: params.username || null,
        profile_complete: true,
      })
      .select('id')
      .single();

    if (profileError || !profileData) {
      throw new Error(profileError?.message ?? 'Failed to create profile');
    }

    // Build ordered data overrides from component drafts (keyed by draft-{roleType}-{index})
    const types = ROLE_SCHEMAS[params.roleType];
    const dataOverrides = types.map((_type, i) => {
      const draftId = `draft-${params.roleType}-${i}`;
      return params.componentDrafts[draftId] ?? null;
    });

    // Insert template components with admin client
    const { error: componentsError } = await insertComponentsForProfileAdmin(
      profileData.id,
      ROLE_SCHEMAS[params.roleType],
      params.roleType,
      {
        name: params.fullName,
        tagline: params.roleTitle || null,
        company: params.company || null,
        avatarUrl: params.avatarUrl,
        location: params.location || null,
      },
      dataOverrides
    );

    if (componentsError) throw new Error(componentsError);

    return { error: null };
  } catch (e) {
    // Roll back auth user on any failure
    await adminClient.auth.admin.deleteUser(newUserId);
    return { error: e instanceof Error ? e.message : 'Failed to create user' };
  }
}

// ─── Edit wizard actions ───────────────────────────────────────────────────────

export interface UserForEdit {
  profileId: string;
  userId: string;
  email: string;
  roleType: RoleType | null;
  fullName: string;
  roleTitle: string;
  company: string;
  location: string;
  avatarUrl: string | null;
  selectedButtons: string[];
  buttonValues: Record<string, string>;
  membershipType: 'guest' | 'member';
  isPublished: boolean;
  isAdmin: boolean;
  username: string;
  heroComponentId: string | null;
  components: ProfileComponent[];
}

function inferRoleType(types: ComponentType[]): RoleType | null {
  const joined = types.join(',');
  for (const [role, schemaTypes] of Object.entries(ROLE_SCHEMAS) as [RoleType, ComponentType[]][]) {
    if (schemaTypes.join(',') === joined) return role as RoleType;
  }
  return null;
}

export async function getUserForEditAction(profileId: string): Promise<UserForEdit | null> {
  const auth = await assertAdmin();
  if ('error' in auth) return null;

  const [profileResult, componentsResult] = await Promise.all([
    adminClient.from('profiles').select('*').eq('id', profileId).single(),
    adminClient
      .from('profile_components')
      .select('id, profile_id, type, data, position, ai_generated, is_predefined, is_visible')
      .eq('profile_id', profileId)
      .order('position', { ascending: true }),
  ]);

  if (profileResult.error || !profileResult.data) return null;
  const profile = profileResult.data;

  const { data: authUserData } = await adminClient.auth.admin.getUserById(profile.user_id);
  const email = authUserData?.user?.email ?? '';

  const components = (componentsResult.data ?? []) as ProfileComponent[];
  const componentTypes = components.map((c) => c.type as ComponentType);
  const roleType = inferRoleType(componentTypes);

  const hero = components.find((c) => c.type === 'profile_hero_centered');
  const heroData = (hero?.data ?? {}) as Record<string, string | null>;

  return {
    profileId: profile.id,
    userId: profile.user_id,
    email,
    roleType,
    fullName: (heroData.name ?? profile.full_name) || '',
    roleTitle: (heroData.tagline ?? profile.role) || '',
    company: heroData.company || '',
    location: (heroData.location ?? profile.location) || '',
    avatarUrl: (heroData.image_url ?? profile.avatar_url) || null,
    selectedButtons: (profile.cta_buttons as string[]) ?? [],
    buttonValues: (profile.social_links as Record<string, string>) ?? {},
    membershipType: (profile.membership_type as 'guest' | 'member') ?? 'guest',
    isPublished: profile.is_published ?? false,
    isAdmin: profile.is_admin ?? false,
    username: profile.username ?? '',
    heroComponentId: hero?.id ?? null,
    components,
  };
}

export async function updateAuthUserAction(
  userId: string,
  patch: { email?: string; password?: string }
): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  const update: { email?: string; password?: string } = {};
  if (patch.email?.trim()) update.email = patch.email.trim();
  if (patch.password?.trim()) update.password = patch.password.trim();

  if (Object.keys(update).length === 0) return { error: null };

  const { error } = await adminClient.auth.admin.updateUserById(userId, update);
  return { error: error?.message ?? null };
}

export async function updateUserProfileFieldsAction(
  profileId: string,
  patch: Record<string, unknown>
): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  const { error } = await adminClient
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', profileId);
  return { error: error?.message ?? null };
}

export async function patchUserComponentAction(
  componentId: string,
  patch: Record<string, unknown>
): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  // Avoid merge_component_data RPC — it calls auth.uid() and rejects service-role
  // requests that carry no user JWT. Fetch + merge + update directly instead.
  const { data: current, error: fetchErr } = await adminClient
    .from('profile_components')
    .select('data')
    .eq('id', componentId)
    .single();

  if (fetchErr || !current) return { error: fetchErr?.message ?? 'Component not found' };

  const merged = { ...(current.data as Record<string, unknown>), ...patch };
  const { error } = await adminClient
    .from('profile_components')
    .update({ data: merged })
    .eq('id', componentId);

  return { error: error?.message ?? null };
}

export async function patchComponentVisibilityAction(
  componentId: string,
  isVisible: boolean
): Promise<{ error: string | null }> {
  const auth = await assertAdmin();
  if ('error' in auth) return { error: auth.error };

  const { error } = await adminClient
    .from('profile_components')
    .update({ is_visible: isVisible })
    .eq('id', componentId);

  return { error: error?.message ?? null };
}
