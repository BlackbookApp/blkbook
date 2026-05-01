'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, SquarePen, Share2, Settings, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { ShareProfileModal } from '@/components/share-profile-modal';
import { useProfile } from '@/hooks/use-profile';
import { useInvite, INVITE_TOTAL } from '@/hooks/use-invite';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';

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

  const nameParts = profile?.full_name?.split(' ') ?? [];
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  const actions = [
    {
      icon: Eye,
      label: 'View live profile',
      description: 'See what others see',
      action: () =>
        profile?.username
          ? router.push(routes.publicProfile(profile.username))
          : router.push(routes.profilePreview),
      disabled: false,
    },
    {
      icon: SquarePen,
      label: 'Edit profile',
      description: 'Update your details',
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
      description: 'Account & preferences',
      action: () => router.push(routes.settings),
      disabled: false,
    },
  ];

  return (
    <div className="max-w-md mx-auto flex flex-col h-[100svh] overflow-hidden bb-safe-top-6 bg-[#f5f4f0]">
      <div className="flex items-center justify-between px-6">
        <Logo />
        <button
          onClick={() => router.push(routes.settings)}
          className="text-[11px] uppercase tracking-[0.08em] hover:opacity-60 transition-opacity"
        >
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Profile card */}
        <motion.div
          className="mb-9 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-[112px] h-[112px] rounded-full overflow-hidden mb-5 border border-[#e6e1d6]">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? 'Profile'}
                width={112}
                height={112}
                sizes="112px"
                priority
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bb-muted/20 flex items-center justify-center">
                <span className="font-granjon text-3xl text-[#5e5950]">
                  {getInitials(profile?.full_name ?? null)}
                </span>
              </div>
            )}
          </div>

          <p className="font-helvetica text-[10px] uppercase tracking-[0.28em] text-[#5e5950] mb-3">
            Your profile
          </p>
          <h1 className="font-granjon normal-case text-[clamp(1.55rem,4vw,1.95rem)] leading-[1.15] mb-2 text-[#1a1814] tracking-[-0.005em]">
            {profile?.full_name ? (
              <>
                <em className="italic">{firstName}</em>
                {lastName ? ` ${lastName}` : ''}
              </>
            ) : (
              '—'
            )}
          </h1>
          <p className="font-helvetica text-[13.5px] leading-[1.65] text-[#3d3a34] normal-case tracking-normal">
            {[profile?.role, profile?.location].filter(Boolean).join(' · ')}
          </p>
          {profile?.username && (
            <p className="font-granjon italic normal-case text-[13px] text-[#5e5950] mt-1">
              blkbook.me/{profile.username}
            </p>
          )}
        </motion.div>

        {/* Actions card */}
        <motion.div
          className="mb-9 rounded-[6px] overflow-hidden border border-[#e6e1d6] bg-[#fbfaf6]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {actions.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === actions.length - 1;
            return (
              <button
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity hover:opacity-80 disabled:opacity-40${!isLast ? ' border-b border-[#ece7da]' : ''}`}
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#f5f4f0] border border-[#e6e1d6]">
                  <Icon className="w-[14px] h-[14px] text-[#1a1814]" strokeWidth={1.5} />
                </span>
                <div className="flex-1 text-left">
                  <p className="font-helvetica text-[11px] text-[#1a1814] tracking-[0.08em] uppercase">
                    {item.label}
                  </p>
                  <p className="font-helvetica text-[11px] text-[#5e5950] mt-0.5 normal-case tracking-normal">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-[#5e5950]" strokeWidth={1.2} />
              </button>
            );
          })}
        </motion.div>

        {/* Invitations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-2 px-1">
            <span className="font-helvetica text-[9.5px] tracking-[0.22em] uppercase">
              Invitations
            </span>
          </div>

          <div className="p-6 rounded-[6px] bg-[#fbfaf6] border border-bb-rule">
            <p className="font-granjon italic normal-case text-[20px] leading-snug mb-1.5 text-bb-dark">
              Know someone who belongs?
            </p>
            <p className="font-helvetica text-[13.5px]  mb-5 normal-case tracking-normal">
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
              <p className="font-helvetica text-[11.5px] ml-1 normal-case tracking-normal">
                {invitesUsed} of {INVITE_TOTAL} used
              </p>
            </div>

            <Button className="bb-btn-primary group" onClick={() => router.push('/send-invite')}>
              <span className="inline-flex items-center gap-2">
                Send an Invitation
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Button>
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
