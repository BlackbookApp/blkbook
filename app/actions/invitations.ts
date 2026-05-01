'use server';

import { createInvite, getMyInvitations, sendInviteWithEmail } from '@/lib/data/invitations';
import type { Invitation } from '@/lib/data/invitations';

export type CreateInviteActionResult = { code: string } | { error: string };

export async function createInviteAction(inviteeEmail?: string): Promise<CreateInviteActionResult> {
  return createInvite(inviteeEmail);
}

export async function getMyInvitationsAction(): Promise<Invitation[]> {
  return getMyInvitations();
}

export async function sendInviteEmailAction(
  inviteeName: string,
  inviteeEmail: string,
  note?: string
): Promise<{ error: string | null }> {
  return sendInviteWithEmail(inviteeName, inviteeEmail, note);
}
