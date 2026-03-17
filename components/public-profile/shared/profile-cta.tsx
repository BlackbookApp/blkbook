'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useIsInVault, useCreateVaultContact } from '@/hooks/use-vault-contacts';
import { useHasExchanged } from '@/hooks/use-exchanges';
import { useQueryClient } from '@tanstack/react-query';
import ExchangeDetailsModal from '@/components/ExchangeDetailsModal';
import ExchangeAuthModal from './exchange-auth-modal';
import { ShareProfileModal } from '@/components/share-profile-modal';
import { routes } from '@/lib/routes';
import type { SocialLinks } from '@/lib/data/profiles';

const PRIMARY_BTN =
  'h-[48px] border-box rounded-none w-full py-4 font-helvetica font-normal text-[11px] tracking-[0.14em] bg-[var(--pg-btn-bg)] text-[var(--pg-btn-fg)] border-none hover:opacity-80 hover:bg-[var(--pg-btn-bg)]';

const SECONDARY_BTN =
  'h-[48px] border-box rounded-none w-full py-3 font-helvetica font-normal text-[11px] tracking-[0.1em] bg-transparent text-[var(--pg-btn-sec-fg)] border-[var(--pg-btn-sec-border)] hover:bg-transparent hover:opacity-70';

const COMPACT_BTN =
  'rounded-none py-2.5 font-helvetica font-normal text-[10px] tracking-[0.14em] bg-transparent text-[var(--pg-btn-sec-fg)] border-[var(--pg-btn-sec-border)] hover:bg-transparent hover:opacity-70';

const TEXT_BTN =
  'rounded-none font-granjon font-normal text-[14px] tracking-[0.01em] uppercase bg-transparent border-none text-[var(--pg-fg)] hover:opacity-50 p-0 h-auto shadow-none';

export interface ProfileCTAProps {
  profileId: string;
  profileOwnerId: string;
  profileFirstName: string;
  profileUsername: string;
  profileName: string;
  profileRole?: string | null;
  profilePhotoUrl?: string | null;
  socialLinks: SocialLinks;
  /** Renders a 2-column grid of outline buttons (used under the hero photo) */
  compact?: boolean;
  /** Renders text-only inline buttons (used directly under the hero, visual style) */
  textOnly?: boolean;
}

export function ProfileCTA({
  profileId,
  profileOwnerId,
  profileFirstName,
  profileUsername,
  profileName,
  profileRole,
  profilePhotoUrl,
  socialLinks,
  compact = false,
  textOnly = false,
}: ProfileCTAProps) {
  const { data: user, isLoading: userLoading } = useUser();
  const isAuthed = !!user;
  const isOwner = isAuthed && user.id === profileOwnerId;

  const { data: inVault } = useIsInVault(profileId);
  // Only fetch for non-owner authed users; enabled guard in the hook handles the rest
  const { data: hasExchanged } = useHasExchanged(isAuthed && !isOwner ? profileId : '');
  const { mutateAsync: saveToVault, isPending: addingToVault } = useCreateVaultContact();
  const queryClient = useQueryClient();

  const [showExchange, setShowExchange] = useState(false);
  const [showAuthExchange, setShowAuthExchange] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleAddToVault = async () => {
    if (inVault) return;
    await saveToVault(
      {
        name: profileName,
        role: profileRole ?? null,
        photo_url: profilePhotoUrl ?? null,
        profile_id: profileId,
        city: null,
        email: socialLinks.email ?? null,
        phone: socialLinks.phone ?? null,
        instagram: socialLinks.instagram ?? null,
        website: socialLinks.website ?? null,
        notes: null,
      },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vault-in', profileId] }),
      }
    );
  };

  if (userLoading) return null;

  // Social link buttons — only shown in the full-width (non-compact, non-textOnly) block
  const socialButtons =
    !compact && !textOnly ? (
      <>
        {(socialLinks.website || socialLinks.whatsapp) &&
          (() => {
            const items = [
              socialLinks.website && { label: 'WEBSITE', href: socialLinks.website },
              socialLinks.whatsapp && {
                label: 'WHATSAPP',
                href: `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`,
              },
            ].filter(Boolean) as { label: string; href: string }[];

            // Render pairs of 2 in a grid, last one full-width if odd
            const rows: React.ReactNode[] = [];
            for (let i = 0; i < items.length; i += 2) {
              const pair = items.slice(i, i + 2);
              if (pair.length === 2) {
                rows.push(
                  <div key={i} className="grid grid-cols-2 gap-2">
                    {pair.map((item) => (
                      <Button key={item.label} asChild variant="outline" className={SECONDARY_BTN}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          {item.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                );
              } else {
                rows.push(
                  <Button key={pair[0].label} asChild variant="outline" className={SECONDARY_BTN}>
                    <a href={pair[0].href} target="_blank" rel="noopener noreferrer">
                      {pair[0].label}
                    </a>
                  </Button>
                );
              }
            }
            return <>{rows}</>;
          })()}
      </>
    ) : null;

  const wrap = (buttons: React.ReactNode, modals?: React.ReactNode) => (
    <>
      {textOnly ? (
        <div className="flex justify-between mt-2 mb-20">{buttons}</div>
      ) : compact ? (
        <div className="px-2 mt-6 mb-20">
          <div className="grid grid-cols-2 gap-3">{buttons}</div>
        </div>
      ) : (
        <div className="mb-8 space-y-3">{buttons}</div>
      )}
      {modals}
    </>
  );

  const btn = textOnly ? TEXT_BTN : compact ? COMPACT_BTN : PRIMARY_BTN;
  const secBtn = textOnly ? TEXT_BTN : compact ? COMPACT_BTN : SECONDARY_BTN;

  // Owner CTAs
  if (isOwner) {
    return wrap(
      <>
        <Button variant="outline" className={btn} onClick={() => setShowShare(true)}>
          Share Profile
        </Button>
        {socialButtons}
        <Button asChild variant="outline" className={secBtn}>
          <Link href={routes.editProfile}>Edit Profile</Link>
        </Button>
      </>,
      <ShareProfileModal
        open={showShare}
        onClose={() => setShowShare(false)}
        username={profileUsername}
      />
    );
  }

  // Member CTAs
  if (isAuthed) {
    return wrap(
      <>
        <Button
          variant="outline"
          className={btn}
          onClick={handleAddToVault}
          disabled={addingToVault || inVault}
        >
          {inVault ? 'In Vault' : addingToVault ? 'Saving…' : 'Add to Vault'}
        </Button>
        {socialButtons}
        <Button
          variant="outline"
          className={secBtn}
          onClick={() => !hasExchanged && setShowAuthExchange(true)}
          disabled={hasExchanged}
        >
          {hasExchanged ? 'Exchanged' : 'Exchange Details'}
        </Button>
      </>,
      <ExchangeAuthModal
        open={showAuthExchange}
        onClose={() => setShowAuthExchange(false)}
        profileId={profileId}
        profileFirstName={profileFirstName}
        profileName={profileName}
        profileRole={profileRole}
        profilePhotoUrl={profilePhotoUrl}
        socialLinks={socialLinks}
      />
    );
  }

  // Guest CTAs
  return wrap(
    <>
      <Button asChild variant="outline" className={btn}>
        <a href={routes.vcardDownload(profileUsername)}>Save Contact</a>
      </Button>
      {socialButtons}
      <Button variant="outline" className={secBtn} onClick={() => setShowExchange(true)}>
        Exchange Details
      </Button>
    </>,
    <ExchangeDetailsModal
      open={showExchange}
      onClose={() => setShowExchange(false)}
      firstName={profileFirstName}
      profileId={profileId}
    />
  );
}
