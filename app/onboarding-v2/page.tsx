'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { OnboardingProgress } from '@/components/onboarding-v2/OnboardingProgress';
import { StepHeader } from '@/components/onboarding-v2/StepHeader';
import { StepRole } from '@/components/onboarding-v2/StepRole';
import { StepEssentials } from '@/components/onboarding-v2/StepEssentials';
import { StepPhoto } from '@/components/onboarding-v2/StepPhoto';
import { StepBuildMethod } from '@/components/onboarding-v2/StepBuildMethod';
import type { OnboardingState } from '@/components/onboarding-v2/types';
import { saveOnboardingAction } from '@/app/actions/onboarding';
import { createClient } from '@/lib/supabase/client';
import { routes } from '@/lib/routes';
import type { RoleType } from '@/config/roleSchemas';

// All step config co-located — add/remove/reorder steps here only
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
    subtext: 'Your name and a one-liner. Everything else comes later.',
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
];

export default function OnboardingV2() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [fullName, setFullName] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [buildMethod, setBuildMethod] = useState<OnboardingState['buildMethod']>(null);

  const [isPending, setIsPending] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const state: OnboardingState = { roleType, fullName, heroPreview, buildMethod };
  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleContinue = async () => {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }

    if (!roleType || !buildMethod) return;

    setIsPending(true);
    setSaveError(null);

    try {
      // Upload hero photo from client if provided
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

      const { error } = await saveOnboardingAction({
        roleType,
        fullName,
        tagline,
        avatarUrl,
      });

      if (error) {
        setSaveError(error);
        return;
      }

      router.push(buildMethod === 'ai' ? routes.onboardingV2Ai : routes.onboardingV2Manual);
    } finally {
      setIsPending(false);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else router.back();
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
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
      <div className="flex-1 flex flex-col px-6 pt-8 pb-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <StepHeader
              label={currentStep.label}
              title={currentStep.title}
              subtext={currentStep.subtext}
            />

            {stepIndex === 0 && <StepRole value={roleType} onChange={setRoleType} />}

            {stepIndex === 1 && (
              <StepEssentials
                fullName={fullName}
                tagline={tagline}
                onChangeName={setFullName}
                onChangeTagline={setTagline}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom buttons */}
      <div className="px-6 pb-10 space-y-3 max-w-md mx-auto w-full">
        {saveError && (
          <p className="font-helvetica text-[10px] text-center text-destructive">{saveError}</p>
        )}
        <button
          onClick={handleContinue}
          disabled={!currentStep.canContinue(state) || isPending}
          className="bb-btn-primary disabled:opacity-30"
        >
          {isPending ? 'Saving…' : currentStep.continueLabel(state)}
        </button>
        {stepIndex > 0 && (
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
