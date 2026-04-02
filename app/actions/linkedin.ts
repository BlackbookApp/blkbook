'use server';

import { adminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getVaultContactByLinkedinUrl } from '@/lib/data/vault-contacts';

export interface LinkedInPrefill {
  name: string;
  role: string | null;
  city: string | null;
  notes: string | null;
  email: string | null;
  photo_url: string | null;
  website: string | null;
  linkedin_url: string;
}

export async function getVaultContactByLinkedinUrlAction(linkedinUrl: string) {
  return getVaultContactByLinkedinUrl(linkedinUrl);
}

interface ApifyBasicInfo {
  fullname?: string;
  headline?: string;
  location?: { city?: string; full?: string };
  about?: string;
  email?: string;
  profile_picture_url?: string;
  profile_url?: string;
}

export async function fetchLinkedInProfile(linkedinUrl: string): Promise<LinkedInPrefill> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error('APIFY_TOKEN not configured');

  const response = await fetch(
    `https://api.apify.com/v2/acts/apimaestro~linkedin-profile-detail/run-sync-get-dataset-items?token=${token}&timeout=60`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ includeEmail: true, username: linkedinUrl }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apify request failed: ${response.status} — ${text}`);
  }

  const items = (await response.json()) as Array<{ basic_info?: ApifyBasicInfo }>;
  const info = items?.[0]?.basic_info;
  if (!info) throw new Error('No profile data returned');

  const photoUrl = await maybeUploadPhoto(info.profile_picture_url);
  const city = info.location?.city ?? info.location?.full ?? null;
  const canonicalUrl = info.profile_url ?? linkedinUrl;

  return {
    name: info.fullname ?? '',
    role: info.headline?.trim() ?? null,
    city,
    notes: null,
    email: info.email ?? null,
    photo_url: photoUrl,
    website: null,
    linkedin_url: canonicalUrl,
  };
}

async function maybeUploadPhoto(photoUrl: string | undefined): Promise<string | null> {
  if (!photoUrl) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const res = await fetch(photoUrl);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const ext = photoUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${user.id}/avatar-linkedin-${Date.now()}.${ext}`;

    const { error } = await adminClient.storage.from('avatars').upload(path, buffer, {
      contentType: res.headers.get('content-type') ?? 'image/jpeg',
      upsert: true,
    });
    if (error) return null;

    const { data } = adminClient.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}
