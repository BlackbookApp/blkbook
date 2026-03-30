'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AboutSectionData {
  text: string | null;
}

export function AboutSection({ data }: { data: AboutSectionData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setExpanded((v) => !v)} className="flex items-center w-full gap-3">
        <span className="font-helvetica text-[10px] uppercase tracking-wide text-bb-muted shrink-0">
          About
        </span>
        <div className="flex-1 h-px bg-bb-rule" />
        <span className="font-helvetica font-light text-bb-muted text-[16px] leading-none">
          {expanded ? '−' : '+'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {data.text ? (
                data.text.split('\n\n').map((para, i) => (
                  <p
                    key={i}
                    className="font-granjon italic text-[14px] leading-[1.7] text-foreground/70 mb-3 last:mb-0"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="font-granjon italic text-[14px] leading-[1.7] text-foreground/40">
                  No content yet.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
