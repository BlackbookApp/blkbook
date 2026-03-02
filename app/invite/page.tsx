'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

const InvitationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviterName = searchParams.get('ref') || 'Someone';

  const handleAccept = () => {
    router.push(`/signup?ref=${encodeURIComponent(inviterName)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Top-left Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pt-6"
      >
        <Logo />
      </motion.div>

      {/* Centred content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Invited-by line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            {inviterName} has invited you
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl tracking-tight text-foreground mb-4 leading-tight uppercase"
            style={{ fontFamily: "'GT Super Display', 'Canela Deck', serif", fontWeight: 300 }}
          >
            Welcome to Blackbook.
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-xs font-light text-foreground/50 leading-relaxed max-w-[260px] mx-auto mb-8"
          >
            A private network for those who know that the right relationship changes everything.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <button
              onClick={handleAccept}
              className="w-full max-w-[280px] mx-auto block bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
              style={{
                fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
                fontWeight: 400,
                fontSize: '11px',
              }}
            >
              Accept Invitation
            </button>
          </motion.div>

          {/* Footnote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-[9px] text-muted-foreground mt-4 tracking-wide"
          >
            This invitation is personal and non-transferable.
          </motion.p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-12" />
    </div>
  );
};

const InvitationLanding = () => (
  <Suspense>
    <InvitationContent />
  </Suspense>
);

export default InvitationLanding;
