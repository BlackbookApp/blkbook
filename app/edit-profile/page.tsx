'use client';

import { useState, useEffect } from 'react';
import type { SocialLinks } from '@/lib/data/profiles';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { routes } from '@/lib/routes';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { Step1 } from '@/components/edit-profile/step1';
import { Step2 } from '@/components/edit-profile/step2';
import { Step3 } from '@/components/edit-profile/step3';
import { updateProfileAction } from '@/app/actions/profiles';
import { patchComponentData } from '@/lib/api/components';

const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'youtube'] as const;

const SOCIAL_LINK_KEYS = new Set<string>(['linkedin', 'website', 'email', 'phone', 'whatsapp']);

const TOTAL_STEPS = 3;

const EditProfile = () => {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: components = [], isLoading: componentsLoading } = useProfileComponents(profile?.id);

  const [step, setStep] = useState(1);
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [buttonValues, setButtonValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.cta_buttons) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedButtons(profile.cta_buttons);
    }
  }, [profile?.cta_buttons]);

  useEffect(() => {
    if (profile?.social_links) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setButtonValues(profile.social_links as Record<string, string>);
    }
  }, [profile?.social_links]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const isLoading = profileLoading || componentsLoading;

  const heroComponent = components.find((c) => c.type === 'profile_hero_centered');
  const otherComponents = components.filter(
    (c) => c.type !== 'profile_hero_centered' && c.type !== 'social_stat'
  );

  const handleButtonsContinue = async () => {
    setIsSaving(true);
    const validButtons = selectedButtons.filter(
      (k) => SOCIAL_LINK_KEYS.has(k) && !!buttonValues[k]
    );
    const socialLinks: SocialLinks = {};
    for (const key of Object.keys(buttonValues)) {
      if (buttonValues[key]) {
        (socialLinks as Record<string, string>)[key] = buttonValues[key];
      }
    }

    const socialStatComponent = components.find((c) => c.type === 'social_stat');
    const saves: Promise<unknown>[] = [
      updateProfileAction({ cta_buttons: validButtons, social_links: socialLinks }),
    ];
    if (socialStatComponent) {
      type StatItem = {
        platform: string;
        handle: string | null;
        count: string | null;
        url: string | null;
      };
      const existingItems: StatItem[] =
        (socialStatComponent.data as { items?: StatItem[] })?.items ?? [];
      const updatedItems = [...existingItems];
      for (const platform of SOCIAL_PLATFORMS) {
        const handle = buttonValues[platform] || null;
        const idx = updatedItems.findIndex((i) => i.platform === platform);
        if (idx >= 0) {
          updatedItems[idx] = { ...updatedItems[idx], handle };
        } else if (handle) {
          updatedItems.push({ platform, handle, count: null, url: null });
        }
      }
      saves.push(patchComponentData(socialStatComponent.id, { items: updatedItems }));
    }

    await Promise.all(saves);
    setIsSaving(false);
    setStep(3);
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <p className="blackbook-label">Loading…</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-flow min-h-[100dvh] flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 pt-6 gap-4">
        <button
          type="button"
          onClick={() => (step === 1 ? router.push(routes.myBlackbook) : setStep(step - 1))}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-bb-rule bg-background transition-opacity hover:opacity-70"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={1.5} />
        </button>
        <p className="font-granjon italic text-[15px] text-foreground">Edit profile</p>
        <button
          type="button"
          onClick={() => router.push(routes.myBlackbook)}
          className="font-helvetica text-[12px] text-bb-muted transition-opacity hover:opacity-60"
        >
          Close
        </button>
      </header>

      {/* Step indicator */}
      <div className="flex px-6 mt-2">
        <span className="font-helvetica uppercase text-[10px] tracking-[0.2em] font-light">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
      <div className="px-6 mt-3">
        <div className="w-full h-[2px] bg-border/30 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={false}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && heroComponent && (
          <Step1 key="step1" component={heroComponent} onContinue={() => setStep(2)} />
        )}

        {step === 2 && (
          <Step2
            key="step2"
            selectedButtons={selectedButtons}
            setSelectedButtons={setSelectedButtons}
            buttonValues={buttonValues}
            setButtonValues={setButtonValues}
            onContinue={handleButtonsContinue}
            onBack={() => setStep(1)}
            isSaving={isSaving}
          />
        )}

        {step === 3 && (
          <Step3
            key="step3"
            components={otherComponents}
            onFinish={() => router.push(routes.myBlackbook)}
            onBack={() => setStep(2)}
          />
        )}
      </AnimatePresence>

      <footer className="flex items-center justify-between px-6 pb-6">
        <span className="font-helvetica text-[11px] text-bb-muted">© 2026 HAIZEL</span>
        <span className="font-helvetica text-[11px] text-bb-muted uppercase tracking-[0.12em]">
          Private profile
        </span>
      </footer>
    </div>
  );
};

export default EditProfile;
