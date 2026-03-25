'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  step: number;
  total: number;
}

export function OnboardingProgress({ step, total }: Props) {
  return (
    <div className="w-full flex items-center justify-center gap-0 py-6">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const completed = stepNum < step;
        const active = stepNum === step;

        return (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                'w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all',
                'font-helvetica text-[9px] font-normal border-[1.5px] leading-none',
                completed || active
                  ? 'border-bb-dark bg-bb-dark text-white'
                  : 'border-bb-rule text-bb-muted/60 bg-transparent'
              )}
            >
              {completed ? <Check className="w-3 h-3" /> : stepNum}
            </div>
            {i < total - 1 && (
              <div className={cn('w-8 h-px', completed ? 'bg-bb-dark' : 'bg-bb-rule')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
