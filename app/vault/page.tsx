'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact, TabType } from '@/types/blackbook';
import BottomNavAlt from '@/components/BottomNavAlt';
import Logo from '@/components/Logo';
import VaultAltSearchBar from '@/components/VaultAltSearchBar';

// Same demo contacts as Vault
const demoContacts: Contact[] = [
  {
    id: '8',
    name: 'Alessandro Tocchi',
    role: 'Event Planner',
    city: 'Milan',
    context: 'Gallery opening, Via Tortona',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '1',
    name: 'James Chen',
    role: 'Photographer',
    city: 'New York',
    context: 'Met at Milan Design Week',
    notes: 'Interested in collaborating on editorial shoot',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Miller',
    role: 'Brand Strategist',
    city: 'London',
    context: 'Referred by Elena',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Marcus Wright',
    role: 'Industrial Designer',
    city: 'Berlin',
    context: 'Soho House, members bar',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Elena Vance',
    role: 'Art Director',
    city: 'Paris',
    context: 'Studio visit, March',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Alexander Beaumont',
    role: 'Creative Director',
    city: 'Los Angeles',
    context: 'Cannes Lions festival',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Charlotte Kim',
    role: 'Fashion Editor',
    city: 'Seoul',
    context: 'Copenhagen Fashion Week',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '9',
    name: 'Camille Renard',
    role: 'Gallery Director',
    city: 'Paris',
    context: 'Art Basel, gallery walk',
    notes: 'Runs a contemporary gallery in Le Marais',
    type: 'person',
    createdAt: new Date(),
  },
  {
    id: '7',
    name: 'David Okonkwo',
    role: 'Architect',
    city: 'Lagos',
    context: 'Milan Furniture Fair',
    type: 'person',
    createdAt: new Date(),
  },
];

const groupByLetter = (contacts: Contact[]) => {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: { [key: string]: Contact[] } = {};
  sorted.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(contact);
  });
  return grouped;
};

const VaultAlt = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab] = useState<TabType>('all');

  const filteredContacts = demoContacts.filter((contact) => {
    const q = search.toLowerCase();
    const searchableFields = [
      contact.name,
      contact.role,
      contact.city,
      contact.context,
      contact.notes,
    ]
      .filter(Boolean)
      .map((f) => f!.toLowerCase());
    const matchesSearch = !q || searchableFields.some((f) => f.includes(q));
    const matchesTab = activeTab === 'all' || contact.type === activeTab.slice(0, -1);
    return matchesSearch && matchesTab;
  });

  const groupedContacts = groupByLetter(filteredContacts);
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
                <span
                  style={{
                    fontFamily: "'GT Super Display', 'Canela Deck', serif",
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#0E0E0E',
                  }}
                >
                  {letter}
                </span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              {/* Contacts */}
              <div>
                {groupedContacts[letter].map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => router.push(`/contact/${contact.id}`)}
                    className="w-full text-left group"
                  >
                    {index > 0 && <div className="h-px bg-border/40 mx-0" />}
                    <div className="py-3.5">
                      {/* Name + City row */}
                      <div>
                        <h2
                          className="group-hover:opacity-50 transition-opacity uppercase"
                          style={{
                            fontFamily: "'GT Super Display', 'Canela Deck', serif",
                            fontWeight: 300,
                            fontSize: '19px',
                            letterSpacing: '0.01em',
                            color: '#0E0E0E',
                          }}
                        >
                          {contact.name}
                        </h2>
                      </div>

                      {/* Role + City */}
                      <p
                        className="text-[13px] mt-0.5 normal-case tracking-[0.01em] font-[300]"
                        style={{
                          fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
                          color: '#0E0E0E',
                        }}
                      >
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
