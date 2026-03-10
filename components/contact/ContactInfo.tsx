import type { VaultContact } from '@/lib/data/vault-contacts';

interface ContactInfoProps {
  contact: VaultContact;
}

export function ContactInfo({ contact }: ContactInfoProps) {
  const fields = [
    { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` },
    { label: 'Website', value: contact.website, href: contact.website ?? '', external: true },
    {
      label: 'Instagram',
      value: contact.instagram,
      href: `https://instagram.com/${contact.instagram?.replace('@', '')}`,
      external: true,
    },
  ].filter((f) => !!f.value);

  if (fields.length === 0) return null;

  return (
    <div className="space-y-0 mb-6">
      {fields.map(({ label, value, href, external }) => (
        <a
          key={label}
          href={href}
          className="block py-4 border-b border-border"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <p className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] mb-1.5 text-bb-muted">
            {label}
          </p>
          <p className="font-garamond text-[14px] italic font-normal tracking-tight text-bb-dark">
            {value}
          </p>
        </a>
      ))}
    </div>
  );
}
