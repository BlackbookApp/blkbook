'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/use-profile';
import { useProfileComponents } from '@/hooks/use-profile-components';
import { performExchangeAction } from '@/app/actions/exchanges';
import { useQueryClient } from '@tanstack/react-query';
import type { SocialLinks } from '@/lib/data/profiles';
import type { SharedFields } from '@/lib/data/exchanges';
import { Text } from '@/components/ui/text';

interface ProfileSocials {
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
}

interface ExchangeAuthModalProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  profileFirstName: string;
  profileName: string;
  profileRole?: string | null;
  profilePhotoUrl?: string | null;
  socialLinks: SocialLinks;
  profileSocials?: ProfileSocials;
}

type FieldKey =
  | 'role'
  | 'photo_url'
  | 'email'
  | 'phone'
  | 'website'
  | 'location'
  | 'instagram'
  | 'tiktok'
  | 'youtube';

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'role', label: 'Role' },
  { key: 'photo_url', label: 'Photo' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'website', label: 'Website' },
  { key: 'location', label: 'Location' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
];

export default function ExchangeAuthModal({
  open,
  onClose,
  profileId,
  profileFirstName,
  profileName,
  profileRole,
  profilePhotoUrl,
  socialLinks,
  profileSocials,
}: ExchangeAuthModalProps) {
  const { data: user } = useUser();
  const { data: myProfile } = useProfile();
  const { data: myComponents } = useProfileComponents(myProfile?.id);
  const queryClient = useQueryClient();

  // Extract my social handles from my social_stat component
  const mySocialStat = myComponents?.find((c) => c.type === 'social_stat');
  const mySocialItems =
    (mySocialStat?.data as { items?: Array<{ platform: string; handle?: string }> } | undefined)
      ?.items ?? [];
  const getMySocial = (platform: string) =>
    mySocialItems.find((i) => i.platform.toLowerCase() === platform)?.handle || null;

  // Map field key → current value from my profile
  const fieldValues: Record<FieldKey, string | null | undefined> = {
    role: myProfile?.role,
    photo_url: myProfile?.avatar_url,
    email: myProfile?.social_links?.email,
    phone: myProfile?.social_links?.phone,
    website: myProfile?.social_links?.website,
    location: myProfile?.location,
    instagram: getMySocial('instagram'),
    tiktok: getMySocial('tiktok'),
    youtube: getMySocial('youtube'),
  };

  // All fields that have a value are selected by default
  const [selected, setSelected] = useState<Set<FieldKey>>(() => new Set());

  // Re-initialise when profile or components load
  useEffect(() => {
    if (!myProfile) return;
    const defaults = new Set<FieldKey>();
    for (const { key } of FIELDS) {
      if (fieldValues[key]) defaults.add(key);
    }
    setSelected(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProfile?.id, myComponents]);

  const toggle = (key: FieldKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  // Stable ref so the success timer never captures a stale onClose
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => {
      setShowSuccess(false);
      setNote('');
      onCloseRef.current();
    }, 2500);
    return () => clearTimeout(t);
  }, [showSuccess]);

  const myName = myProfile?.full_name ?? '';
  const canExchange = !!user && !!myName;

  const buildInitiatorFields = (): SharedFields => {
    const fields: SharedFields = {
      name: myName,
      username: myProfile?.username ?? undefined,
    };
    if (selected.has('role') && fieldValues.role) fields.role = fieldValues.role;
    if (selected.has('photo_url') && fieldValues.photo_url)
      fields.photo_url = fieldValues.photo_url;
    if (selected.has('email') && fieldValues.email) fields.email = fieldValues.email;
    if (selected.has('phone') && fieldValues.phone) fields.phone = fieldValues.phone;
    if (selected.has('instagram') && fieldValues.instagram)
      fields.instagram = fieldValues.instagram;
    if (selected.has('tiktok') && fieldValues.tiktok) fields.tiktok = fieldValues.tiktok;
    if (selected.has('youtube') && fieldValues.youtube) fields.youtube = fieldValues.youtube;
    if (selected.has('website') && fieldValues.website) fields.website = fieldValues.website;
    if (selected.has('location') && fieldValues.location) fields.location = fieldValues.location;
    return fields;
  };

  const handleConfirm = async () => {
    if (!canExchange || loading) return;
    setLoading(true);
    setError(null);
    try {
      await performExchangeAction({
        recipientProfileId: profileId,
        recipientName: profileName,
        recipientRole: profileRole,
        recipientPhotoUrl: profilePhotoUrl,
        recipientEmail: socialLinks.email,
        recipientPhone: socialLinks.phone,
        recipientInstagram: profileSocials?.instagram,
        recipientTiktok: profileSocials?.tiktok,
        recipientYoutube: profileSocials?.youtube,
        recipientWebsite: socialLinks.website,
        initiatorFields: buildInitiatorFields(),
        note: note || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['vault-in', profileId] });
      queryClient.invalidateQueries({ queryKey: ['vault-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['has-exchanged', profileId] });
      if (navigator.vibrate) navigator.vibrate(10);
      setShowSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      if (message?.includes('Not authenticated')) {
        setError('You must be signed in to exchange details.');
      } else {
        setError('Something went wrong. Please try again.');
      }
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
                <Text
                  as={motion.h2}
                  variant="h3"
                  color="cream"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Details exchanged
                </Text>
                <Text
                  as={motion.p}
                  variant="note"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-white/45 mt-1"
                >
                  {profileFirstName} will remember you
                </Text>
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

          {/* Discard confirmation overlay */}
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
                <Text variant="note" className="text-center mb-10">
                  What you&apos;ve written will be lost.
                </Text>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="w-full py-4 border border-border/60 mb-3"
                >
                  <Text variant="label" as="span">
                    Discard
                  </Text>
                </button>
                <button type="button" onClick={() => setShowDiscard(false)}>
                  <Text variant="label" color="muted" as="span">
                    Keep editing
                  </Text>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto px-6 pb-10">
            <div className="flex items-center justify-between mt-8 mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="hover:text-foreground transition-colors"
              >
                <Text variant="label" color="muted" as="span">
                  Cancel
                </Text>
              </button>
            </div>

            <div className="h-px bg-border/60 mb-10" />

            <Text variant="h3" className="mb-4">
              Exchange details with {profileFirstName}
            </Text>

            <div className="max-w-[400px] mx-auto">
              {/* Always-shared fields */}
              <div className="mb-2">
                <Text variant="label-micro" className="mb-3">
                  Always shared
                </Text>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    {/* Locked indicator */}
                    <span className="w-3.5 h-3.5 border border-bb-dark bg-bb-dark flex-shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white block" />
                    </span>
                    <span className="font-helvetica text-[10px] tracking-[0.04em] text-bb-dark">
                      Name
                    </span>
                  </div>
                  <Text variant="note" as="span" className="truncate max-w-[55%]">
                    {myName || <span className="text-bb-muted/40">Not set</span>}
                  </Text>
                </div>

                {myProfile?.username && (
                  <div className="flex items-center justify-between py-3 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 border border-bb-dark bg-bb-dark flex-shrink-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white block" />
                      </span>
                      <span className="font-helvetica text-[10px] tracking-[0.04em] text-bb-dark">
                        Profile
                      </span>
                    </div>
                    <Text variant="note" as="span" className="truncate max-w-[55%]">
                      /p/{myProfile.username}
                    </Text>
                  </div>
                )}
              </div>

              {/* Selectable fields */}
              <div className="mt-6 mb-10">
                <Text variant="label-micro" className="mb-3">
                  Choose what to share
                </Text>

                {FIELDS.filter(({ key }) => !!fieldValues[key]).map(({ key, label }) => {
                  const value = fieldValues[key]!;
                  const isChecked = selected.has(key);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      className="flex items-center justify-between py-3 border-b border-border/30 w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-bb-dark border-bb-dark'
                              : 'border-border/60 bg-transparent'
                          }`}
                        >
                          {isChecked && <span className="w-1.5 h-1.5 bg-white block" />}
                        </span>
                        <span className="font-helvetica text-[10px] tracking-[0.04em] text-bb-dark">
                          {label}
                        </span>
                      </div>

                      {key === 'photo_url' ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-border/40 flex-shrink-0">
                          <Image
                            src={value}
                            alt="Your photo"
                            width={28}
                            height={28}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <Text
                          variant="note"
                          as="span"
                          className="normal-case text-right truncate max-w-[55%]"
                        >
                          {value}
                        </Text>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Note */}
              <div className="mb-10">
                <Text variant="label-micro" className="mb-3">
                  Note
                </Text>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything worth remembering..."
                  rows={3}
                  className="font-garamond text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic leading-relaxed resize-none placeholder:text-muted-foreground/25"
                />
              </div>

              {!myName && (
                <p className="font-garamond text-bb-muted/60 text-[11px] italic mb-4 text-center">
                  Add a name to your profile to exchange details.
                </p>
              )}

              {error && (
                <p className="font-garamond text-red-500 text-[11px] mb-4 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canExchange || loading}
                className={`${
                  canExchange && !loading
                    ? 'bg-bb-dark cursor-pointer'
                    : 'bg-bb-dark/15 cursor-not-allowed'
                } w-full py-5 transition-colors relative overflow-hidden grain-overlay`}
              >
                <Text variant="label" color="cream" as="span">
                  {loading ? 'Sending…' : 'Exchange Details'}
                </Text>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
