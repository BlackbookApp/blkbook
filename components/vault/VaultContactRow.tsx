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
      {showDivider && <div className="h-px bg-bb-rule opacity-60" />}
      <div className="py-4 transition-opacity group-hover:opacity-60">
        <span className="block font-granjon font-normal text-[16px] tracking-[0.005em] text-foreground">
          {contact.name}
        </span>
        <p className="font-helvetica font-normal text-[11px] tracking-[0.06em] uppercase mt-1">
          {contact.role}
          {contact.city && <> · {contact.city}</>}
        </p>
      </div>
    </button>
  );
}
