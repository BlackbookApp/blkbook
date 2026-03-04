'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type ContactMethod = {
  label: string;
  /** Use for callback-based actions (Save Contact, Exchange Details) */
  onClick?: () => void;
  /** Use for link-based actions (Website, WhatsApp, Email). Renders as <a>. */
  href?: string;
  /** 'primary' → pg-btn-primary full-width. Default: 'secondary'. */
  variant?: 'primary' | 'secondary';
  /** 'half' groups into a 2-col grid with adjacent half items. Default: 'full'. */
  layout?: 'full' | 'half';
};

interface ContactBlockProps {
  methods: ContactMethod[];
}

type Group =
  | { type: 'single'; method: ContactMethod }
  | { type: 'pair'; methods: [ContactMethod, ContactMethod] };

function groupMethods(methods: ContactMethod[]): Group[] {
  const groups: Group[] = [];
  let i = 0;
  while (i < methods.length) {
    const m = methods[i];
    if (m.layout === 'half') {
      const next = methods[i + 1];
      if (next?.layout === 'half') {
        groups.push({ type: 'pair', methods: [m, next] });
        i += 2;
      } else {
        groups.push({ type: 'single', method: m });
        i++;
      }
    } else {
      groups.push({ type: 'single', method: m });
      i++;
    }
  }
  return groups;
}

const btnClass = (variant: ContactMethod['variant'], extra = '') =>
  variant === 'primary' ? `pg-btn-primary ${extra}`.trim() : `pg-btn-secondary ${extra}`.trim();

const MethodElement = ({ method, className }: { method: ContactMethod; className: string }) => {
  if (method.href) {
    return (
      <a href={method.href} target="_blank" rel="noopener noreferrer" className={className}>
        {method.label}
      </a>
    );
  }
  return (
    <button className={className} onClick={method.onClick}>
      {method.label}
    </button>
  );
};

export const ContactBlock = ({ methods }: ContactBlockProps) => {
  const groups = groupMethods(methods);
  return (
    <div className="mb-8 space-y-3">
      {groups.map((group, i) => {
        if (group.type === 'pair') {
          return (
            <div key={i} className="grid grid-cols-2 gap-2">
              {group.methods.map((m) => (
                <MethodElement
                  key={m.label}
                  method={m}
                  className={btnClass(m.variant, 'py-2 flex justify-center items-center')}
                />
              ))}
            </div>
          );
        }
        const m = group.method;
        return (
          <MethodElement
            key={m.label}
            method={m}
            className={btnClass(m.variant, m.variant === 'primary' ? '' : 'w-full py-4')}
          />
        );
      })}
    </div>
  );
};
