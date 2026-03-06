'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { updateProfileAction } from '@/app/actions/profiles';
import { routes } from '@/lib/routes';
import PublicProfile from '@/components/public-profile/public-profile-visual';
import type { ProfileTheme } from '@/components/public-profile/public-profile-visual';

const THEMES: ProfileTheme[] = ['blanc', 'beige', 'noir'];

const ProfilePreview = () => {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const [theme, setTheme] = useState<ProfileTheme>('blanc');
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async () => {
    setIsPending(true);
    await updateProfileAction({ is_published: true });
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
    socialLinks: profile.social_links,
  };

  const portfolio = profile.portfolio_images.map((img) => ({ imageSrc: img.url }));
  console.log(profileData, portfolio);

  return (
    <div className="relative">
      <PublicProfile
        theme={theme}
        profile={profileData}
        portfolio={portfolio}
        profileStyle={'visual'}
        isPreview={true}
      />

      {/* Floating header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-6 pt-8 flex items-center justify-between pointer-events-auto">
          <Logo />
          <button
            onClick={() => router.push(routes.createProfile)}
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50" data-pg-theme={theme}>
        <div className="max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col items-center gap-3 bg-gradient-to-t from-[var(--pg-bg)] via-[var(--pg-bg)/80] to-transparent">
          {/* <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                data-pg-theme={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 text-[10px] tracking-widest uppercase border transition-opacity ${
                  theme === t ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {t}
              </button>
            ))}
          </div> */}
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
