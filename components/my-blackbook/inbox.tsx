'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useExchanges, useAcceptExchange, useDeclineExchange } from '@/hooks/use-exchanges';
import { InboxDetailSheet } from './InboxDetailSheet';
import type { Exchange } from '@/lib/data/exchanges';
import { routes } from '@/lib/routes';

function RequestCard({
  exchange,
  index,
  onOpen,
}: {
  exchange: Exchange;
  index: number;
  onOpen: () => void;
}) {
  const { mutate: accept, isPending: isAccepting, isSuccess: isAccepted } = useAcceptExchange();
  const { mutate: decline, isPending: isDeclining } = useDeclineExchange();
  // Quick-accept from the card skips the note flow
  const fields = exchange.initiator_shared_fields;
  const isMember = !!exchange.initiator_profile_id;

  const metaParts: string[] = [];
  if (fields.role) metaParts.push(fields.role);
  if (fields.location) metaParts.push(fields.location);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="border-b border-bb-rule/60 py-5"
    >
      <div className="flex items-start gap-4">
        {/* Portrait — tapping opens the detail sheet */}
        <button
          type="button"
          onClick={onOpen}
          className="flex-shrink-0 w-14 h-[68px] overflow-hidden border border-bb-rule bg-bb-rule/20 focus:outline-none"
        >
          {fields.photo_url && (
            <Image
              src={fields.photo_url}
              alt={fields.name}
              width={56}
              height={68}
              className="w-full h-full object-cover"
            />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Name / meta — tapping opens the detail sheet */}
            <button type="button" onClick={onOpen} className="text-left focus:outline-none">
              <h3 className="font-granjon font-light text-[16px] text-bb-dark leading-tight mb-0.5">
                {fields.name}
              </h3>
              {metaParts.length > 0 && (
                <p className="font-helvetica text-[10px] uppercase tracking-[0.08em] text-bb-muted">
                  {metaParts.join(' · ')}
                </p>
              )}
            </button>
            <span className="font-helvetica text-[10px] text-bb-muted/50 flex-shrink-0 mt-0.5">
              {formatDistanceToNow(new Date(exchange.created_at))}
            </span>
          </div>

          {exchange.initiator_note && (
            <p className="mt-2 font-granjon italic text-[12px] text-bb-muted/70 line-clamp-2">
              &ldquo;{exchange.initiator_note}&rdquo;
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

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => !isAccepted && accept(exchange.id)}
              disabled={isAccepting || isAccepted}
              className={`flex items-center gap-1.5 px-4 py-2 border transition-colors ${
                isAccepted
                  ? 'border-bb-rule text-bb-muted cursor-default'
                  : 'border-bb-dark text-bb-dark hover:bg-bb-dark/5'
              }`}
            >
              <Check className="w-3 h-3" strokeWidth={2} />
              {isAccepted ? 'Accepted' : isAccepting ? '…' : 'Accept'}
            </button>

            {!isAccepted && (
              <button
                type="button"
                onClick={() => decline(exchange.id)}
                disabled={isDeclining}
                className="flex items-center gap-1.5 px-4 py-2 border border-bb-rule text-bb-muted hover:bg-bb-rule/30 transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" strokeWidth={2} />
                {isDeclining ? '…' : 'Decline'}
              </button>
            )}

            <button
              type="button"
              onClick={onOpen}
              className="font-helvetica text-[10px] uppercase tracking-[0.08em] text-bb-muted/50 hover:text-bb-dark transition-colors ml-1"
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Inbox() {
  const { data: exchanges = [], isLoading } = useExchanges();
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const pending = exchanges.filter((e) => e.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-bb-rule/60 py-5 flex gap-4 animate-pulse">
            <div className="flex-shrink-0 w-14 h-[68px] bg-bb-rule/40" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-32 bg-bb-rule/60 rounded-sm" />
              <div className="h-3 w-24 bg-bb-rule/40 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-6">
        <AnimatePresence mode="popLayout">
          {pending.map((exchange, index) => (
            <RequestCard
              key={exchange.id}
              exchange={exchange}
              index={index}
              onOpen={() => setSelectedExchange(exchange)}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {pending.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="font-granjon italic text-[18px] text-bb-muted/40">All caught up</p>
              <p className="font-helvetica text-[11px] uppercase tracking-[0.1em] text-bb-muted/30 mt-1">
                No pending requests
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InboxDetailSheet exchange={selectedExchange} onClose={() => setSelectedExchange(null)} />
    </>
  );
}
