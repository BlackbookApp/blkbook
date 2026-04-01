'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, SquarePen, Share2, Settings, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { InviteSheet } from '@/components/invite-sheet';
import { ShareProfileModal } from '@/components/share-profile-modal';
import { useProfile } from '@/hooks/use-profile';
import { useInvite, INVITE_TOTAL } from '@/hooks/use-invite';
import { routes } from '@/lib/routes';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const MyBlackbook = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { invitesUsed } = useInvite();
  const [showShare, setShowShare] = useState(false);

  const actions = [
    {
      icon: Eye,
      label: 'View live profile',
      description: 'See exactly what others see',
      action: () =>
        profile?.username
          ? router.push(routes.publicProfile(profile.username))
          : router.push(routes.profilePreview),
      disabled: false,
    },
    {
      icon: SquarePen,
      label: 'Edit profile',
      description: 'Update your profile details',
      action: () => router.push(routes.editProfile),
      disabled: false,
    },
    {
      icon: Share2,
      label: 'Share profile',
      description: 'Copy link or share your card',
      action: () => setShowShare(true),
      disabled: !profile?.username,
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Account, notifications & preferences',
      action: () => router.push(routes.settings),
      disabled: false,
    },
  ];

  return (
    <div className="blackbook-container bg-white">
      <div className="blackbook-page !pb-44 bb-safe-top-6">
        <Logo />

        {/* Profile card */}
        <motion.div
          className="mt-10 mb-8 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-[140px] h-[170px] overflow-hidden mb-5 border border-bb-rule">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? 'Profile'}
                width={140}
                height={170}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bb-muted/20 flex items-center justify-center">
                <span className="font-granjon text-3xl text-bb-muted">
                  {getInitials(profile?.full_name ?? null)}
                </span>
              </div>
            )}
          </div>

          <h1 className="font-granjon text-[26px] leading-tight mb-2 text-bb-dark">
            {profile?.full_name ?? '—'}
          </h1>
          <p className="font-helvetica text-[11px] uppercase tracking-[0.1em] text-bb-muted mb-1.5">
            {[profile?.role, profile?.location].filter(Boolean).join(' · ')}
          </p>
          {profile?.username && (
            <button
              onClick={() => router.push(routes.publicProfile(profile.username!))}
              className="font-granjon text-[13px] italic text-bb-muted/60 hover:text-bb-dark transition-colors normal-case"
            >
              blkbook.me/p/{profile.username}
            </button>
          )}
        </motion.div>

        <div className="h-px w-full bg-bb-rule" />

        {/* Actions */}
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className="w-full flex items-center gap-4 py-5 group border-b border-border/30 disabled:opacity-40"
              >
                <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-full border border-bb-rule">
                  <Icon
                    className="w-[17px] h-[17px] text-bb-dark/70 group-hover:text-bb-dark transition-colors"
                    strokeWidth={1.4}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-granjon text-[15px] leading-tight mb-0.5 text-bb-dark">
                    {item.label}
                  </p>
                  <p className="font-helvetica text-[11px] font-light text-bb-muted">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-bb-muted/40" strokeWidth={1.2} />
              </button>
            );
          })}
        </motion.div>

        {/* Invitations */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-bb-muted shrink-0">
              Invitations
            </span>
            <div className="flex-1 h-px bg-bb-rule" />
          </div>

          <div className="p-6 border border-bb-rule">
            <p className="font-granjon text-[20px] leading-snug mb-1.5 italic text-bb-dark">
              Know someone who belongs?
            </p>
            <p className="font-helvetica text-[12px] font-light text-bb-muted mb-5">
              Invite people you&apos;d genuinely recommend.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: INVITE_TOTAL }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < invitesUsed ? 'bg-bb-dark' : 'border border-bb-rule'
                    }`}
                  />
                ))}
              </div>
              <p className="font-helvetica text-[11px] font-light text-bb-muted ml-1">
                {invitesUsed} of {INVITE_TOTAL} used
              </p>
            </div>

            <InviteSheet>
              <button className="w-full py-3.5 text-center font-helvetica text-[11px] uppercase tracking-[0.12em] font-medium border border-bb-rule text-bb-dark hover:bg-bb-cream/50 transition-colors">
                Send an Invitation
              </button>
            </InviteSheet>
          </div>
        </motion.div>
      </div>

      {profile?.username && (
        <ShareProfileModal
          open={showShare}
          onClose={() => setShowShare(false)}
          username={profile.username}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default MyBlackbook;
