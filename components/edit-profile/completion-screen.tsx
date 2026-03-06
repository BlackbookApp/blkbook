'use client';

import { motion } from 'framer-motion';

export const CompletionScreen = ({ onDone }: { onDone: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="flex-1 flex flex-col items-center justify-center px-6"
  >
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="w-48 h-64 border border-border bg-card mb-8 shadow-lg"
    >
      <div className="w-full h-3/4 bg-muted" />
      <div className="p-3 space-y-1">
        <div className="w-16 h-[2px] bg-foreground/30" />
        <div className="w-12 h-[1px] bg-foreground/15" />
      </div>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="font-playfair italic text-sm text-muted-foreground mb-12"
    >
      This is how the world meets you.
    </motion.p>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.5 }}
      onClick={onDone}
      className="font-garamond w-full max-w-[280px] h-[52px] bg-foreground text-background uppercase tracking-[0.01em] text-[13px] font-medium hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
    >
      Back to my Blackbook
    </motion.button>
  </motion.div>
);
