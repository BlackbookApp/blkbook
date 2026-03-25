'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { resetProfileCompleteAction } from '@/app/actions/profiles';

export default function AdminResetProfilePage() {
  const [profileId, setProfileId] = useState('');
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const { error } = await resetProfileCompleteAction(profileId.trim(), userId.trim());
      if (error) {
        setResult({ ok: false, message: error });
      } else {
        setResult({ ok: true, message: 'profile_complete set to false.' });
        setProfileId('');
        setUserId('');
      }
    });
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
          <h1 className="text-2xl tracking-tight uppercase mb-8">Reset Profile Complete</h1>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-bb-muted">
                Profile ID
              </label>
              <input
                type="text"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                required
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-bb-muted">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !profileId.trim() || !userId.trim()}
              className="text-[10px] uppercase tracking-widest px-6 py-2.5 bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {isPending ? 'Resetting…' : 'Reset'}
            </button>
          </form>

          {result && (
            <p
              className={`mt-6 text-[11px] uppercase tracking-widest ${result.ok ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {result.message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
