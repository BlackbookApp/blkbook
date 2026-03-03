'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { useProfile } from '@/hooks/use-profile';
import { publishProfile } from '@/lib/data/profiles';
import { routes } from '@/lib/routes';
import Image from 'next/image';

const ProfilePreview = () => {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async () => {
    setIsPending(true);
    await publishProfile();
    router.push(routes.paywall);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="blackbook-label text-bb-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={() => router.push(routes.createProfile)}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto pb-40">
        <div className="px-6 pt-4">
          {/* Name & Bio */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-base font-normal tracking-tight uppercase text-foreground font-canela-deck">
              {profile.full_name ?? 'Your Name'}
            </h1>
            <p className="text-xs tracking-wide uppercase text-muted-foreground font-sans">
              {profile.bio ?? ''}
            </p>
            <p className="text-xs font-medium tracking-wide uppercase text-foreground font-sans">
              {profile.location ?? ''}
            </p>
          </motion.div>

          {/* Hero Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4"
          >
            <div className="w-full aspect-[3/4] overflow-hidden border-2 border-foreground relative bg-muted">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  fill
                  alt={profile.full_name ?? 'Profile photo'}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Plus className="w-6 h-6 text-muted-foreground/30" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/30">
                    No photo yet
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs tracking-wide uppercase text-muted-foreground">
                {profile.instagram || '@instagram'}
              </span>
              <span className="text-xs tracking-wide text-muted-foreground">5.5k followers</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground mt-3">
              You control what the world sees. Nothing more.
            </p>
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <button className="bb-btn-primary mb-3">Save Contact</button>
            <div className="grid grid-cols-3 gap-2">
              {['WhatsApp', 'Enquire', 'Website'].map((label) => (
                <button
                  key={label}
                  className="py-2 text-xs tracking-wide uppercase font-medium border border-border text-foreground bg-transparent"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Portfolio — placeholder tiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6 mb-8"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className={i % 2 === 0 ? 'w-3/5' : 'w-1/2 ml-auto'}>
                <div className="overflow-hidden aspect-[3/4] mb-2 border border-dashed border-border relative bg-muted flex items-center justify-center">
                  <Plus className="w-5 h-5 text-muted-foreground/20" />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-medium tracking-tight text-foreground">{'Title'}</h3>
                  <span className="text-[10px] text-muted-foreground">{'Year'}</span>
                </div>
                <p className="text-[10px] tracking-wide text-muted-foreground">{'sub title'}</p>
              </div>
            ))}
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Contact exchange */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-xs tracking-wide uppercase text-center mb-4 text-muted-foreground">
              Let&apos;s stay in touch. Send your details
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                readOnly
                className="w-full bg-transparent px-3 py-2.5 text-xs tracking-wide border border-border text-foreground focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email or phone"
                readOnly
                className="w-full bg-transparent px-3 py-2.5 text-xs tracking-wide border border-border text-foreground focus:outline-none"
              />
              <button className="bb-btn-primary">Send</button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="max-w-md mx-auto"
          style={{ background: 'linear-gradient(to top, #F5F4F0 60%, transparent)' }}
        >
          <div className="px-6 pt-12 pb-8 flex flex-col items-center gap-3">
            <p className="text-[10px] tracking-wide text-muted-foreground/60">
              This is your first impression.
            </p>
            <button
              onClick={handlePublish}
              disabled={isPending}
              className="bb-btn-primary disabled:opacity-50"
            >
              {isPending ? 'Publishing…' : 'Activate My Blackbook'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
