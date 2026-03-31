import { NextResponse } from 'next/server';
import { getMyProfile } from '@/lib/data/profiles';
import { getProfileComponents } from '@/lib/data/components';
import { extractContactsFromComponents } from '@/components/public-profile/shared/profile-adapters';
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

  const hero = components.find((c) => c.type === 'profile_hero_centered')?.data as
    | {
        name: string | null;
        image_url: string | null;
        tagline: string | null;
        location: string | null;
      }
    | undefined;

  const socialLinks = extractContactsFromComponents(components);

  let passBuffer: Buffer;
  try {
    passBuffer = await generateAppleWalletPass({
      ...profile,
      full_name: hero?.name ?? profile.full_name,
      role: hero?.tagline ?? profile.role,
      location: hero?.location ?? profile.location,
      avatar_url: hero?.image_url ?? profile.avatar_url,
      social_links: socialLinks,
    });
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
