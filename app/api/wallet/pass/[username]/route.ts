import { NextResponse } from 'next/server';
import { getMyProfile } from '@/lib/data/profiles';
import { generateAppleWalletPass } from '@/lib/wallet/apple-pass';

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { username } = await params;

  const profile = await getMyProfile();
  if (!profile) return new NextResponse('Unauthorized', { status: 401 });
  if (profile.username !== username) return new NextResponse('Forbidden', { status: 403 });

  const passBuffer = await generateAppleWalletPass(profile);

  return new NextResponse(new Uint8Array(passBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${username}.pkpass"`,
    },
  });
}
