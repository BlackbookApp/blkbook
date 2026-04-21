'use client';

import { useState, useRef, useEffect } from 'react';
import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Mail, Phone, Globe, MapPin } from 'lucide-react';
import {
  useAcceptExchange,
  useDeclineExchange,
  useUpdateExchangeNote,
} from '@/hooks/use-exchanges';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { routes } from '@/lib/routes';
import type { Exchange } from '@/lib/data/exchanges';

interface InboxDetailSheetProps {
  exchange: Exchange | null;
  onClose: () => void;
}

export function InboxDetailSheet({ exchange, onClose }: InboxDetailSheetProps) {
  const [editedNote, setEditedNote] = useState(exchange?.recipient_note ?? '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [prevExchangeId, setPrevExchangeId] = useState(exchange?.id);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    mutate: accept,
    isPending: isAccepting,
    isSuccess: isAccepted,
    reset: resetAccept,
  } = useAcceptExchange();
  const { mutate: decline, isPending: isDeclining } = useDeclineExchange();
  const { mutate: saveNote } = useUpdateExchangeNote();

  // Sync textarea when a different exchange is opened (set state during render, not in an effect)
  if (prevExchangeId !== exchange?.id) {
    setPrevExchangeId(exchange?.id);
    setEditedNote(exchange?.recipient_note ?? '');
    setNoteSaved(false);
  }

  // Auto-save note 800ms after the user stops typing
  useEffect(() => {
    if (!exchange) return;
    const persisted = exchange.recipient_note ?? '';
    if (editedNote === persisted) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote(
        { exchangeId: exchange.id, note: editedNote },
        { onSuccess: () => setNoteSaved(true) }
      );
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editedNote, exchange, saveNote]);

  const open = exchange !== null;
  const fields = exchange?.initiator_shared_fields;
  const isMember = !!exchange?.initiator_profile_id;

  const handleAccept = () => {
    if (!exchange || isAccepted) return;
    // Flush any pending debounce before accepting
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      saveNote({ exchangeId: exchange.id, note: editedNote });
    }
    accept(exchange.id);
  };

  const handleDecline = () => {
    if (!exchange) return;
    decline(exchange.id);
    onClose();
  };

  const handleClose = () => {
    if (!isAccepting && !isDeclining) {
      resetAccept();
      onClose();
    }
  };

  type ContactRow = { icon: React.ElementType; label: string };
  const contactRows: ContactRow[] = fields
    ? ([
        fields.email ? { icon: Mail, label: fields.email } : null,
        fields.phone ? { icon: Phone, label: fields.phone } : null,
        fields.website ? { icon: Globe, label: fields.website } : null,
        fields.location ? { icon: MapPin, label: fields.location } : null,
      ].filter(Boolean) as ContactRow[])
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex flex-col bg-white shadow-2xl overflow-hidden rounded-t-2xl"
            style={{ maxWidth: '420px', maxHeight: '92vh' }}
          >
            {/* Success overlay */}
            <AnimatePresence>
              {isAccepted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-bb-dark rounded-t-2xl"
                  onAnimationComplete={() => {
                    setTimeout(() => {
                      resetAccept();
                      onClose();
                    }, 1800);
                  }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-16 h-px mb-8 bg-white/30"
                    style={{ transformOrigin: 'center' }}
                  />
                  <Text
                    as={motion.h2}
                    variant="h3"
                    color="cream"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    Added to vault
                  </Text>
                  <Text
                    as={motion.p}
                    variant="note"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="text-white/45 mt-1"
                  >
                    {fields?.name} is now in your contacts
                  </Text>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-16 h-px mt-8 bg-white/30"
                    style={{ transformOrigin: 'center' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-0.5 rounded-full bg-bb-rule" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 pt-3 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Text variant="h3" color="dark">
                  Request
                </Text>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full w-8 h-8 border-bb-rule hover:bg-bb-cream"
                >
                  <X size={14} strokeWidth={1.5} />
                </Button>
              </div>

              {fields && (
                <>
                  {/* Profile row */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-16 h-[76px] overflow-hidden border border-bb-rule bg-bb-rule/20">
                      {fields.photo_url ? (
                        <Image
                          src={fields.photo_url}
                          alt={fields.name}
                          width={64}
                          height={76}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-bb-rule/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h2 className="font-granjon font-light text-[20px] text-bb-dark leading-tight">
                        {fields.name}
                      </h2>
                      {fields.role && (
                        <p className="font-helvetica text-[10px] uppercase tracking-[0.08em] text-bb-muted mt-0.5">
                          {fields.role}
                        </p>
                      )}
                      {isMember && fields.username && (
                        <Link
                          href={routes.publicProfile(fields.username)}
                          className="font-helvetica text-[10px] text-bb-muted/50 uppercase tracking-[0.08em] underline underline-offset-2 hover:text-bb-dark transition-colors mt-1.5 inline-block"
                        >
                          View profile
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Contact details */}
                  {contactRows.length > 0 && (
                    <div className="border-t border-bb-rule/60 pt-4 mb-5 space-y-2.5">
                      {contactRows.map(({ icon: Icon, label }, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Icon
                            className="w-3.5 h-3.5 text-bb-muted/50 flex-shrink-0"
                            strokeWidth={1.5}
                          />
                          <span className="font-helvetica text-[11px] text-bb-dark tracking-[0.02em] truncate">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Their note */}
                  {exchange?.initiator_note && (
                    <div className="border-t border-bb-rule/60 pt-4 mb-5">
                      <Text variant="label-micro" className="mb-2 block">
                        Their note
                      </Text>
                      <p className="font-granjon italic text-[13px] text-bb-muted/80 leading-relaxed">
                        &ldquo;{exchange.initiator_note}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Recipient note */}
                  <div className="border-t border-bb-rule/60 pt-4 mb-7">
                    <div className="flex items-center justify-between mb-2">
                      <Text variant="label-micro">Add a note</Text>
                      <AnimatePresence>
                        {noteSaved && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-helvetica text-[10px] uppercase tracking-[0.08em] text-bb-muted/50"
                          >
                            Saved
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      rows={3}
                      className="font-granjon text-bb-dark w-full bg-white outline-none border border-bb-rule px-4 py-3 text-[14px] italic leading-relaxed resize-none placeholder:text-bb-muted/40 focus:border-bb-dark/40 transition-colors"
                      placeholder="How you met, context, anything worth remembering…"
                      disabled={isAccepting || isAccepted}
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="blackbook-secondary"
                  onClick={handleAccept}
                  disabled={isAccepting || isAccepted}
                  className="flex-1 border-bb-dark text-bb-dark hover:bg-bb-dark/5"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  {isAccepting ? 'Accepting…' : 'Accept'}
                </Button>
                <Button
                  variant="blackbook-secondary"
                  onClick={handleDecline}
                  disabled={isDeclining || isAccepting || isAccepted}
                  className="border-bb-rule text-bb-muted hover:bg-bb-rule/30"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  {isDeclining ? '…' : 'Decline'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
