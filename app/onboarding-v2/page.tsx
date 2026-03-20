'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { OnboardingProgress } from '@/components/onboarding-v2/OnboardingProgress';
import { StepHeader } from '@/components/onboarding-v2/StepHeader';
import { StepRole } from '@/components/onboarding-v2/StepRole';
import { StepEssentials } from '@/components/onboarding-v2/StepEssentials';
import { StepPhoto } from '@/components/onboarding-v2/StepPhoto';
import { StepBuildMethod } from '@/components/onboarding-v2/StepBuildMethod';
import { Skeleton } from '@/components/ui/skeleton';
import { EDITOR_MAP } from '@/config/editorMap';
import { DISPLAY_MAP } from '@/config/displayMap';
import { REQUIRED_COMPONENTS } from '@/config/roleSchemas';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { updateComponentVisibilityAction } from '@/app/actions/components';
import { publishProfileAction } from '@/app/actions/profiles';
import { saveOnboardingAction } from '@/app/actions/onboarding';
import { createClient } from '@/lib/supabase/client';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { OnboardingState } from '@/components/onboarding-v2/types';
import type { RoleType, ComponentType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

const STEPS: Array<{
  label: string;
  title: string;
  subtext: string;
  canContinue: (state: OnboardingState) => boolean;
  continueLabel: (state: OnboardingState) => string;
}> = [
  {
    label: 'Your profile type',
    title: 'What do you do?',
    subtext: 'This shapes which sections appear on your profile and in what order.',
    canContinue: (s) => s.roleType !== null,
    continueLabel: () => 'Continue',
  },
  {
    label: 'The essentials',
    title: 'Just the basics.',
    subtext: 'Your name and your role. Everything else comes later.',
    canContinue: (s) => s.fullName.trim().length > 0,
    continueLabel: () => 'Continue',
  },
  {
    label: 'Your photo',
    title: 'Put a face to the name.',
    subtext:
      'The first thing someone sees when they scan your card. You can skip this and add it later.',
    canContinue: () => true,
    continueLabel: (s) => (s.heroPreview ? 'Continue' : 'Skip for now'),
  },
  {
    label: 'How to build',
    title: 'How do you want to build it?',
    subtext:
      'We can generate your profile from your existing content, or you can write it yourself.',
    canContinue: (s) => s.buildMethod !== null,
    continueLabel: (s) =>
      s.buildMethod === 'ai'
        ? 'Build my draft'
        : s.buildMethod === 'manual'
          ? 'Start building'
          : 'Continue',
  },
  {
    label: 'Your profile',
    title: 'Edit your sections.',
    subtext: 'Tap Edit on any section. Changes save automatically.',
    canContinue: () => true,
    continueLabel: () => 'Choose sections',
  },
  {
    label: 'Choose what to show',
    title: 'Almost there.',
    subtext: 'Toggle sections on or off. You can always change this later.',
    canContinue: () => true,
    continueLabel: () => 'Publish profile',
  },
];

// ─── Loading skeleton for the profile step ────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-8 px-6 py-8 max-w-md mx-auto w-full">
      <Skeleton className="h-64 w-full rounded-none" />
      <Skeleton className="h-6 w-48 rounded-none" />
      <Skeleton className="h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-3/4 rounded-none" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-5/6 rounded-none" />
        <Skeleton className="h-4 w-2/3 rounded-none" />
      </div>
    </div>
  );
}

// ─── Single editable section row ─────────────────────────────────────────────

function EditableSection({
  component,
  isEditing,
  onEdit,
  onDone,
}: {
  component: ProfileComponent;
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const displayEntry = DISPLAY_MAP[component.type as ComponentType];
  const editorEntry = EDITOR_MAP[component.type as ComponentType];
  if (!displayEntry || !editorEntry) return null;

  const Display = displayEntry.component;
  const Editor = editorEntry.component;

  return (
    <div className="border-b border-bb-rule last:border-b-0">
      {/* Row header */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/50">
          {editorEntry.label}
        </span>
        <button
          onClick={isEditing ? onDone : onEdit}
          className={cn(
            'font-helvetica text-[9px] uppercase tracking-[0.1em] transition-colors',
            isEditing ? 'text-foreground' : 'text-bb-muted/50 hover:text-foreground'
          )}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Display or editor — animated swap */}
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-6 pb-6"
          >
            <Editor component={component} />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-6 pb-6"
          >
            <Display data={component.data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component toggle card ────────────────────────────────────────────────────

function ComponentCard({
  component,
  isVisible,
  isRequired,
  onToggle,
}: {
  component: ProfileComponent;
  isVisible: boolean;
  isRequired: boolean;
  onToggle: () => void;
}) {
  const label = EDITOR_MAP[component.type as ComponentType]?.label ?? component.type;

  return (
    <button
      onClick={() => !isRequired && onToggle()}
      disabled={isRequired}
      className={cn(
        'flex flex-col justify-between p-3 border text-left transition-all',
        isVisible ? 'border-foreground bg-background' : 'border-bb-rule bg-transparent',
        isRequired && 'cursor-default'
      )}
    >
      <div className="space-y-1.5 mb-3 pointer-events-none">
        <div className={cn('h-1.5 w-full', isVisible ? 'bg-foreground/15' : 'bg-bb-rule')} />
        <div className={cn('h-1.5 w-3/4', isVisible ? 'bg-foreground/10' : 'bg-bb-rule/60')} />
        <div className={cn('h-1.5 w-1/2', isVisible ? 'bg-foreground/10' : 'bg-bb-rule/60')} />
      </div>
      <div className="flex items-end justify-between gap-1">
        <span
          className={cn(
            'font-helvetica text-[9px] uppercase tracking-[0.15em] leading-tight',
            isVisible ? 'text-foreground' : 'text-bb-muted/50'
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
              isVisible ? 'border-foreground' : 'border-bb-rule'
            )}
          >
            {isVisible && <span className="w-1.5 h-1.5 bg-foreground block" />}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingV2() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [stepIndex, setStepIndex] = useState(0);
  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [buildMethod, setBuildMethod] = useState<OnboardingState['buildMethod']>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});

  const { data: components, isLoading: componentsLoading } = useProfileComponents(
    stepIndex >= 4 ? (profileId ?? undefined) : undefined
  );

  const state: OnboardingState = { roleType, fullName, heroPreview, buildMethod };
  const currentStep = STEPS[stepIndex];
  const isProfileStep = stepIndex === 4;
  const isRefineStep = stepIndex === 5;
  const required = roleType ? (REQUIRED_COMPONENTS[roleType] ?? []) : [];

  const effectiveComponents = components?.map((c) => ({
    ...c,
    is_visible: visibilityMap[c.id] ?? c.is_visible,
  }));

  async function handleDoneEditing() {
    setActiveEditId(null);
    if (profileId) {
      await queryClient.invalidateQueries({ queryKey: ['profile-components', profileId] });
    }
  }

  async function handleContinue() {
    setSaveError(null);

    // Step 3 → 4: upload avatar + save onboarding
    if (stepIndex === 3) {
      if (!roleType || !buildMethod) return;
      setIsPending(true);
      try {
        let avatarUrl: string | null = null;
        if (heroFile) {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const ext = heroFile.name.split('.').pop() ?? 'jpg';
            const path = `${user.id}/avatar.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(path, heroFile, { upsert: true });
            if (!uploadError) {
              avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
            }
          }
        }

        const { profileId: savedId, error } = await saveOnboardingAction({
          roleType,
          buildMethod,
          fullName,
          roleTitle,
          avatarUrl,
        });

        if (error || !savedId) {
          setSaveError(error ?? 'Something went wrong. Please try again.');
          return;
        }

        setProfileId(savedId);
        await queryClient.invalidateQueries({ queryKey: ['profile-components', savedId] });
        setStepIndex(4);
      } finally {
        setIsPending(false);
      }
      return;
    }

    // Step 4 → 5: close any open editor + refresh before refine
    if (stepIndex === 4) {
      setActiveEditId(null);
      if (profileId) {
        await queryClient.invalidateQueries({ queryKey: ['profile-components', profileId] });
      }
    }

    // Step 5 → publish
    if (stepIndex === 5) {
      setIsPending(true);
      const { error } = await publishProfileAction();
      setIsPending(false);
      if (error) {
        setSaveError(error);
        return;
      }
      router.push(routes.myBlackbook); // TODO: confirm destination
      return;
    }

    setStepIndex((i) => i + 1);
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else router.back();
  }

  function handleToggle(component: ProfileComponent) {
    const current = visibilityMap[component.id] ?? component.is_visible;
    const next = !current;
    setVisibilityMap((prev) => ({ ...prev, [component.id]: next }));
    updateComponentVisibilityAction(component.id, next);
  }

  const canContinue = currentStep.canContinue(state) && !isPending;
  const isFullStep = isProfileStep || isRefineStep;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 flex-shrink-0">
        <Logo />
        <button
          onClick={handleBack}
          className="text-bb-muted/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <OnboardingProgress step={stepIndex + 1} total={STEPS.length} />

      {/* Content */}
      <div className={cn('flex-1 flex flex-col', isFullStep && 'overflow-hidden')}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Steps 0–3 */}
            {stepIndex <= 3 && (
              <div className="flex-1 flex flex-col px-6 pt-8 pb-6 max-w-md mx-auto w-full">
                <StepHeader
                  label={currentStep.label}
                  title={currentStep.title}
                  subtext={currentStep.subtext}
                />

                {stepIndex === 0 && <StepRole value={roleType} onChange={setRoleType} />}

                {stepIndex === 1 && (
                  <StepEssentials
                    fullName={fullName}
                    roleTitle={roleTitle}
                    onChangeName={setFullName}
                    onChangeRoleTitle={setRoleTitle}
                  />
                )}

                {stepIndex === 2 && (
                  <StepPhoto
                    heroPreview={heroPreview}
                    onChangeHero={(file, preview) => {
                      setHeroFile(file);
                      setHeroPreview(preview);
                    }}
                  />
                )}

                {stepIndex === 3 &&
                  (roleType ? (
                    <StepBuildMethod
                      roleType={roleType}
                      value={buildMethod}
                      onChange={setBuildMethod}
                    />
                  ) : (
                    <p className="font-helvetica text-[11px] text-bb-muted">
                      No role selected — please go back and choose one.
                    </p>
                  ))}
              </div>
            )}

            {/* Step 4: editable profile preview */}
            {isProfileStep && (
              <div className="flex-1 overflow-y-auto">
                {componentsLoading || !effectiveComponents ? (
                  <ProfileSkeleton />
                ) : (
                  <>
                    {/* Step header */}
                    <div className="px-6 pt-6 pb-2 max-w-md mx-auto w-full">
                      <StepHeader
                        label={currentStep.label}
                        title={currentStep.title}
                        subtext={currentStep.subtext}
                      />
                    </div>
                    {/* Sections */}
                    <div className="max-w-md mx-auto w-full pb-4">
                      {effectiveComponents.map((component) => (
                        <EditableSection
                          key={component.id}
                          component={component}
                          isEditing={activeEditId === component.id}
                          onEdit={() => setActiveEditId(component.id)}
                          onDone={handleDoneEditing}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 5: refine — header + scrollable toggle grid */}
            {isRefineStep && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex-shrink-0 max-w-md mx-auto w-full">
                  <StepHeader
                    label={currentStep.label}
                    title={currentStep.title}
                    subtext={currentStep.subtext}
                  />
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  {componentsLoading || !effectiveComponents ? (
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-none" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {effectiveComponents.map((component) => {
                        const isRequired = required.includes(
                          component.type as (typeof required)[number]
                        );
                        return (
                          <ComponentCard
                            key={component.id}
                            component={component}
                            isVisible={component.is_visible}
                            isRequired={isRequired}
                            onToggle={() => handleToggle(component)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className={cn(
          'px-6 pb-10 space-y-3 max-w-md mx-auto w-full flex-shrink-0',
          isFullStep && 'border-t border-bb-rule pt-4'
        )}
      >
        {saveError && (
          <p className="font-helvetica text-[10px] text-center text-destructive">{saveError}</p>
        )}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bb-btn-primary disabled:opacity-30"
        >
          {isPending
            ? isRefineStep
              ? 'Publishing…'
              : 'Saving…'
            : currentStep.continueLabel(state)}
        </button>
        {stepIndex > 0 && !isFullStep && (
          <button
            onClick={handleBack}
            disabled={isPending}
            className="w-full py-2 uppercase font-helvetica text-[10px] tracking-[0.25em] font-light text-bb-muted/60 hover:text-bb-muted transition-colors disabled:opacity-30"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
