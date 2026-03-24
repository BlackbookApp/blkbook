import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfileByUsername } from '@/lib/data/profiles';
import { getProfileComponents } from '@/lib/data/components';
import { ProfileComponentsView } from '@/components/ProfileComponentsView';
import { extractContactsFromComponents } from '@/components/public-profile/shared/profile-adapters';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: profile.full_name ?? username,
    description: profile.bio ?? profile.role ?? undefined,
    openGraph: profile.avatar_url ? { images: [{ url: profile.avatar_url }] } : undefined,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const profileComponents = await getProfileComponents(profile.id);

  const theme = profile.palette === 'noir' ? 'noir' : 'blanc';

  return (
    <div className="min-h-[100dvh] bg-background">
      <ProfileComponentsView
        theme={theme}
        components={profileComponents}
        profileView={{
          profileId: profile.id,
          profileOwnerId: profile.user_id,
          profileFirstName: profile.full_name?.split(' ')[0] ?? '',
          profileUsername: username,
          profileName: profile.full_name ?? '',
          profileRole: profile.role,
          profilePhotoUrl: profile.avatar_url,
          socialLinks: extractContactsFromComponents(profileComponents),
        }}
      />
    </div>
  );
}
