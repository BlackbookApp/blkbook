import { NextResponse } from 'next/server';
import { getProfileByUsername } from '@/lib/data/profiles';

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) return new NextResponse('Not found', { status: 404 });

  const name = profile.full_name ?? username;
  const links = profile.social_links ?? {};

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`];

  if (profile.role) lines.push(`TITLE:${profile.role}`);
  if (links.phone) lines.push(`TEL;TYPE=CELL:${links.phone}`);
  if (links.email) lines.push(`EMAIL:${links.email}`);
  if (links.website) {
    const url = links.website.startsWith('http') ? links.website : `https://${links.website}`;
    lines.push(`URL:${url}`);
  }
  if (links.linkedin) lines.push(`X-SOCIALPROFILE;type=linkedin:${links.linkedin}`);
  if (profile.avatar_url) lines.push(`PHOTO;VALUE=URI:${profile.avatar_url}`);

  lines.push('END:VCARD');

  const vcf = lines.join('\r\n') + '\r\n';
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}.vcf"`,
    },
  });
}
