'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';

const EASE = [0.22, 1, 0.36, 1] as const;

const helvetica = "'Helvetica Neue', 'Helvetica', Arial, sans-serif";
const granjon = "'Granjon LT', 'Granjon LT Std', 'Granjon', Georgia, serif";

const ink = '#1a1814';
const muted = '#5e5950';
const hairline = '#e6e1d6';
const bg = '#f2f1ed';
const card = '#fbfaf6';

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
      <div
        className="h-[100dvh] flex flex-col overflow-hidden"
        style={{ background: bg, color: ink }}
      >
        <header className="flex items-center px-6 md:px-10 pt-6 md:pt-8 shrink-0">
          <Logo />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <p
            className="text-center max-w-[260px]"
            style={{ fontFamily: helvetica, fontSize: '13px', color: muted }}
          >
            This invitation is invalid or has already been used.
          </p>
        </main>
        <footer className="flex items-center justify-between px-6 md:px-10 py-6 shrink-0">
          <span style={{ fontFamily: helvetica, fontWeight: 400, fontSize: '11px', color: muted }}>
            © 2026 HAIZEL
          </span>
          <span
            style={{
              fontFamily: helvetica,
              fontWeight: 400,
              fontSize: '11px',
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            By invitation
          </span>
        </footer>
      </div>
    );
  }

  const displayName = inviterName ?? 'Someone';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="px-8 sm:px-12 py-10 sm:py-14 rounded-[16px] text-center"
      style={{
        background: '#ffffff',
        border: `1px solid ${hairline}`,
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -40px rgba(26,24,20,0.18), 0 8px 20px -16px rgba(26,24,20,0.10)',
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-6 uppercase"
        style={{
          fontFamily: helvetica,
          fontWeight: 400,
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: muted,
        }}
      >
        {displayName} has invited you
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
        className="mb-4 leading-[1.15] font-granjon font-normal text-[clamp(1.7rem,4.4vw,2.15rem)] tracking-[-0.005em] text-bb-dark normal-case"
      >
        Welcome to <em>Haizel</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mb-8 leading-[1.65] mx-auto"
        style={{
          fontFamily: helvetica,
          fontSize: '15px',
          fontWeight: 400,
          color: muted,
          maxWidth: 320,
        }}
      >
        A private network for those who know that the right relationship changes everything.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <button
          onClick={handleAccept}
          className="group w-full py-[15px] text-[13px] rounded-[4px] transition-all hover:opacity-90"
          style={{
            fontFamily: helvetica,
            fontWeight: 400,
            background: ink,
            color: card,
            letterSpacing: '0.01em',
          }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            ACCEPT INVITATION
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ fontSize: '14px' }}
            >
              →
            </span>
          </span>
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.8 }}
        className="mt-5"
        style={{
          fontFamily: helvetica,
          fontSize: '11px',
          fontWeight: 400,
          color: muted,
          letterSpacing: '0.04em',
        }}
      >
        This invitation is personal and non-transferable.
      </motion.p>
    </motion.div>
  );

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: bg, color: ink }}
    >
      <header className="flex items-center px-6 md:px-10 pt-6 md:pt-8 shrink-0">
        <Logo />
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-6 flex items-center justify-center">
        <div className="w-full mx-auto" style={{ maxWidth: 500 }}>
          {cardContent}
        </div>
      </main>

      <footer className="flex items-center justify-between px-6 md:px-10 py-6 shrink-0">
        <span style={{ fontFamily: helvetica, fontWeight: 400, fontSize: '11px', color: muted }}>
          © 2026 HAIZEL
        </span>
        <span
          style={{
            fontFamily: helvetica,
            fontWeight: 400,
            fontSize: '11px',
            color: muted,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          By invitation
        </span>
      </footer>
    </div>
  );
};

export default InviteClient;
