'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';
import { editProfileDefaults } from '@/lib/demo-data/profiles';
import type {
  ProfileStyle,
  ProfilePalette,
  SocialFields,
  WorkData,
} from '@/components/edit-profile/types';
import { StepStyle } from '@/components/edit-profile/step-style';
import { StepProfile } from '@/components/edit-profile/step-profile';
import { StepWork } from '@/components/edit-profile/step-work';
import { CompletionScreen } from '@/components/edit-profile/completion-screen';
import { MiniPreview } from '@/components/edit-profile/mini-preview';

const EditProfile = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);

  const [style, setStyle] = useState<ProfileStyle>(null);
  const [palette, setPalette] = useState<ProfilePalette>(null);

  const [name, setName] = useState(editProfileDefaults.name);
  const [role, setRole] = useState(editProfileDefaults.role);
  const [location, setLocation] = useState(editProfileDefaults.location);
  const [socials, setSocials] = useState<SocialFields>({
    website: '',
    instagram: '',
    linkedin: '',
    email: '',
    phone: '',
  });

  const [work, setWork] = useState<WorkData>({
    portfolioImages: [],
    logo: null,
    testimonialQuote: '',
    testimonialName: '',
    testimonialTitle: '',
    brandStatement: '',
  });

  if (showCompletion) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <CompletionScreen onDone={() => router.push(routes.myBlackbook)} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
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

      <div className="flex justify-center mt-2">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground/40 font-light">
          Step {step} of 3
        </span>
      </div>
      <div className="px-6 mt-3">
        <div className="w-full h-[2px] bg-border/30 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepStyle
            key="step1"
            style={style}
            setStyle={setStyle}
            palette={palette}
            setPalette={setPalette}
            onContinue={() => setStep(2)}
            onPreview={(type) =>
              router.push(type === 'visual' ? routes.photographerBeige : routes.ecommerceSpecialist)
            }
          />
        )}
        {step === 2 && (
          <StepProfile
            key="step2"
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            location={location}
            setLocation={setLocation}
            socials={socials}
            setSocials={setSocials}
            onContinue={() => setStep(3)}
            onSkip={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepWork
            key="step3"
            work={work}
            setWork={setWork}
            onFinish={() => setShowCompletion(true)}
          />
        )}
      </AnimatePresence>

      {step === 1 && (style || palette) && <MiniPreview style={style} palette={palette} />}
    </div>
  );
};

export default EditProfile;
