'use client';

import { useEffect, useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { type AccessRequest } from '@/lib/data/access-requests';
import {
  getAllAccessRequestsAction,
  approveRequest,
  rejectRequest,
} from '@/app/actions/access-requests';

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllAccessRequestsAction();
      setRequests(data);
      setLoading(false);
    })();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getAllAccessRequestsAction();
    setRequests(data);
    setLoading(false);
  };

  const handleApprove = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await approveRequest(id);
      if ('error' in result) {
        setActionError(result.error);
      } else {
        await load();
      }
    });
  };

  const handleReject = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const result = await rejectRequest(id);
      if ('error' in result) {
        setActionError(result.error);
      } else {
        await load();
      }
    });
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] text-bb-muted uppercase tracking-widest mb-2">Admin</p>
          <h1 className="text-2xl tracking-tight uppercase mb-8">Access Requests</h1>

          <div className="flex gap-1 mb-8 border-b border-border pb-4">
            {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] uppercase tracking-widest px-3 py-1.5 transition-colors ${
                  filter === f
                    ? 'bg-foreground text-background'
                    : 'text-bb-muted hover:text-foreground'
                }`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>

          {actionError && <p className="text-[11px] text-red-500 mb-4">{actionError}</p>}

          {loading ? (
            <p className="text-[11px] text-bb-muted uppercase tracking-widest">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-[11px] text-bb-muted">No {filter} requests.</p>
          ) : (
            <div className="space-y-px">
              {filtered.map((req) => (
                <div
                  key={req.id}
                  className="border border-border p-5 space-y-3 bg-background hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{req.full_name}</p>
                      <p className="text-[11px] text-bb-muted">{req.email}</p>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-widest px-2 py-0.5 shrink-0 ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status}
                      {req.attempt_count > 1 ? ` (×${req.attempt_count})` : ''}
                    </span>
                  </div>

                  {(req.social_handle || req.brand_link) && (
                    <div className="flex gap-4 text-[11px] text-bb-muted">
                      {req.social_handle && <span>{req.social_handle}</span>}
                      {req.brand_link && (
                        <a
                          href={req.brand_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground transition-colors truncate max-w-[200px]"
                        >
                          {req.brand_link}
                        </a>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-bb-muted/60">
                    {new Date(req.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  {req.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={isPending}
                        className="text-[10px] uppercase tracking-widest px-4 py-2 bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={isPending}
                        className="text-[10px] uppercase tracking-widest px-4 py-2 border border-border text-bb-muted hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
