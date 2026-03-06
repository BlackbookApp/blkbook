import type { Contact, TabType } from '@/types/blackbook';

export const demoContacts: Contact[] = [
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

export function groupContactsByLetter(contacts: Contact[]): Record<string, Contact[]> {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: Record<string, Contact[]> = {};
  sorted.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(contact);
  });
  return grouped;
}

export function filterContacts(contacts: Contact[], query: string, tab: TabType): Contact[] {
  return contacts.filter((contact) => {
    const q = query.toLowerCase();
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
    const matchesTab = tab === 'all' || contact.type === tab.slice(0, -1);
    return matchesSearch && matchesTab;
  });
}

export interface ContactNote {
  id: string;
  text: string;
  date: string;
}

export interface ContactDetailData {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  instagram: string;
  instagramFollowers: string;
  hasPhoto: boolean;
  addedDate: string;
  addedLocation: string;
  notes: ContactNote[];
}

export const defaultContactDetail: Omit<ContactDetailData, 'id'> = {
  name: 'James Chen',
  role: 'Photographer',
  email: 'james@studio.com',
  phone: '+1 (555) 987-6543',
  instagram: '@jameschen',
  instagramFollowers: '12.4K',
  hasPhoto: true,
  addedDate: 'Jan 10',
  addedLocation: 'New York',
  notes: [
    { id: '1', text: 'Met at the gallery opening in SoHo', date: 'Jan 15' },
    { id: '2', text: 'Interested in collaboration on editorial project', date: 'Jan 18' },
  ],
};

const contactDetailMap: Record<string, Partial<ContactDetailData>> = {
  '1': { hasPhoto: true },
  '2': { name: 'Sarah Miller', role: 'Brand Strategist', addedLocation: 'London', hasPhoto: false },
  '3': {
    name: 'Marcus Wright',
    role: 'Industrial Designer',
    addedLocation: 'Berlin',
    hasPhoto: false,
  },
  '4': { name: 'Elena Vance', role: 'Art Director', addedLocation: 'Paris', hasPhoto: false },
  '5': {
    name: 'Alexander Beaumont',
    role: 'Creative Director',
    addedLocation: 'Los Angeles',
    hasPhoto: false,
  },
  '6': { name: 'Charlotte Kim', role: 'Fashion Editor', addedLocation: 'Seoul', hasPhoto: false },
  '7': { name: 'David Okonkwo', role: 'Architect', addedLocation: 'Lagos', hasPhoto: false },
  '8': {
    name: 'Alessandro Tocchi',
    role: 'Event Planner',
    addedLocation: 'Milan',
    hasPhoto: false,
  },
  '9': {
    name: 'Camille Renard',
    role: 'Gallery Director',
    addedLocation: 'Paris',
    hasPhoto: false,
  },
};

export function getContactDetail(id: string): ContactDetailData {
  const overrides = contactDetailMap[id] ?? { hasPhoto: false };
  return { ...defaultContactDetail, id, ...overrides };
}
