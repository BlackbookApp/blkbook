'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import VaultSearchBar from '@/components/VaultSearchBar';
import { VaultContactList } from '@/components/vault/VaultContactList';
import { useVaultContacts } from '@/hooks/use-vault-contacts';

export default function VaultPage() {
  const [search, setSearch] = useState('');
  const { data: contacts = [], isLoading } = useVaultContacts();

  return (
    /* max-w-md mx-auto instead of blackbook-container — avoids min-h-screen (100vh) which
       exceeds 100svh in Safari browser (address bar), causing document-level scroll */
    <div className="max-w-md mx-auto bg-background flex flex-col border-box h-[100svh] overflow-hidden px-6 bb-safe-top-6">
      {/* Logo already has py-4 internally — no wrapper needed */}
      <Logo />

      <VaultSearchBar onSearchChange={setSearch} />

      <VaultContactList contacts={contacts} search={search} isLoading={isLoading} />

      <BottomNav />
    </div>
  );
}
