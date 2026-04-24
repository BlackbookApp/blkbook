'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useCreateInvite } from '@/hooks/use-invitations';
import { toast } from '@/hooks/use-toast';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
export const INVITE_TOTAL = 10;

export function useInvite() {
  const { data: profile } = useProfile();
  const { mutate: createInvite, isPending } = useCreateInvite();
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const invitesRemaining = profile?.invites_remaining ?? INVITE_TOTAL;
  const invitesUsed = INVITE_TOTAL - invitesRemaining;
  const inviteUrl = generatedCode ? `${APP_URL}/invite?ref=${generatedCode}` : null;

  const handleGenerate = () => {
    createInvite(undefined, {
      onSuccess: (result) => {
        if ('error' in result) {
          toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
          setGeneratedCode(result.code);
        }
      },
    });
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    toast({ title: 'Copied', description: 'Invite link copied to clipboard' });
  };

  const handleShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Haizel',
          text: "You've been invited to Haizel — a private network for creative professionals.",
          url: inviteUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await handleCopy();
    }
  };

  const reset = () => setGeneratedCode(null);

  return {
    invitesRemaining,
    invitesUsed,
    inviteUrl,
    generatedCode,
    isPending,
    handleGenerate,
    handleCopy,
    handleShare,
    reset,
  };
}
