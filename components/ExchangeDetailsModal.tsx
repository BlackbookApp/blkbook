'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createGuestExchangeAction } from '@/app/actions/exchanges';

interface ExchangeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  firstName: string;
  profileId: string;
}

const ExchangeDetailsModal = ({
  open,
  onClose,
  firstName,
  profileId,
}: ExchangeDetailsModalProps) => {
  const [form, setForm] = useState({ name: '', emailOrPhone: '', note: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setForm({ name: '', emailOrPhone: '', note: '' });
      onCloseRef.current();
    }, 2500);
    return () => clearTimeout(t);
  }, [showSuccess]);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSend = form.name.trim().length > 0 && form.emailOrPhone.trim().length > 0;
  const isDirty = Object.values(form).some(Boolean);

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscard(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setShowDiscard(false);
    setForm({ name: '', emailOrPhone: '', note: '' });
    setAlreadySent(false);
    onClose();
  };

  const handleSend = async () => {
    if (!canSend || loading) return;
    setLoading(true);
    setError(null);
    setAlreadySent(false);
    try {
      const inserted = await createGuestExchangeAction(
        profileId,
        { name: form.name.trim(), contact: form.emailOrPhone.trim() },
        form.note.trim() || undefined
      );
      if (!inserted) {
        setAlreadySent(true);
        return;
      }
      if (navigator.vibrate) navigator.vibrate(10);
      setShowSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      if (message?.toLowerCase().includes('network') || message?.toLowerCase().includes('fetch')) {
        setError('Network error. Check your connection and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
                  Details sent
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="font-garamond text-white/45 font-normal text-[13px] tracking-[0.01em] mt-1 italic"
                >
                  {firstName} will remember you
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
                  Discard your details?
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
              Send {firstName} your details
            </p>

            <div className="max-w-[400px] mx-auto">
              <div className="mb-8">
                <p className="font-garamond text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]">
                  Your Name *
                </p>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Full name"
                  autoFocus
                  className="font-garamond text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] tracking-[0.01em] placeholder:text-muted-foreground/25"
                />
              </div>

              <div className="mb-8">
                <p className="font-garamond text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]">
                  Email or Phone *
                </p>
                <input
                  type="text"
                  value={form.emailOrPhone}
                  onChange={set('emailOrPhone')}
                  placeholder="How to reach you"
                  className="font-garamond text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic tracking-[0.01em] placeholder:text-muted-foreground/25"
                />
              </div>

              <div className="mb-10">
                <p className="font-garamond text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]">
                  Note
                </p>
                <textarea
                  value={form.note}
                  onChange={set('note')}
                  placeholder="Anything worth remembering..."
                  rows={3}
                  className="font-garamond text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic leading-relaxed resize-none placeholder:text-muted-foreground/25"
                />
              </div>

              {alreadySent && (
                <p className="font-garamond text-bb-muted text-[12px] italic mb-4 text-center">
                  You&apos;ve already sent your details to {firstName} recently.
                </p>
              )}

              {error && (
                <p className="font-garamond text-red-500 text-[11px] mb-4 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend || loading}
                className={`font-helvetica font-normal ${
                  canSend && !loading
                    ? 'bg-bb-dark cursor-pointer'
                    : 'bg-bb-dark/15 cursor-not-allowed'
                } text-bb-cream w-full py-5 uppercase tracking-[0.12em] text-[11px] transition-colors relative overflow-hidden grain-overlay`}
              >
                {loading ? 'Sending…' : 'Send My Details'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExchangeDetailsModal;
