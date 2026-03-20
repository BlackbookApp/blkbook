import { notFound } from 'next/navigation';
import { getProfileByUsernameAdmin } from '@/lib/data/profiles';
import { getProfileComponentsAdmin } from '@/lib/data/components';
import { ProfileComponentsView } from '@/components/ProfileComponentsView';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function TestProfileComponentsPage({ params }: Props) {
  const { username } = await params;

  const profile = await getProfileByUsernameAdmin(username);
  if (!profile) notFound();

  const components = await getProfileComponentsAdmin(profile.id);

  return (
    <div className="min-h-[100dvh] bg-background">
      <ProfileComponentsView
        components={components}
        profileView={{
          profileId: profile.id,
          profileOwnerId: profile.user_id,
          profileFirstName: profile.full_name?.split(' ')[0] ?? '',
          profileUsername: username,
          profileName: profile.full_name ?? '',
          profileRole: profile.role,
          profilePhotoUrl: profile.avatar_url,
          socialLinks: profile.social_links ?? {},
        }}
      />
    </div>
  );
}
