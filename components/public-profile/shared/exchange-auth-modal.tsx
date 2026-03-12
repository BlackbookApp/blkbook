'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/use-profile';
import { performExchangeAction } from '@/app/actions/exchange-requests';
import { useQueryClient } from '@tanstack/react-query';
import type { SocialLinks } from '@/lib/data/profiles';

interface ExchangeAuthModalProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  profileFirstName: string;
  profileName: string;
  profileRole?: string | null;
  profilePhotoUrl?: string | null;
  socialLinks: SocialLinks;
}

export default function ExchangeAuthModal({
  open,
  onClose,
  profileId,
  profileFirstName,
  profileName,
  profileRole,
  profilePhotoUrl,
  socialLinks,
}: ExchangeAuthModalProps) {
  const { data: user } = useUser();
  const { data: myProfile } = useProfile();
  const queryClient = useQueryClient();

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  // Cleanup timeout on unmount (#4)
  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => {
      setShowSuccess(false);
      setNote('');
      onClose();
    }, 2500);
    return () => clearTimeout(t);
  }, [showSuccess, onClose]);

  const myName = myProfile?.full_name ?? '';
  const myRole = myProfile?.role ?? '';
  // No auth email fallback — only use explicitly set social links (#19)
  const myContact = myProfile?.social_links?.email ?? myProfile?.social_links?.phone ?? '';
  const canExchange = !!user && !!myName && !!myContact;

  const handleConfirm = async () => {
    if (!canExchange || loading) return;
    setLoading(true);
    setError(null);
    try {
      // Atomic: vault contact + exchange request in one Postgres transaction (#1)
      await performExchangeAction({
        profileId,
        profileName,
        profileRole,
        profilePhotoUrl,
        profileEmail: socialLinks.email,
        profilePhone: socialLinks.phone,
        profileInstagram: socialLinks.instagram,
        profileWebsite: socialLinks.website,
        requesterName: myName,
        requesterContact: myContact,
        note: note || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['vault-in', profileId] });
      queryClient.invalidateQueries({ queryKey: ['vault-contacts'] });
      if (navigator.vibrate) navigator.vibrate(10);
      setShowSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (note) {
      setShowDiscard(true);
    } else {
      setError(null);
      onClose();
    }
  };

  const handleDiscard = () => {
    setShowDiscard(false);
    setNote('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          {/* Success overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bb-dark"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-16 h-px mb-8 bg-white/30"
                  style={{ transformOrigin: 'center' }}
                />
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="font-garamond text-bb-cream font-normal text-[15px] tracking-[0.01em] uppercase"
                >
                  Details exchanged
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="font-garamond text-white/45 font-normal text-[13px] tracking-[0.01em] mt-1 italic"
                >
                  {profileFirstName} will remember you
                </motion.p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-16 h-px mt-8 bg-white/30"
                  style={{ transformOrigin: 'center' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discard confirmation overlay (#10) */}
          <AnimatePresence>
            {showDiscard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-8"
              >
                <p className="font-garamond text-foreground text-[18px] text-center mb-2">
                  Discard your note?
                </p>
                <p className="font-garamond text-bb-muted text-[13px] italic text-center mb-10">
                  What you&apos;ve written will be lost.
                </p>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-foreground w-full py-4 border border-border/60 mb-3"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiscard(false)}
                  className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-bb-muted"
                >
                  Keep editing
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="flex items-center justify-between mt-8 mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-bb-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="h-px bg-border/60 mb-10" />

            <p className="font-garamond text-bb-muted text-[10px] uppercase tracking-[0.25em] text-center mb-10">
              Exchange details with {profileFirstName}
            </p>

            <div className="max-w-[400px] mx-auto">
              {/* Preview of what you're sharing */}
              <div className="mb-10 p-4 border border-border/40">
                <p className="font-garamond text-bb-muted font-medium text-[10px] uppercase mb-4 tracking-[0.2em]">
                  You&apos;ll share
                </p>
                {myName && (
                  <p className="font-garamond text-foreground text-[18px] mb-1">{myName}</p>
                )}
                {myRole && (
                  <p className="font-garamond text-bb-muted text-[12px] mb-1 italic">{myRole}</p>
                )}
                {myContact ? (
                  <p className="font-garamond text-bb-muted text-[12px]">{myContact}</p>
                ) : (
                  <p className="font-garamond text-bb-muted/60 text-[11px] italic">
                    Add an email or phone to your profile to exchange details.
                  </p>
                )}
              </div>

              <div className="mb-10">
                <p className="font-garamond text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]">
                  Note
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything worth remembering..."
                  rows={3}
                  className="font-garamond text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic leading-relaxed resize-none placeholder:text-muted-foreground/25"
                />
              </div>

              {error && (
                <p className="font-garamond text-red-500 text-[11px] mb-4 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canExchange || loading}
                className={`font-helvetica font-normal ${canExchange && !loading ? 'bg-bb-dark cursor-pointer' : 'bg-bb-dark/15 cursor-not-allowed'} text-bb-cream w-full py-5 uppercase tracking-[0.12em] text-[11px] transition-colors relative overflow-hidden grain-overlay`}
              >
                {loading ? 'Sending…' : 'Exchange Details'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
