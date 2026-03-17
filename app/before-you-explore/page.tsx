'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';

const BeforeYouExplore = () => {
  const router = useRouter();

  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground flex flex-col relative">
      {/* Logo */}
      <div className="px-8 pt-8">
        <Logo />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 -mt-6">
        <div className="max-w-xs w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-granjon text-xl tracking-[0.06em] uppercase text-foreground mb-5">
              Almost there.
            </h1>

            <p className="font-helvetica text-[11px] font-normal text-bb-muted leading-relaxed mb-2">
              Your profile is how the world meets you.
            </p>
            <p className="font-helvetica text-[11px] font-normal text-bb-muted leading-relaxed mb-8">
              Two minutes. Make it count.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={() => router.push('/my-blackbook')}
              className="w-full h-[52px] bg-foreground text-background uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.25)] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
            >
              Complete my profile
            </button>

            <p className="font-helvetica text-[10px] text-bb-muted font-normal">
              <button
                onClick={() => router.push(routes.vault)}
                className="hover:text-foreground/50 transition-colors"
              >
                I&apos;ll do this later
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BeforeYouExplore;
