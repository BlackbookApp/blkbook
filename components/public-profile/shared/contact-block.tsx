'use client';

import { Button } from '@/components/ui/button';

const PRIMARY_BTN =
  'h-[48px] border-box rounded-none w-full py-4 font-helvetica font-normal text-[11px] tracking-[0.14em] bg-[var(--pg-btn-bg)] text-[var(--pg-btn-fg)] border-none hover:opacity-80 hover:bg-[var(--pg-btn-bg)]';

const SECONDARY_BTN =
  ' h-[48px] border-box rounded-none w-full py-3 font-helvetica font-normal text-[11px] tracking-[0.1em] bg-transparent text-[var(--pg-btn-sec-fg)] border-[var(--pg-btn-sec-border)] hover:bg-transparent hover:opacity-70';

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

const MethodButton = ({ method }: { method: ContactMethod }) => {
  const isPrimary = method.variant === 'primary';
  const btnClass = isPrimary ? PRIMARY_BTN : SECONDARY_BTN;

  if (method.href) {
    return (
      <Button asChild variant={isPrimary ? 'default' : 'outline'} className={btnClass}>
        <a href={method.href} target="_blank" rel="noopener noreferrer">
          {method.label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={isPrimary ? 'default' : 'outline'}
      className={btnClass}
      onClick={method.onClick}
    >
      {method.label}
    </Button>
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
                <MethodButton key={m.label} method={m} />
              ))}
            </div>
          );
        }
        return <MethodButton key={group.method.label} method={group.method} />;
      })}
    </div>
  );
};
