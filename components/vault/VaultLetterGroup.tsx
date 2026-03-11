import type { VaultContact } from '@/lib/data/vault-contacts';
import { VaultContactRow } from './VaultContactRow';

interface VaultLetterGroupProps {
  letter: string;
  contacts: VaultContact[];
}

export function VaultLetterGroup({ letter, contacts }: VaultLetterGroupProps) {
  return (
    <div className="mb-5">
      <div className="mb-2">
        <span className="text-[12px] font-light uppercase text-bb-muted">{letter}</span>
      </div>
      <div className="h-px bg-border" />
      <div>
        {contacts.map((contact, index) => (
          <VaultContactRow key={contact.id} contact={contact} showDivider={index > 0} />
        ))}
      </div>
    </div>
  );
}
