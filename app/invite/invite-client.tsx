'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';

interface Props {
  inviteCode: string | null;
  inviterName: string | null;
}

const InviteClient = ({ inviteCode, inviterName }: Props) => {
  const router = useRouter();

  const handleAccept = () => {
    if (inviteCode) {
      router.push(`${routes.signup}?ref=${encodeURIComponent(inviteCode)}`);
    }
  };

  if (!inviteCode) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex flex-col items-center justify-center px-6">
        <Logo />
        <div className="mt-12 text-center max-w-[260px]">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This invitation is invalid or has already been used.
          </p>
        </div>
      </div>
    );
  }

  const displayName = inviterName ?? 'Someone';

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pt-6"
      >
        <Logo />
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            {displayName} has invited you
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-xl tracking-tight text-foreground mb-4 leading-tight uppercase"
          >
            Welcome to Blackbook.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-xs font-light text-foreground/50 leading-relaxed max-w-[260px] mx-auto mb-8"
          >
            A private network for those who know that the right relationship changes everything.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <button
              onClick={handleAccept}
              className="font-helvetica font-normal text-[11px] w-full max-w-[280px] mx-auto block bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
            >
              Accept Invitation
            </button>
          </motion.div>

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

      <div className="h-12" />
    </div>
  );
};

export default InviteClient;
