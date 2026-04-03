'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import VaultSearchBar from '@/components/VaultSearchBar';
import { VaultContactList } from '@/components/vault/VaultContactList';
import { useVaultContacts } from '@/hooks/use-vault-contacts';
import { useProfile } from '@/hooks/use-profile';
import { useQueryClient } from '@tanstack/react-query';
import AddContactDrawer from '@/components/AddContactDrawer';
import VaultOnboarding from '@/components/VaultOnboarding';
import { markTourSeenAction } from '@/app/actions/profiles';
import type { LinkedInPrefill } from '@/app/actions/linkedin';

export default function VaultPage() {
  const [search, setSearch] = useState('');
  const { data: contacts = [], isLoading } = useVaultContacts();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const [tourDismissed, setTourDismissed] = useState(false);
  const showTour = !tourDismissed && !!profile && !profile.has_seen_tour;
  const [linkedInPrefill, setLinkedInPrefill] = useState<LinkedInPrefill | null>(() => {
    if (typeof window === 'undefined') return null;
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

      {showTour && (
        <VaultOnboarding
          onComplete={async () => {
            setTourDismissed(true);
            await markTourSeenAction();
            queryClient.invalidateQueries({ queryKey: ['profile'] });
          }}
        />
      )}

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
