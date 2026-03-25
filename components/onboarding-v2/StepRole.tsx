'use client';

import { cn } from '@/lib/utils';
import type { RoleType } from '@/config/roleSchemas';
import { ROLE_LABELS } from './types';

interface Props {
  value: RoleType | null;
  onChange: (role: RoleType) => void;
}

export function StepRole({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(Object.keys(ROLE_LABELS) as RoleType[]).map((key) => {
        const selected = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'flex flex-col items-center gap-3 py-6 px-2 transition-all border-[1.5px]',
              selected ? 'border-foreground bg-background' : 'border-bb-rule bg-transparent'
            )}
          >
            <div
              className={cn(
                'w-4 h-4 rounded-full transition-all border-[1.5px]',
                selected ? 'border-transparent bg-foreground' : 'border-bb-rule bg-transparent'
              )}
            />
            <span
              className={cn(
                'uppercase font-helvetica text-center text-[9px] tracking-[0.2em]',
                selected ? 'font-medium text-foreground' : 'font-light text-bb-muted'
              )}
            >
              {ROLE_LABELS[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
