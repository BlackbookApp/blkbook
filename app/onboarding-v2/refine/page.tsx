'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { useInvalidateProfileComponents } from '@/hooks/use-profile-components';
import { Skeleton } from '@/components/ui/skeleton';
import { DISPLAY_MAP } from '@/config/displayMap';
import { REQUIRED_COMPONENTS } from '@/config/roleSchemas';
import { updateComponentVisibilityAction } from '@/app/actions/components';
import { publishProfileAction } from '@/app/actions/profiles';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { ComponentType, RoleType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

function ComponentCard({
  component,
  isRequired,
  onToggle,
}: {
  component: ProfileComponent;
  isRequired: boolean;
  onToggle: (id: string, visible: boolean) => void;
}) {
  const entry = DISPLAY_MAP[component.type as ComponentType];
  const label = entry?.label ?? component.type;

  return (
    <button
      onClick={() => !isRequired && onToggle(component.id, !component.is_visible)}
      disabled={isRequired}
      className={cn(
        'relative flex flex-col justify-between p-3 border text-left transition-all',
        component.is_visible ? 'border-foreground bg-background' : 'border-bb-rule bg-transparent',
        isRequired && 'cursor-default'
      )}
    >
      {/* Skeleton preview */}
      <div className="space-y-1.5 mb-3 pointer-events-none">
        <div
          className={cn(
            'h-1.5 w-full rounded-none',
            component.is_visible ? 'bg-foreground/15' : 'bg-bb-rule'
          )}
        />
        <div
          className={cn(
            'h-1.5 w-3/4 rounded-none',
            component.is_visible ? 'bg-foreground/10' : 'bg-bb-rule/60'
          )}
        />
        <div
          className={cn(
            'h-1.5 w-1/2 rounded-none',
            component.is_visible ? 'bg-foreground/10' : 'bg-bb-rule/60'
          )}
        />
      </div>

      {/* Label row */}
      <div className="flex items-end justify-between gap-1">
        <span
          className={cn(
            'font-helvetica text-[9px] uppercase tracking-[0.15em] leading-tight',
            component.is_visible ? 'text-foreground' : 'text-bb-muted/50'
          )}
        >
          {label}
        </span>
        {isRequired ? (
          <span className="font-helvetica text-[7px] uppercase tracking-[0.12em] text-bb-muted/50 whitespace-nowrap">
            Always on
          </span>
        ) : (
          <span
            className={cn(
              'w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center',
              component.is_visible ? 'border-foreground' : 'border-bb-rule'
            )}
          >
            {component.is_visible && <span className="w-1.5 h-1.5 bg-foreground block" />}
          </span>
        )}
      </div>
    </button>
  );
}

export default function OnboardingRefine() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: components, isLoading: componentsLoading } = useProfileComponents(profile?.id);
  const invalidate = useInvalidateProfileComponents();
  const [publishing, startPublish] = useTransition();
  const [publishError, setPublishError] = useState<string | null>(null);

  const isLoading = profileLoading || componentsLoading;
  const required = profile?.role ? (REQUIRED_COMPONENTS[profile.role as RoleType] ?? []) : [];

  async function handleToggle(componentId: string, isVisible: boolean) {
    if (!profile?.id) return;
    await updateComponentVisibilityAction(componentId, isVisible);
    invalidate(profile.id);
  }

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

      {/* Step label + title */}
      <div className="px-6 pt-6 pb-5">
        <p className="blackbook-label">Sections</p>
        <div className="h-px bg-bb-rule mt-2 mb-4" />
        <h1 className="font-granjon text-[26px] uppercase tracking-tight text-foreground leading-tight">
          Choose what to show.
        </h1>
        <p className="font-helvetica text-[11px] font-light text-bb-muted mt-2">
          Toggle sections on or off. You can always change this later.
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 px-6 pb-36 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : !components || components.length === 0 ? (
          <p className="font-helvetica text-[11px] font-light text-bb-muted text-center py-12">
            No sections found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {components.map((component) => {
              const isRequired = required.includes(component.type as (typeof required)[number]);
              return (
                <ComponentCard
                  key={component.id}
                  component={component}
                  isRequired={isRequired}
                  onToggle={handleToggle}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
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
