import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProfileByUsername } from '@/lib/data/profiles';
import PublicProfileVisual from '@/components/public-profile/public-profile-visual';
import PublicProfileEditorial from '@/components/public-profile/public-profile-editorial';

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
    logoSrc: profile.logo_url,
    socialLinks: profile.social_links,
    brandStatement: profile.brand_statement,
  };

  const portfolio = profile.portfolio_images.map((img) => ({ imageSrc: img.url }));

  const testimonials = profile.testimonials.map((t) => ({
    quote: t.quote,
    author: t.author ? `${t.author}${t.title ? `, ${t.title}` : ''}` : undefined,
  }));

  const theme = profile.palette === 'noir' ? 'noir' : 'blanc';

  if (profile.style === 'editorial') {
    return (
      <PublicProfileEditorial
        theme={theme}
        profile={profileData}
        portfolio={portfolio}
        testimonials={testimonials}
        profileStyle="editorial"
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
    />
  );
}
