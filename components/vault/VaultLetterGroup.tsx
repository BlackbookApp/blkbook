import type { VaultContact } from '@/lib/data/vault-contacts';
import { VaultContactRow } from './VaultContactRow';

interface VaultLetterGroupProps {
  letter: string;
  contacts: VaultContact[];
}

export function VaultLetterGroup({ letter, contacts }: VaultLetterGroupProps) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-3">
        <span className="font-granjon italic text-[15px] text-bb-dark/70">{letter}</span>
        <div className="flex-1 h-px bg-bb-rule" />
      </div>
      <div>
        {contacts.map((contact, index) => (
          <VaultContactRow key={contact.id} contact={contact} showDivider={index > 0} />
        ))}
      </div>
    </div>
  );
}
