import os from 'os';
import path from 'path';
import fs from 'fs';
import { PKPass } from 'passkit-generator';
import type { Profile } from '@/lib/data/profiles';

// Minimal 1×1 PNG placeholder — replace with actual Blackbook icon
// Recommended sizes: icon.png 29×29, icon@2x.png 58×58
const ICON_PLACEHOLDER_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

let cachedModelDir: string | null = null;

function getModelDir(): string {
  if (cachedModelDir) return cachedModelDir;

  const dir = path.join(os.tmpdir(), 'BlackbookContact.pass');
  fs.mkdirSync(dir, { recursive: true });

  const iconBuf = Buffer.from(ICON_PLACEHOLDER_B64, 'base64');
  fs.writeFileSync(path.join(dir, 'icon.png'), iconBuf);
  fs.writeFileSync(path.join(dir, 'icon@2x.png'), iconBuf);

  const template = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    organizationName: 'Blackbook',
    description: 'Blackbook Contact Card',
    generic: {
      primaryFields: [],
      secondaryFields: [],
      auxiliaryFields: [],
      backFields: [],
    },
  };
  fs.writeFileSync(path.join(dir, 'pass.json'), JSON.stringify(template));

  cachedModelDir = dir;
  return dir;
}

function getCerts() {
  return {
    wwdr: Buffer.from(process.env.APPLE_WWDR_CERT!, 'base64'),
    signerCert: Buffer.from(process.env.APPLE_SIGNER_CERT!, 'base64'),
    signerKey: Buffer.from(process.env.APPLE_SIGNER_KEY!, 'base64'),
    signerKeyPassphrase: process.env.APPLE_PASS_PHRASE!,
  };
}

export async function generateAppleWalletPass(profile: Profile): Promise<Buffer> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const links = profile.social_links ?? {};

  const backFields: { key: string; label: string; value: string }[] = [];
  if (links.email) backFields.push({ key: 'email', label: 'Email', value: links.email });
  if (links.phone) backFields.push({ key: 'phone', label: 'Phone', value: links.phone });
  if (links.website) backFields.push({ key: 'website', label: 'Website', value: links.website });
  if (links.linkedin)
    backFields.push({ key: 'linkedin', label: 'LinkedIn', value: links.linkedin });
  if (links.instagram)
    backFields.push({
      key: 'instagram',
      label: 'Instagram',
      value: `@${links.instagram.replace(/^@/, '')}`,
    });
  if (links.twitter)
    backFields.push({
      key: 'twitter',
      label: 'Twitter',
      value: `@${links.twitter.replace(/^@/, '')}`,
    });
  if (links.tiktok)
    backFields.push({
      key: 'tiktok',
      label: 'TikTok',
      value: `@${links.tiktok.replace(/^@/, '')}`,
    });
  if (links.whatsapp)
    backFields.push({ key: 'whatsapp', label: 'WhatsApp', value: links.whatsapp });

  const pass = await PKPass.from(
    {
      model: getModelDir(),
      certificates: getCerts(),
    },
    {
      serialNumber: profile.username!,
      backgroundColor: 'rgb(14,14,13)',
      foregroundColor: 'rgb(250,250,249)',
      labelColor: 'rgb(184,180,174)',
      logoText: 'Blackbook',
    }
  );

  pass.primaryFields.push({ key: 'name', value: profile.full_name ?? '' });

  if (profile.role) pass.secondaryFields.push({ key: 'role', label: 'Role', value: profile.role });
  if (profile.location)
    pass.secondaryFields.push({ key: 'location', label: 'Location', value: profile.location });

  for (const field of backFields) {
    pass.backFields.push(field);
  }

  pass.setBarcodes({
    message: `${appUrl}/p/${profile.username}`,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1',
  });

  if (profile.avatar_url) {
    try {
      const res = await fetch(profile.avatar_url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        pass.addBuffer('thumbnail.png', buf);
        pass.addBuffer('thumbnail@2x.png', buf);
      }
    } catch {
      // omit thumbnail on failure
    }
  }

  return pass.getAsBuffer();
}
