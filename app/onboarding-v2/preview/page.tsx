'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { Skeleton } from '@/components/ui/skeleton';
import { DISPLAY_MAP } from '@/config/displayMap';
import { publishProfileAction } from '@/app/actions/profiles';
import { routes } from '@/lib/routes';
import type { ComponentType } from '@/config/roleSchemas';

export default function OnboardingPreview() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: components, isLoading: componentsLoading } = useProfileComponents(profile?.id);
  const [publishing, startPublish] = useTransition();
  const [publishError, setPublishError] = useState<string | null>(null);

  const isLoading = profileLoading || componentsLoading;
  const visible = components?.filter((c) => c.is_visible) ?? [];

  function handlePublish() {
    setPublishError(null);
    startPublish(async () => {
      const { error } = await publishProfileAction();
      if (error) {
        setPublishError(error);
        return;
      }
      router.push(routes.editProfile);
    });
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-bb-rule">
        <Logo />
        <button
          onClick={() => router.back()}
          className="text-bb-muted/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Step label */}
      <div className="px-6 pt-6 pb-2">
        <p className="blackbook-label">Preview</p>
        <div className="h-px bg-bb-rule mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-8 overflow-y-auto pb-32">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-helvetica text-[11px] font-light text-bb-muted text-center">
              No visible sections yet.
            </p>
          </div>
        ) : (
          visible.map((component) => {
            const entry = DISPLAY_MAP[component.type as ComponentType];
            if (!entry) return null;
            const DisplayComponent = entry.component;
            return (
              <div key={component.id}>
                <DisplayComponent data={component.data} />
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      {!isLoading && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-background border-t border-bb-rule space-y-3">
          {publishError && (
            <p className="font-helvetica text-[10px] text-red-500 text-center">{publishError}</p>
          )}
          <button onClick={handlePublish} disabled={publishing} className="bb-btn-primary">
            {publishing ? 'Publishing…' : 'Publish profile'}
          </button>
        </div>
      )}
    </div>
  );
}
