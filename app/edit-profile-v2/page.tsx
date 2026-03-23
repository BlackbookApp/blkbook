'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { EDITOR_MAP } from '@/config/editorMap';

const TOTAL_STEPS = 2;

const EditProfileV2 = () => {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: components = [], isLoading: componentsLoading } = useProfileComponents(profile?.id);

  const [step, setStep] = useState(1);

  const isLoading = profileLoading || componentsLoading;

  const heroComponent = components.find((c) => c.type === 'profile_hero_centered');
  const otherComponents = components.filter((c) => c.type !== 'profile_hero_centered');

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <p className="blackbook-label">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={() => router.push(routes.myBlackbook)}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mt-2">
        <span className="font-helvetica text-[10px] tracking-[0.2em] text-bb-muted/40 font-light">
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
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-32"
          >
            <h2 className="font-granjon text-2xl mb-1">Your profile</h2>
            <p className="font-helvetica text-[11px] text-bb-muted mb-8">
              Name, photo and intro line.
            </p>

            {heroComponent ? (
              <EDITOR_MAP.profile_hero_centered.component component={heroComponent} />
            ) : (
              <p className="font-helvetica text-[11px] text-bb-muted">
                No profile hero found. Add one from the component library.
              </p>
            )}

            <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background/80 to-transparent">
              <div className="max-w-md mx-auto">
                <button className="bb-btn-primary" onClick={() => setStep(2)}>
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-32"
          >
            <h2 className="font-granjon text-2xl mb-1">Your content</h2>
            <p className="font-helvetica text-[11px] text-bb-muted mb-8">
              Edit each section below. Changes save automatically.
            </p>

            {otherComponents.length === 0 ? (
              <p className="font-helvetica text-[11px] text-bb-muted">
                No additional components yet.
              </p>
            ) : (
              <div className="space-y-10">
                {otherComponents.map((component) => {
                  const entry = EDITOR_MAP[component.type as keyof typeof EDITOR_MAP];
                  if (!entry) return null;
                  const EditorComponent = entry.component;
                  return (
                    <div key={component.id}>
                      <div className="mb-4">
                        <p className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted">
                          {entry.label}
                        </p>
                        <p className="font-helvetica text-[11px] text-bb-muted mt-0.5">
                          {entry.description}
                        </p>
                      </div>
                      <EditorComponent component={component} />
                      <div className="h-px bg-bb-rule mt-10" />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background/80 to-transparent">
              <div className="max-w-md mx-auto flex flex-col gap-3">
                <button className="bb-btn-primary" onClick={() => router.push(routes.myBlackbook)}>
                  Done
                </button>
                <button
                  className="font-helvetica text-[11px] tracking-[0.1em] text-bb-muted/50 hover:text-foreground transition-colors text-center"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfileV2;
