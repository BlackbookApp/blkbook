'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import Logo from '@/components/Logo';
import VaultSearchBar from '@/components/VaultSearchBar';
import VaultEmptyState from '@/components/VaultEmptyState';
import AddContactDrawer from '@/components/AddContactDrawer';
import { groupContactsByLetter, filterContacts } from '@/lib/demo-data/contacts';
import { useVaultContacts } from '@/hooks/use-vault-contacts';
import type { VaultContact } from '@/lib/data/vault-contacts';
import { Text } from '@/components/ui/text';
import { routes } from '@/lib/routes';

type ContactLike = {
  id: string;
  name: string;
  role?: string | null;
  city?: string | null;
  notes?: string | null;
  type: 'person';
};

function toContactLike(c: VaultContact): ContactLike {
  return {
    id: c.id,
    name: c.name,
    role: c.role ?? undefined,
    city: c.city ?? undefined,
    notes: c.notes ?? undefined,
    type: 'person',
  };
}

const VaultAlt = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const { data: vaultContacts = [], isLoading } = useVaultContacts();

  const contacts = vaultContacts.map(toContactLike);
  const filteredContacts = filterContacts(
    contacts as Parameters<typeof filterContacts>[0],
    search,
    'all'
  );
  const groupedContacts = groupContactsByLetter(
    filteredContacts as Parameters<typeof groupContactsByLetter>[0]
  );
  const letters = Object.keys(groupedContacts).sort();

  const showEmpty = !isLoading && !search && contacts.length === 0;
  const showNoResults = !isLoading && search.length > 0 && filteredContacts.length === 0;

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6">
        <div className="py-4">
          <Logo />
        </div>

        <VaultSearchBar onSearchChange={setSearch} />

        <div className="flex flex-col flex-1 overflow-y-auto pb-28">
          {isLoading && (
            <div className="space-y-6 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-border/40 rounded animate-pulse" />
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="py-3.5 space-y-1.5">
                      <div className="h-4 bg-border/30 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-border/20 rounded w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {showEmpty && <VaultEmptyState onQuickAdd={() => setIsAddContactOpen(true)} />}

          {showNoResults && (
            <div className="text-center py-20">
              <Text variant="body-2" className="text-muted-foreground">
                No contacts found
              </Text>
            </div>
          )}

          {!isLoading &&
            !showEmpty &&
            !showNoResults &&
            letters.map((letter) => (
              <div key={letter} className="mb-7">
                <div className="mb-3 flex items-center gap-3">
                  <Text
                    as="span"
                    variant="inherit"
                    className="font-display font-normal text-[16px] text-bb-dark"
                  >
                    {letter}
                  </Text>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <div>
                  {groupedContacts[letter].map((contact, index) => (
                    <button
                      key={contact.id}
                      onClick={() => router.push(routes.contact(contact.id))}
                      className="w-full text-left group"
                    >
                      {index > 0 && <div className="h-px bg-border/40 mx-0" />}
                      <div className="py-3.5">
                        <Text
                          as="h2"
                          variant="inherit"
                          className="font-display font-light text-[19px] tracking-[0.01em] text-bb-dark group-hover:opacity-50 transition-opacity uppercase"
                        >
                          {contact.name}
                        </Text>
                        <Text
                          as="p"
                          variant="inherit"
                          className="font-helvetica font-light text-[13px] mt-0.5 normal-case tracking-[0.01em] text-bb-dark"
                        >
                          {contact.role}
                          {contact.city && (
                            <>
                              {'. '}
                              <span className="uppercase">{contact.city}.</span>
                            </>
                          )}
                        </Text>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <BottomNav onQuickAdd={() => setIsAddContactOpen(true)} />
      <AddContactDrawer open={isAddContactOpen} onOpenChange={setIsAddContactOpen} />
    </div>
  );
};

export default VaultAlt;
