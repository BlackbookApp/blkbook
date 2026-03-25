'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Inbox } from '@/components/my-blackbook/inbox';
import { useExchanges } from '@/hooks/use-exchanges';

export default function InboxPage() {
  const { data: exchanges = [] } = useExchanges();
  const pendingCount = exchanges.filter((e) => e.status === 'pending').length;

  return (
    <div className="max-w-md mx-auto bg-background flex flex-col h-[100svh] overflow-hidden px-6 bb-safe-top-6">
      <Logo />

      <motion.div
        className="mt-10 mb-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex items-baseline justify-between">
          <h1 className="font-granjon font-light text-[17px] tracking-[0.01em] uppercase text-bb-dark">
            Inbox
          </h1>
          {pendingCount > 0 && (
            <span className="font-helvetica text-[11px] uppercase tracking-[0.08em] text-bb-muted/70">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="h-px w-full bg-bb-rule mt-4" />
      </motion.div>

      <Inbox />

      <BottomNav />
    </div>
  );
}
