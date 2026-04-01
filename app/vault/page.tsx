'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import VaultSearchBar from '@/components/VaultSearchBar';
import { VaultContactList } from '@/components/vault/VaultContactList';
import { useVaultContacts } from '@/hooks/use-vault-contacts';
import AddContactDrawer from '@/components/AddContactDrawer';
import type { LinkedInPrefill } from '@/app/actions/linkedin';

export default function VaultPage() {
  const [search, setSearch] = useState('');
  const { data: contacts = [], isLoading } = useVaultContacts();
  const [linkedInPrefill, setLinkedInPrefill] = useState<LinkedInPrefill | null>(() => {
    const raw = localStorage.getItem('linkedin_prefill');
    if (!raw) return null;
    localStorage.removeItem('linkedin_prefill');
    try {
      return JSON.parse(raw) as LinkedInPrefill;
    } catch {
      return null;
    }
  });
  const [linkedInDrawerOpen, setLinkedInDrawerOpen] = useState(() => linkedInPrefill !== null);

  return (
    /* max-w-md mx-auto instead of blackbook-container — avoids min-h-screen (100vh) which
       exceeds 100svh in Safari browser (address bar), causing document-level scroll */
    <div className="max-w-md mx-auto bg-background flex flex-col border-box h-[100svh] overflow-hidden px-6 bb-safe-top-6">
      {/* Logo already has py-4 internally — no wrapper needed */}
      <Logo />

      <VaultSearchBar onSearchChange={setSearch} />

      <VaultContactList contacts={contacts} search={search} isLoading={isLoading} />

      <BottomNav />

      {linkedInPrefill && (
        <AddContactDrawer
          open={linkedInDrawerOpen}
          onOpenChange={(open) => {
            setLinkedInDrawerOpen(open);
            if (!open) setLinkedInPrefill(null);
          }}
          prefillData={linkedInPrefill}
        />
      )}
    </div>
  );
}
