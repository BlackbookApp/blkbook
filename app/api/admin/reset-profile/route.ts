import { NextResponse } from 'next/server';
import { resetProfileComplete } from '@/lib/data/profiles';

export async function POST(req: Request) {
  const { profileId, userId } = await req.json();

  if (!profileId || !userId) {
    return NextResponse.json({ error: 'profileId and userId are required' }, { status: 400 });
  }

  const { error } = await resetProfileComplete(profileId, userId);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ ok: true });
}
