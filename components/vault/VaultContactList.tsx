import type { VaultContact } from '@/lib/data/vault-contacts';
import VaultEmptyState from '@/components/VaultEmptyState';
import { VaultSkeleton } from './VaultSkeleton';
import { VaultLetterGroup } from './VaultLetterGroup';

function filterContacts(contacts: VaultContact[], query: string): VaultContact[] {
  if (!query) return contacts;
  const q = query.toLowerCase();
  return contacts.filter((c) =>
    [c.name, c.role, c.city, c.notes].filter(Boolean).some((f) => f!.toLowerCase().includes(q))
  );
}

function groupByLetter(contacts: VaultContact[]): Record<string, VaultContact[]> {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  return sorted.reduce<Record<string, VaultContact[]>>((acc, c) => {
    const letter = c.name.charAt(0).toUpperCase();
    (acc[letter] ??= []).push(c);
    return acc;
  }, {});
}

interface VaultContactListProps {
  contacts: VaultContact[];
  search: string;
  isLoading: boolean;
}

export function VaultContactList({ contacts, search, isLoading }: VaultContactListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto pb-28">
        <VaultSkeleton />
      </div>
    );
  }

  if (!search && contacts.length === 0) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto pb-28">
        <VaultEmptyState />
      </div>
    );
  }

  const filtered = filterContacts(contacts, search);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto pb-28">
        <div className="text-center py-20">
          <p className="font-helvetica text-[11px] text-muted-foreground">No contacts found</p>
        </div>
      </div>
    );
  }

  const grouped = groupByLetter(filtered);
  const letters = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-28">
      {letters.map((letter) => (
        <VaultLetterGroup key={letter} letter={letter} contacts={grouped[letter]} />
      ))}
    </div>
  );
}
