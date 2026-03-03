'use server';

import { createInvite } from '@/lib/data/invitations';

export type CreateInviteActionResult = { code: string } | { error: string };

export async function createInviteAction(inviteeEmail?: string): Promise<CreateInviteActionResult> {
  return createInvite(inviteeEmail);
}
