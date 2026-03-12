'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useExchangeRequests, useMarkExchangeRequestsSeen } from '@/hooks/use-exchange-requests';
import { useCreateVaultContact } from '@/hooks/use-vault-contacts';
import type { ExchangeRequest } from '@/lib/data/exchange-requests';

function guessContactFields(contact: string): { email: string | null; phone: string | null } {
  if (contact.includes('@')) return { email: contact, phone: null };
  return { email: null, phone: contact };
}

function RequestCard({ req }: { req: ExchangeRequest }) {
  const { mutate: saveToVault, isPending, isSuccess } = useCreateVaultContact();
  const { mutate: markSeen } = useMarkExchangeRequestsSeen();
  const { email, phone } = guessContactFields(req.requester_contact);

  const handleSave = () => {
    saveToVault(
      {
        name: req.requester_name,
        email,
        phone,
        notes: req.note ?? null,
        role: null,
        city: null,
        instagram: null,
        website: null,
        photo_url: null,
      },
      { onSuccess: () => markSeen([req.id]) }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-border/50 py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {req.status === 'pending' && (
              <span className="w-1.5 h-1.5 rounded-full bg-bb-dark flex-shrink-0" />
            )}
            <p className="font-display font-light text-[15px] tracking-[0.01em] uppercase text-bb-dark truncate">
              {req.requester_name}
            </p>
          </div>
          <p className="font-helvetica text-[11px] text-bb-muted mb-1">{req.requester_contact}</p>
          {req.note && (
            <p className="font-garamond italic text-[13px] text-bb-muted/80 mt-1 line-clamp-2">
              &ldquo;{req.note}&rdquo;
            </p>
          )}
          <p className="font-helvetica text-[10px] text-bb-muted/50 mt-2 uppercase tracking-[0.08em]">
            {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || isSuccess}
          className={`flex-shrink-0 font-helvetica text-[10px] uppercase tracking-[0.12em] px-3 py-2 border transition-colors ${
            isSuccess
              ? 'border-bb-dark/20 text-bb-muted cursor-default'
              : 'border-bb-dark text-bb-dark hover:bg-bb-dark hover:text-bb-cream'
          }`}
        >
          {isSuccess ? 'Saved' : isPending ? '…' : 'Save'}
        </button>
      </div>
    </motion.div>
  );
}

export function Inbox() {
  const { data: requests = [], isLoading } = useExchangeRequests();
  const pending = requests.filter((r) => r.status === 'pending');

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
        <p className="font-display font-light text-[13px] uppercase tracking-[0.08em] text-bb-muted">
          No requests yet
        </p>
        <p className="font-garamond italic text-[13px] text-bb-muted/60 mt-1">
          Exchange requests from your profile visitors will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {pending.map((req) => (
        <RequestCard key={req.id} req={req} />
      ))}
    </div>
  );
}
