import Image from 'next/image';
import type { VaultContact } from '@/lib/data/vault-contacts';

interface ContactBannerProps {
  contact: VaultContact;
}

export function ContactBanner({ contact }: ContactBannerProps) {
  if (contact.photo_url) {
    return (
      <>
        <div className="w-full aspect-[3/4] mb-6 overflow-hidden border-2 border-bb-dark">
          <Image src={contact.photo_url} alt={contact.name} fill className="object-cover" />
        </div>
        <div className="text-center mb-6">
          <h1 className="font-garamond font-normal text-xl tracking-[0.01em] uppercase leading-tight mb-1">
            {contact.name}
          </h1>
          <p className="font-helvetica text-[0.7rem] font-normal uppercase tracking-[0.08em] text-bb-dark">
            {contact.role}
            {contact.city && ` · ${contact.city}`}
          </p>
          {contact.instagram && (
            <p className="font-helvetica text-[10px] tracking-[0.02em] text-bb-muted mt-2">
              {contact.instagram}
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      className="w-full -mx-6 px-6 py-8 mb-6 relative overflow-hidden grain-overlay bg-bb-nav"
      style={{ width: 'calc(100% + 3rem)' }}
    >
      <h1 className="font-garamond font-normal text-xl tracking-[0.01em] uppercase leading-tight mb-1 text-background">
        {contact.name}
      </h1>
      <p className="font-helvetica text-[0.7rem] font-normal uppercase tracking-[0.08em] text-background/50">
        {contact.role}
        {contact.city && ` · ${contact.city}`}
      </p>
    </div>
  );
}
