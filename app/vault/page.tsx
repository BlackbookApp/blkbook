'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TabType } from '@/types/blackbook';
import BottomNavAlt from '@/components/BottomNavAlt';
import Logo from '@/components/Logo';
import VaultAltSearchBar from '@/components/VaultAltSearchBar';
import { demoContacts, groupContactsByLetter, filterContacts } from '@/lib/demo-data/contacts';
import { routes } from '@/lib/routes';
const VaultAlt = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab] = useState<TabType>('all');

  const filteredContacts = filterContacts(demoContacts, search, activeTab);
  const groupedContacts = groupContactsByLetter(filteredContacts);
  const letters = Object.keys(groupedContacts).sort();

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6">
        {/* Logo */}
        <div className="py-4">
          <Logo />
        </div>

        <VaultAltSearchBar onSearchChange={setSearch} />

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto pb-28">
          {letters.map((letter) => (
            <div key={letter} className="mb-7">
              {/* Letter Separator */}
              <div className="mb-3 flex items-center gap-3">
                <span className="font-display font-normal text-[16px] text-bb-dark">{letter}</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              {/* Contacts */}
              <div>
                {groupedContacts[letter].map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => router.push(routes.contact(contact.id))}
                    className="w-full text-left group"
                  >
                    {index > 0 && <div className="h-px bg-border/40 mx-0" />}
                    <div className="py-3.5">
                      {/* Name + City row */}
                      <div>
                        <h2 className="font-display font-light text-[19px] tracking-[0.01em] text-bb-dark group-hover:opacity-50 transition-opacity uppercase">
                          {contact.name}
                        </h2>
                      </div>

                      {/* Role + City */}
                      <p className="font-helvetica font-light text-[13px] mt-0.5 normal-case tracking-[0.01em] text-bb-dark">
                        {contact.role}
                        {contact.city && (
                          <>
                            {'. '}
                            <span className="uppercase">{contact.city}.</span>
                          </>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {letters.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-muted-foreground">No contacts found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavAlt />
    </div>
  );
};

export default VaultAlt;
