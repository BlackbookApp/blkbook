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

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('inviter_id', user.id)
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
    .select('invites_remaining')
    .eq('id', user.id)
    .single();

  if (!profile || profile.invites_remaining <= 0) {
    return { error: 'No invitations remaining' };
  }

  const { data: updated } = await adminClient
    .from('profiles')
    .update({ invites_remaining: profile.invites_remaining - 1 })
    .eq('id', user.id)
    .gt('invites_remaining', 0)
    .select('invites_remaining')
    .single();

  if (!updated) return { error: 'No invitations remaining' };

  const code = (await import('crypto')).randomBytes(4).toString('hex').toUpperCase();

  const { error: insertError } = await supabase
    .from('invitations')
    .insert({ code, inviter_id: user.id, invitee_email: inviteeEmail ?? null });

  if (insertError) {
    await adminClient
      .from('profiles')
      .update({ invites_remaining: profile.invites_remaining })
      .eq('id', user.id);
    return { error: insertError.message };
  }

  return { code };
}

export async function markInviteUsed(code: string, userId: string): Promise<void> {
  await adminClient.rpc('mark_invite_used', { p_code: code, p_user_id: userId });
}
