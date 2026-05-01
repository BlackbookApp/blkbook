import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export interface Invitation {
  id: string;
  code: string;
  inviter_id: string | null;
  invitee_email: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}

export async function getInviteByCode(code: string): Promise<Invitation | null> {
  if (process.env.NODE_ENV !== 'production' && code === 'DEV') {
    return {
      id: 'dev',
      code: 'DEV',
      inviter_id: null,
      invitee_email: null,
      used_by: null,
      used_at: null,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invitations')
    .select('*, profiles:inviter_id(full_name)')
    .eq('code', code)
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return data as Invitation;
}

export async function getMyInvitations(): Promise<Invitation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();
  if (!profileRow) return [];

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('inviter_id', profileRow.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Invitation[];
}

export async function createInvite(
  inviteeEmail?: string
): Promise<{ code: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, invites_remaining, is_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'No invitations remaining' };

  if (!profile.is_admin) {
    if (profile.invites_remaining <= 0) {
      return { error: 'No invitations remaining' };
    }

    const { data: updated } = await adminClient
      .from('profiles')
      .update({ invites_remaining: profile.invites_remaining - 1 })
      .eq('user_id', user.id)
      .gt('invites_remaining', 0)
      .select('invites_remaining')
      .single();

    if (!updated) return { error: 'No invitations remaining' };
  }

  const code = (await import('crypto')).randomBytes(4).toString('hex').toUpperCase();

  const { error: insertError } = await supabase
    .from('invitations')
    .insert({ code, inviter_id: profile.id, invitee_email: inviteeEmail ?? null });

  if (insertError) {
    await adminClient
      .from('profiles')
      .update({ invites_remaining: profile.invites_remaining })
      .eq('user_id', user.id);
    return { error: insertError.message };
  }

  return { code };
}

export async function sendInviteWithEmail(
  inviteeName: string,
  inviteeEmail: string,
  note?: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, full_name, invites_remaining, is_admin')
    .eq('user_id', user.id)
    .single();
  if (!profile) return { error: 'Profile not found' };

  // Hard error: invitee already a member
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingAuthUser } = await (adminClient as any)
    .schema('auth')
    .from('users')
    .select('id')
    .eq('email', inviteeEmail)
    .maybeSingle();
  if (existingAuthUser) return { error: 'This person is already on Haizel' };

  // Hard error: pending invite to this email from this inviter
  const { data: existingInvite } = await adminClient
    .from('invitations')
    .select('code')
    .eq('inviter_id', profile.id)
    .eq('invitee_email', inviteeEmail)
    .is('used_by', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (existingInvite) return { error: 'You already have a pending invite for this email' };

  const result = await createInvite(inviteeEmail);
  if ('error' in result) return { error: result.error };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const inviteUrl =
    `${appUrl}/invite?ref=${result.code}` +
    `&name=${encodeURIComponent(inviteeName)}` +
    `&email=${encodeURIComponent(inviteeEmail)}`;

  try {
    const { sendInviteEmail } = await import('@/lib/email');
    await sendInviteEmail(
      inviteeName,
      inviteeEmail,
      profile.full_name ?? 'A member',
      inviteUrl,
      note
    );
  } catch {
    // Rollback: restore quota and remove invite row
    await adminClient.from('invitations').delete().eq('code', result.code);
    if (!profile.is_admin) {
      await adminClient
        .from('profiles')
        .update({ invites_remaining: profile.invites_remaining })
        .eq('user_id', user.id);
    }
    return { error: 'Failed to send email. Your invite was not used.' };
  }

  return { error: null };
}

export async function markInviteUsed(code: string, userId: string): Promise<void> {
  await adminClient.rpc('mark_invite_used', { p_code: code, p_user_id: userId });
}
