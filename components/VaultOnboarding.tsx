'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TourStep {
  target: string;
  title: string;
  body: string;
  position: 'top' | 'bottom';
}

const steps: TourStep[] = [
  {
    target: 'nav-vault',
    title: 'Your vault',
    body: 'Everyone you meet, in one place. Start adding connections with context, notes, and details only you can see.',
    position: 'top',
  },
  {
    target: 'search',
    title: 'Search anything',
    body: 'Find people by name, role, city, or the moment you met them.',
    position: 'bottom',
  },
  {
    target: 'nav-add',
    title: 'Add someone',
    body: 'Just met someone worth remembering? Add them manually or scan a QR code to easily save to your vault.',
    position: 'top',
  },
  {
    target: 'nav-inbox',
    title: 'Your inbox',
    body: "Connection requests from people you've connected with will appear here.",
    position: 'top',
  },
  {
    target: 'nav-profile',
    title: 'Your profile',
    body: "This is what people see when they find you. Keep it sharp, check who's viewed it, and share your link.",
    position: 'top',
  },
];

const VaultOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0);

  const step = steps[current];
  const isLast = current === steps.length - 1;

  // Callback ref fired when the tooltip node mounts. Positions it and its arrow
  // directly via DOM style mutation — no setState, no cascading renders.
  const tooltipRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const target = document.querySelector(`[data-tour="${step.target}"]`);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const padding = 12;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const arrowLeft = `${Math.min(Math.max(rect.left + rect.width / 2 - 6 - 24, 0), vw - 48 - 12)}px`;
      const arrow = node.querySelector('[data-arrow]') as HTMLElement | null;

      if (step.position === 'bottom') {
        Object.assign(node.style, {
          position: 'fixed',
          top: `${Math.min(rect.bottom + padding, vh - 260)}px`,
          left: '24px',
          right: '24px',
          zIndex: '100',
        });
        if (arrow) {
          Object.assign(arrow.style, {
            position: 'absolute',
            top: '-6px',
            left: arrowLeft,
            width: '12px',
            height: '6px',
            display: 'block',
          });
        }
      } else {
        Object.assign(node.style, {
          position: 'fixed',
          bottom: `${vh - rect.top + padding}px`,
          left: '24px',
          right: '24px',
          zIndex: '100',
        });
        if (arrow) {
          Object.assign(arrow.style, {
            position: 'absolute',
            bottom: '-6px',
            left: arrowLeft,
            width: '12px',
            height: '6px',
            display: 'block',
          });
        }
      }
    },
    [step]
  );

  // Raise target element above the backdrop.
  // Nav items live inside the fixed <nav z-40> — raise the nav itself.
  // Other elements (search) need position:relative to respond to z-index.
  useEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null;
    if (!el) return;

    const nav = el.closest('nav') as HTMLElement | null;
    const toRaise = nav ?? el;
    const prevZIndex = toRaise.style.zIndex;
    const prevPosition = el.style.position;

    toRaise.style.zIndex = '60';
    if (!nav) el.style.position = 'relative';

    return () => {
      toRaise.style.zIndex = prevZIndex;
      if (!nav) el.style.position = prevPosition;
    };
  }, [current, step]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Backdrop — z-50, sits above normal UI (z-40 nav) but below raised elements (z-60) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
        onClick={onComplete}
      />

      {/* Tooltip — positioned via callback ref on mount, always on top */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          ref={tooltipRef}
          initial={{ opacity: 0, y: step.position === 'bottom' ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: step.position === 'bottom' ? -8 : 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="relative bg-bb-cream border border-black/[0.06] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12),_0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            {/* Arrow — positioned via callback ref, hidden by default */}
            <div data-arrow style={{ display: 'none' }}>
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                {step.position === 'bottom' ? (
                  <path d="M6 0L12 6H0L6 0Z" fill="#FAFAF8" />
                ) : (
                  <path d="M6 6L0 0H12L6 6Z" fill="#FAFAF8" />
                )}
              </svg>
            </div>

            <div className="px-5 py-5">
              <p className="font-helvetica uppercase mb-3 text-[9px] tracking-[0.2em] text-bb-dark font-normal">
                {current + 1} of {steps.length}
              </p>

              <h3 className="font-granjon uppercase mb-2 text-[15px] font-normal tracking-[0.02em] text-bb-dark">
                {step.title}
              </h3>

              <p className="font-helvetica leading-relaxed mb-5 text-[12px] font-light text-bb-dark">
                {step.body}
              </p>

              <div className="flex items-center justify-between">
                <Button
                  variant="blackbook-ghost"
                  onClick={onComplete}
                  className="text-bb-dark hover:text-foreground/50 text-[10px] tracking-[0.15em] h-auto p-0"
                >
                  Skip
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-bb-dark text-bb-cream text-[10px] tracking-[0.12em] py-[10px] px-6 h-auto"
                >
                  {isLast ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default VaultOnboarding;
