'use client';

import { useState, useMemo } from 'react';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import VaultSearchBar from '@/components/VaultSearchBar';
import { VaultContactList } from '@/components/vault/VaultContactList';
import { useVaultContacts } from '@/hooks/use-vault-contacts';
import type { VaultContact } from '@/lib/data/vault-contacts';

function toRecentContacts(contacts: VaultContact[]) {
  return [...contacts]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 3)
    .map((c) => ({
      name: c.name,
      detail: [c.role, c.city].filter(Boolean).join(' — '),
    }));
}

export default function VaultPage() {
  const [search, setSearch] = useState('');
  const { data: contacts = [], isLoading } = useVaultContacts();

  const recentContacts = useMemo(() => toRecentContacts(contacts), [contacts]);

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6">
        <div className="py-4">
          <Logo />
        </div>

        <VaultSearchBar onSearchChange={setSearch} recentContacts={recentContacts} />

        <VaultContactList contacts={contacts} search={search} isLoading={isLoading} />
      </div>

      <BottomNav />
    </div>
  );
}
