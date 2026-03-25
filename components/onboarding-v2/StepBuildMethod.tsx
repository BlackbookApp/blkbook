'use client';

import { Sparkles, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/config/roleSchemas';
import type { BuildMethod } from './types';
import { ROLE_LABELS } from './types';

interface Props {
  roleType: RoleType;
  value: BuildMethod | null;
  onChange: (method: BuildMethod) => void;
}

interface MethodOption {
  key: BuildMethod;
  icon: React.ReactNode;
  title: (role: string) => string;
  description: string;
}

const OPTIONS: MethodOption[] = [
  {
    key: 'ai',
    icon: <Sparkles className="w-4 h-4" />,
    title: (role) => `Craft my ${role} profile for me`,
    description:
      "Share a link, upload a screenshot, or paste text — we'll extract the content and build your profile.",
  },
  {
    key: 'manual',
    icon: <PenLine className="w-4 h-4" />,
    title: () => 'Build it myself',
    description: 'Start from an empty profile and fill in each section at your own pace.',
  },
];

export function StepBuildMethod({ roleType, value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((opt) => {
        const selected = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={cn(
              'w-full text-left p-5 transition-all border-[1.5px]',
              selected ? 'border-foreground bg-background' : 'border-bb-rule bg-transparent'
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'mt-0.5 flex-shrink-0',
                  selected ? 'text-foreground' : 'text-bb-muted'
                )}
              >
                {opt.icon}
              </div>
              <div className="space-y-1.5">
                <p
                  className={cn(
                    'font-helvetica text-[11px] tracking-[0.04em] text-foreground',
                    selected ? 'font-medium' : 'font-light'
                  )}
                >
                  {opt.title(ROLE_LABELS[roleType])}
                </p>
                <p className="font-helvetica text-[10px] font-light leading-relaxed text-bb-muted">
                  {opt.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
