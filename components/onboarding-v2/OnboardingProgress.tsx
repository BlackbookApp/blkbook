'use client';

import { motion } from 'framer-motion';

interface Props {
  step: number;
  total: number;
}

export function OnboardingProgress({ step, total }: Props) {
  const percent = (step / total) * 100;

  return (
    <div className="px-6 mt-2">
      <div className="flex justify-center mb-3">
        <span className="font-helvetica text-[10px] tracking-[0.2em] text-bb-muted/40 font-light uppercase">
          Step {step} of {total}
        </span>
      </div>
      <div className="w-full h-[1px] bg-bb-rule/50 overflow-hidden">
        <motion.div
          className="h-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
