'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import { updateProfileAction } from '@/app/actions/profiles';
import { useQueryClient } from '@tanstack/react-query';
import { routes } from '@/lib/routes';
import PublicProfileVisual from '@/components/public-profile/public-profile-visual';
import PublicProfileEditorial from '@/components/public-profile/public-profile-editorial';
import type { ProfileTheme } from '@/components/public-profile/public-profile-visual';
import BottomNav from '@/components/BottomNav';
import { profileFromDB } from '@/components/public-profile/shared/profile-adapters';

const ProfilePreview = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async () => {
    setIsPending(true);
    await updateProfileAction({ is_published: true });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    router.push(routes.myBlackbook);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="blackbook-label">Loading…</p>
      </div>
    );
  }

  const { profile: profileData, portfolio, testimonials } = profileFromDB(profile);
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
          theme={profileTheme}
          profile={profileData}
          portfolio={portfolio}
          testimonials={testimonials}
          profileStyle="visual"
          isPreview={true}
        />
      )}

      {/* Floating header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-6 pt-8 flex items-center justify-end pointer-events-auto">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-md mx-auto px-6 flex flex-col items-center gap-3 pb-32">
        {profile.is_published ? (
          <>
            <p className="font-helvetica text-[10px] tracking-wide text-muted-foreground/60">
              Live
            </p>
            <a
              href={routes.publicProfile(profile.username!)}
              className="w-full py-4 text-xs tracking-wide uppercase font-helvetica font-normal transition-all hover:opacity-80 bg-bb-dark text-bb-cream flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View public profile
            </a>
          </>
        ) : (
          <>
            <p className="font-helvetica text-[10px] tracking-wide text-muted-foreground/60">
              Unpublished
            </p>
            <button
              onClick={handlePublish}
              disabled={isPending}
              className="w-full py-4 text-xs tracking-wide uppercase font-helvetica font-normal transition-all hover:opacity-80 bg-bb-dark text-bb-cream disabled:opacity-50"
            >
              {isPending ? 'Publishing…' : 'Publish profile'}
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePreview;
