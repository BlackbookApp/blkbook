import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfileByUsername } from '@/lib/data/profiles';
import PublicProfileVisual from '@/components/public-profile/public-profile-visual';
import PublicProfileEditorial from '@/components/public-profile/public-profile-editorial';
import { profileFromDB } from '@/components/public-profile/shared/profile-adapters';

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

  const { profile: profileData, portfolio, testimonials } = profileFromDB(profile);

  const ctaProps = {
    profileId: profile.id,
    profileOwnerId: profile.user_id,
    profileUsername: username,
  };

  const theme = profile.palette === 'noir' ? 'noir' : 'blanc';

  if (profile.style === 'editorial') {
    return (
      <PublicProfileEditorial
        theme={theme}
        profile={profileData}
        portfolio={portfolio}
        testimonials={testimonials}
        profileStyle="editorial"
        {...ctaProps}
      />
    );
  }

  return (
    <PublicProfileVisual
      theme={theme}
      profile={profileData}
      portfolio={portfolio}
      testimonials={testimonials}
      profileStyle={profile.style || 'visual'}
      {...ctaProps}
    />
  );
}
