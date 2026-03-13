'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { updateProfileAction } from '@/app/actions/profiles';
import { createClient } from '@/lib/supabase/client';
import { routes } from '@/lib/routes';
import { Input } from '@/components/ui/input';

const TOTAL_STEPS = 2;
type Step = 1 | 2;

const bioExamples = [
  'Creative director.',
  'Architect. Zürich & Milan.',
  'I connect capital with creativity.',
  'Film producer, independent & commercial.',
  'Founder & CEO, luxury wellness.',
];

const CreateProfile = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isPending, setIsPending] = useState(false);

  // Step 1
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  // Step 2
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotating bio placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const bioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 1 || bio) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % bioExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, bio]);

  const handleBack = () => {
    if (step === 2) setStep(1);
    else router.back();
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsPending(true);

    let avatarUrl: string | undefined;

    if (heroFile) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const ext = heroFile.name.split('.').pop() ?? 'jpg';
        const path = `${user.id}/avatar.${ext}`;
        const { error } = await supabase.storage
          .from('avatars')
          .upload(path, heroFile, { upsert: true });
        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('avatars').getPublicUrl(path);
          avatarUrl = publicUrl;
        }
      }
    }

    const supabaseClient = createClient();
    await supabaseClient.auth.updateUser({ data: { profile_complete: true } });

    await updateProfileAction({
      bio,
      location,
      profile_complete: true,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    router.push(routes.profilePreview);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={handleBack}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex justify-center mt-2">
        <span className="font-helvetica text-[10px] tracking-[0.2em] text-bb-muted/40 font-light">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
      <div className="px-6 mt-3">
        <div className="w-full h-[2px] bg-border/30 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Step 1: Bio + Location */}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 flex flex-col w-full"
            >
              <p className="font-helvetica text-[10px] tracking-[0.25em] uppercase text-bb-muted mb-3">
                Your profile
              </p>
              <div className="h-px bg-border mb-4" />

              <h1 className="font-granjon text-xl tracking-tight uppercase text-foreground mb-2">
                Describe yourself in one line.
              </h1>
              <p className="font-helvetica text-[11px] font-normal leading-relaxed text-bb-muted mb-5">
                A short bio or tagline — your role, your mission, whatever feels right.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    ref={bioInputRef}
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className=""
                  />
                  {!bio && (
                    <div
                      className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
                      onClick={() => bioInputRef.current?.focus()}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={placeholderIndex}
                          initial={{ x: '100%', opacity: 0 }}
                          animate={{ x: '0%', opacity: 1 }}
                          exit={{ x: '-100%', opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'easeInOut' }}
                          className="text-sm text-muted-foreground/40 whitespace-nowrap"
                        >
                          {bioExamples[placeholderIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you based? (e.g. London, Worldwide)"
                  className="placeholder:text-muted-foreground/40"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Photo */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 flex flex-col w-full"
            >
              <p className="font-helvetica text-[10px] tracking-[0.25em] uppercase text-bb-muted mb-3">
                Your profile
              </p>
              <div className="h-px bg-border mb-4" />

              <h1 className="blackbook-title">First impressions happen in a second.</h1>
              <p className="font-helvetica text-[11px] font-normal leading-relaxed text-bb-muted mb-5">
                Add a photo that feels like you. This is what someone sees the moment they tap your
                card.
              </p>

              <div className="flex-1 flex items-start justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[4/5] max-w-[240px] border border-dashed border-border hover:border-muted-foreground/40 transition-colors flex flex-col items-center justify-center gap-3 overflow-hidden"
                >
                  {heroPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-muted-foreground/30" />
                      <span className="font-helvetica text-[10px] tracking-[0.2em] uppercase text-bb-muted/30 font-light">
                        Add your photo
                      </span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="w-full pt-6">
          <button
            onClick={handleContinue}
            disabled={isPending}
            className="font-helvetica font-normal text-[11px] w-full bg-foreground text-background py-3.5 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay disabled:opacity-50"
          >
            {isPending
              ? step === TOTAL_STEPS
                ? 'Uploading…'
                : 'Saving…'
              : step === TOTAL_STEPS
                ? 'Preview my profile'
                : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
