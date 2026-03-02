'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

const Paywall = () => {
  const router = useRouter();

  const memberFeatures = [
    'Everyone you meet, held privately. No limits.',
    "Find anyone, instantly. Even if you've forgotten the details.",
    'Bring in the people who belong here.',
    'Personalise your Blackbook link.',
    'Scan any business card directly into your vault.',
  ];

  const handleGuestPass = () => router.push('/guest-pass-activated');
  const handleJoinMember = () => router.push('/card-addon');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Logo */}
      <div className="px-8 pt-8">
        <Logo />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        <div className="max-w-sm w-full pt-5 flex flex-col flex-1">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-normal">
              Choose your access
            </p>
          </motion.div>

          {/* Founding Member — Dominant */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="p-5 border border-foreground/15 mb-5"
          >
            <div className="flex justify-between items-start mb-0">
              <div>
                <h3 className="text-base tracking-tight uppercase text-foreground">
                  Founding Member
                </h3>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground/60 mt-0.5">
                  Limited to the first 100
                </p>
              </div>
              <span
                className="text-base text-foreground uppercase"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                €199
              </span>
            </div>
            <div className="h-px bg-border my-3" />
            <p className="text-xs text-foreground/60 mb-1">
              Everything, permanently. One time payment.
            </p>
            <p className="text-[10px] text-muted-foreground mb-6">
              30-day guarantee. No questions asked.
            </p>

            <ul className="space-y-2 mb-5">
              {memberFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-xs text-foreground/70">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-foreground/50" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="h-px bg-border mb-4" />
            <p className="text-[11px] leading-relaxed text-muted-foreground mb-5">
              We don&apos;t sell data. We don&apos;t run ads. We&apos;re not that kind of company.
            </p>

            <button
              onClick={handleJoinMember}
              className="w-full h-[54px] bg-foreground text-background uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.25)] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
            >
              Become a Founding Member
            </button>
          </motion.div>

          {/* Guest Access — Secondary, minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center px-4"
          >
            <button
              onClick={handleGuestPass}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Continue as guest
            </button>
          </motion.div>

          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default Paywall;
