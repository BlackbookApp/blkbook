'use server';

import { createInvite, getMyInvitations } from '@/lib/data/invitations';
import type { Invitation } from '@/lib/data/invitations';

export type CreateInviteActionResult = { code: string } | { error: string };

export async function createInviteAction(inviteeEmail?: string): Promise<CreateInviteActionResult> {
  return createInvite(inviteeEmail);
}

export async function getMyInvitationsAction(): Promise<Invitation[]> {
  return getMyInvitations();
}
