'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileEditor } from '@/components/ProfileEditor';
import { routes } from '@/lib/routes';
import type { RoleType } from '@/config/roleSchemas';

export default function OnboardingManualPath() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: components, isLoading: componentsLoading } = useProfileComponents(profile?.id);

  const isLoading = profileLoading || componentsLoading;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Logo />
        <div className="flex items-center gap-4">
          {!isLoading && components && components.length > 0 && (
            <button
              onClick={() => router.push(routes.onboardingV2Preview)}
              className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-foreground border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              Preview
            </button>
          )}
          <button
            onClick={() => router.push(routes.onboardingV2)}
            className="text-bb-muted/50 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex-1 px-6 pt-8 space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {!isLoading && (!components || components.length === 0) && (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="font-helvetica text-[11px] font-light text-bb-muted text-center">
            No sections found. Try going back and completing the setup.
          </p>
        </div>
      )}

      {!isLoading && components && components.length > 0 && profile?.role && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ProfileEditor components={components} roleType={profile.role as RoleType} />
        </div>
      )}
    </div>
  );
}
