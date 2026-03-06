'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import {
  insertAccessRequest,
  updateAccessRequestStatus,
  getAccessRequestById,
} from '@/lib/data/access-requests';
import { sendApprovalEmail } from '@/lib/email';

const submitSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  social_handle: z.string().optional(),
  brand_link: z.string().optional(),
});

export type SubmitRequestResult = { id: string } | { error: string };

export async function submitAccessRequest(formData: FormData): Promise<SubmitRequestResult> {
  const parsed = submitSchema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    social_handle: formData.get('social_handle') || undefined,
    brand_link: formData.get('brand_link') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  return insertAccessRequest(parsed.data);
}

export type ApproveRequestResult = { success: true } | { error: string };

export async function approveRequest(requestId: string): Promise<ApproveRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await adminClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!profile?.is_admin) return { error: 'Forbidden' };

  const request = await getAccessRequestById(requestId);
  if (!request) return { error: 'Request not found' };
  if (request.status === 'approved') return { error: 'Already approved' };

  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error: inviteError } = await adminClient.from('invitations').insert({
    code,
    inviter_id: user.id,
    invitee_email: request.email,
    expires_at: expiresAt.toISOString(),
  });
  if (inviteError) return { error: inviteError.message };

  const { error: updateError } = await updateAccessRequestStatus(
    requestId,
    'approved',
    user.id,
    code
  );
  if (updateError) return { error: updateError };

  try {
    await sendApprovalEmail(request.email, request.full_name, code);
  } catch (e) {
    console.error('Failed to send approval email:', e);
  }

  return { success: true };
}

export type RejectRequestResult = { success: true } | { error: string };

export async function rejectRequest(requestId: string): Promise<RejectRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await adminClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!profile?.is_admin) return { error: 'Forbidden' };

  const { error } = await updateAccessRequestStatus(requestId, 'rejected', user.id);
  if (error) return { error };

  return { success: true };
}
