import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfileByUsername } from '@/lib/data/profiles';
import PublicProfile from '@/components/public-profile/public-profile-visual';

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

  const profileData = {
    name: profile.full_name ?? username,
    bio: profile.bio,
    role: profile.role,
    location: profile.location,
    portraitSrc: profile.avatar_url,
    socialLinks: profile.social_links,
  };

  const portfolio = profile.portfolio_images.map((img) => ({ imageSrc: img.url }));

  return (
    <PublicProfile
      theme={profile.palette === 'noir' ? 'noir' : 'blanc'}
      profile={profileData}
      portfolio={portfolio}
      profileStyle={profile.style || 'visual'}
    />
  );
}
