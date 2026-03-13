'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useExchanges, useAcceptExchange } from '@/hooks/use-exchanges';
import type { Exchange, SharedFields } from '@/lib/data/exchanges';
import { routes } from '@/lib/routes';
import { Text } from '@/components/ui/text';

function ContactLine({ fields }: { fields: SharedFields }) {
  const parts: string[] = [];
  // For guests, show the raw contact string; for members, show individual fields
  if (fields.contact) parts.push(fields.contact);
  if (fields.email) parts.push(fields.email);
  if (fields.phone) parts.push(fields.phone);

  if (parts.length === 0) return null;
  return (
    <Text variant="label" color="muted" className="leading-relaxed">
      {parts.join(' · ')}
    </Text>
  );
}

function ExtraLinks({ fields }: { fields: SharedFields }) {
  const items: { label: string; value: string }[] = [];
  if (fields.instagram) items.push({ label: 'IG', value: fields.instagram });
  if (fields.website) items.push({ label: 'Web', value: fields.website });
  if (fields.location) items.push({ label: '', value: fields.location });
  if (items.length === 0) return null;
  return (
    <Text variant="label-micro" className="text-bb-muted/60 mt-0.5 leading-relaxed">
      {items.map(({ label, value }) => (label ? `${label}: ${value}` : value)).join(' · ')}
    </Text>
  );
}

function RequestCard({ exchange }: { exchange: Exchange }) {
  const { mutate: accept, isPending, isSuccess } = useAcceptExchange();
  const fields = exchange.initiator_shared_fields;
  const isMember = !!exchange.initiator_profile_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-border/50 py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          {fields.photo_url && (
            <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-border/40 mt-0.5">
              <Image
                src={fields.photo_url}
                alt={fields.name}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {exchange.status === 'pending' && (
                <span className="w-1.5 h-1.5 rounded-full bg-bb-dark flex-shrink-0" />
              )}
              <Text variant="h3" color="dark" className="truncate">
                {fields.name}
              </Text>
            </div>

            {fields.role && (
              <Text variant="note" className="mb-0.5">
                {fields.role}
              </Text>
            )}

            <ContactLine fields={fields} />
            <ExtraLinks fields={fields} />

            {exchange.initiator_note && (
              <Text variant="note" className="text-bb-muted/80 mt-1.5 line-clamp-2">
                &ldquo;{exchange.initiator_note}&rdquo;
              </Text>
            )}

            <div className="flex items-center gap-3 mt-2">
              <Text variant="label-micro" className="text-bb-muted/50">
                {formatDistanceToNow(new Date(exchange.created_at), { addSuffix: true })}
              </Text>
              {isMember && fields.username && (
                <Link
                  href={routes.publicProfile(fields.username)}
                  className="font-helvetica text-[10px] text-bb-muted/50 uppercase tracking-[0.08em] underline underline-offset-2 hover:text-bb-dark transition-colors"
                >
                  View profile
                </Link>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => !isSuccess && accept(exchange.id)}
          disabled={isPending || isSuccess}
          className={`flex-shrink-0 px-3 py-2 border transition-colors ${
            isSuccess
              ? 'border-bb-dark/20 cursor-default'
              : 'border-bb-dark hover:bg-bb-dark hover:text-bb-cream'
          }`}
        >
          <Text
            variant="label-micro"
            as="span"
            className={isSuccess ? 'text-bb-muted' : 'text-bb-dark'}
          >
            {isSuccess ? 'Accepted' : isPending ? '…' : 'Accept'}
          </Text>
        </button>
      </div>
    </motion.div>
  );
}

export function Inbox() {
  const { data: exchanges = [], isLoading } = useExchanges();
  const pending = exchanges.filter((e) => e.status === 'pending');

  if (isLoading) {
    return (
      <div className="pt-8 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border/50 py-5 space-y-2 animate-pulse">
            <div className="h-4 w-32 bg-border rounded" />
            <div className="h-3 w-24 bg-border/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div className="pt-16 text-center">
        <Text variant="h3" color="muted">
          No requests yet
        </Text>
        <Text variant="note" className="text-bb-muted/60 mt-1">
          Exchange requests from your profile visitors will appear here.
        </Text>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {pending.map((exchange) => (
        <RequestCard key={exchange.id} exchange={exchange} />
      ))}
    </div>
  );
}
