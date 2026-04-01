import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfileByUsername } from '@/lib/data/profiles';
import { getProfileComponents } from '@/lib/data/components';
import { ProfileComponentsView } from '@/components/ProfileComponentsView';
import { BackToAppButton } from '@/components/public-profile/BackToAppButton';

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ from?: string }>;
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

export default async function PublicProfilePage({ params, searchParams }: Props) {
  const { username } = await params;
  const { from } = await searchParams;

  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const profileComponents = await getProfileComponents(profile.id);

  const socialStatItems =
    (
      profileComponents.find((c) => c.type === 'social_stat')?.data as
        | { items?: Array<{ platform: string; handle?: string }> }
        | undefined
    )?.items ?? [];
  const getSocial = (p: string) =>
    socialStatItems.find((i) => i.platform.toLowerCase() === p)?.handle ?? null;

  const theme = profile.palette === 'noir' ? 'noir' : 'blanc';

  return (
    <div className="min-h-[100dvh] bg-background">
      {from === 'app' && <BackToAppButton />}
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
          socialLinks: profile.social_links,
          profileSocials: {
            instagram: getSocial('instagram'),
            tiktok: getSocial('tiktok'),
            youtube: getSocial('youtube'),
          },
          ctaButtons: profile.cta_buttons,
        }}
      />
    </div>
  );
}
