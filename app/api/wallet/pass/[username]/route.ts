import { NextResponse } from 'next/server';
import { getMyProfile } from '@/lib/data/profiles';
import { getProfileComponents } from '@/lib/data/components';
import { generateAppleWalletPass } from '@/lib/wallet/apple-pass';

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { username } = await params;

  const profile = await getMyProfile();
  if (!profile) return new NextResponse('Unauthorized', { status: 401 });
  if (profile.username !== username) return new NextResponse('Forbidden', { status: 403 });

  const components = await getProfileComponents(profile.id);
  const socialStatItems =
    (
      components.find((c) => c.type === 'social_stat')?.data as
        | { items?: Array<{ platform: string; handle?: string }> }
        | undefined
    )?.items ?? [];
  const getSocial = (p: string) =>
    socialStatItems.find((i) => i.platform.toLowerCase() === p)?.handle ?? null;

  const profileSocials = {
    instagram: getSocial('instagram'),
    tiktok: getSocial('tiktok'),
    youtube: getSocial('youtube'),
  };

  let passBuffer: Buffer;
  try {
    passBuffer = await generateAppleWalletPass(profile, profileSocials);
  } catch (err) {
    console.error('[wallet] pass generation failed', err);
    return new NextResponse('Failed to generate pass', { status: 500 });
  }

  return new NextResponse(new Uint8Array(passBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${username}.pkpass"`,
    },
  });
}
