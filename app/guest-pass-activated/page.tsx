'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

const GuestPassActivated = () => {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative">
      {/* Logo */}
      <div className="px-8 pt-8">
        <Logo />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 -mt-12">
        <div className="max-w-xs w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-xl tracking-tight uppercase text-foreground mb-5">Be our guest.</h1>

            <p className="text-sm font-normal text-foreground/60 leading-relaxed mb-8">
              You have 14 days of full access to Blackbook. Your profile is live. Your vault is
              ready. At the end of 14 days you&apos;ll be invited to become a member.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={() => router.push('/walkthrough')}
              className="w-full h-[52px] bg-foreground text-background uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.25)] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
            >
              Explore My Blackbook
            </button>

            <p className="text-[10px] text-muted-foreground font-normal">
              14 days remaining on your guest access.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuestPassActivated;
