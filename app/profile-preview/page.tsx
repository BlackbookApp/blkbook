'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { updateProfileAction } from '@/app/actions/profiles';
import { useQueryClient } from '@tanstack/react-query';
import { routes } from '@/lib/routes';
import PublicProfileVisual from '@/components/public-profile/public-profile-visual';
import PublicProfileEditorial from '@/components/public-profile/public-profile-editorial';
import type { ProfileTheme } from '@/components/public-profile/public-profile-visual';

const ProfilePreview = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();
  const [theme] = useState<ProfileTheme>('blanc');
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async () => {
    setIsPending(true);
    await updateProfileAction({ is_published: true });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    router.push(routes.paywall);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="blackbook-label text-bb-muted">Loading…</p>
      </div>
    );
  }

  const profileData = {
    name: profile.full_name ?? '',
    bio: profile.bio,
    role: profile.role,
    location: profile.location,
    portraitSrc: profile.avatar_url,
    logoSrc: profile.logo_url,
    socialLinks: profile.social_links,
    brandStatement: profile.brand_statement,
  };

  const portfolio = profile.portfolio_images.map((img) => ({ imageSrc: img.url }));

  const testimonials = profile.testimonial_quote
    ? [
        {
          quote: profile.testimonial_quote,
          author: profile.testimonial_author
            ? `${profile.testimonial_author}${profile.testimonial_title ? `, ${profile.testimonial_title}` : ''}`
            : undefined,
        },
      ]
    : [];

  const isEditorial = profile.style === 'editorial';
  const profileTheme: ProfileTheme = profile.palette === 'noir' ? 'noir' : 'blanc';

  return (
    <div className="relative">
      {isEditorial ? (
        <PublicProfileEditorial
          theme={profileTheme}
          profile={profileData}
          portfolio={portfolio}
          testimonials={testimonials}
          profileStyle="editorial"
          isPreview={true}
        />
      ) : (
        <PublicProfileVisual
          theme={theme}
          profile={profileData}
          portfolio={portfolio}
          testimonials={testimonials}
          profileStyle="visual"
          isPreview={true}
        />
      )}

      {/* Floating header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-6 pt-8 flex items-center justify-between pointer-events-auto">
          <Logo />
          <button
            onClick={() => router.push(routes.editProfile)}
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50" data-pg-theme={profileTheme}>
        <div className="max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col items-center gap-3 bg-gradient-to-t from-[var(--pg-bg)] via-[var(--pg-bg)/80] to-transparent">
          <p className="text-[10px] tracking-wide text-muted-foreground/60">
            This is your first impression.
          </p>
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="pg-btn-primary disabled:opacity-50 w-full"
          >
            {isPending ? 'Publishing…' : 'Activate My Blackbook'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
