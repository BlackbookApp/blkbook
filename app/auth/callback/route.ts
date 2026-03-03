import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInviteByCode } from '@/lib/data/invitations';
import { createProfile, getMyProfile } from '@/lib/data/profiles';
import { markInviteUsed } from '@/lib/data/invitations';
import { routes } from '@/lib/routes';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}${routes.login}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}${routes.login}?error=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}${routes.login}`);
  }

  // Check if profile already exists (re-confirming email case)
  const existingProfile = await getMyProfile();
  if (existingProfile) {
    return NextResponse.redirect(`${origin}${routes.myBlackbook}`);
  }

  // Create profile from user metadata set during signup
  const inviteCode = user.user_metadata?.invite_code as string | undefined;
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? null;

  let inviterId: string | null = null;
  if (inviteCode) {
    const invite = await getInviteByCode(inviteCode);
    inviterId = invite?.inviter_id ?? null;
  }

  await createProfile(user.id, fullName, inviterId);

  if (inviteCode) {
    await markInviteUsed(inviteCode, user.id);
  }

  return NextResponse.redirect(`${origin}${routes.createProfile}`);
}
