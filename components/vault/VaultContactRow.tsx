'use client';

import { useRouter } from 'next/navigation';
import type { VaultContact } from '@/lib/data/vault-contacts';
import { routes } from '@/lib/routes';

interface VaultContactRowProps {
  contact: VaultContact;
  showDivider: boolean;
}

export function VaultContactRow({ contact, showDivider }: VaultContactRowProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(routes.contact(contact.id))}
      className="w-full text-left group"
    >
      {showDivider && <div className="h-px bg-border" />}
      <div className="py-3">
        <h2 className="font-display font-normal text-[16px] tracking-[0.01em] uppercase text-foreground mb-0.5 group-hover:opacity-60 transition-opacity">
          {contact.name}
        </h2>
        <p className="font-helvetica font-normal text-[10px] tracking-[0.08em] text-bb-muted uppercase">
          {contact.role}
          {contact.city && <> · {contact.city}</>}
        </p>
      </div>
    </button>
  );
}
