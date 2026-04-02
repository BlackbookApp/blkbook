'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createGuestExchangeAction } from '@/app/actions/exchanges';
import { Text } from '@/components/ui/text';

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
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => {
      setShowSuccess(false);
      setForm({ name: '', phone: '', email: '', note: '' });
      onCloseRef.current();
    }, 2500);
    return () => clearTimeout(t);
  }, [showSuccess]);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const blur = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid = !form.phone.trim() || /^[+\d][\d\s\-().]{6,}$/.test(form.phone.trim());

  const fieldErrors = {
    name: touched.name && !form.name.trim() ? 'Name is required' : null,
    email:
      touched.email && !form.email.trim()
        ? 'Email is required'
        : touched.email && form.email.trim() && !emailValid
          ? 'Enter a valid email address'
          : null,
    phone: touched.phone && form.phone.trim() && !phoneValid ? 'Enter a valid phone number' : null,
  };

  const canSend = form.name.trim().length > 0 && emailValid;
  const isDirty = Object.values(form).some(Boolean);

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Discard your details?')) {
        setForm({ name: '', phone: '', email: '', note: '' });
        setAlreadySent(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSend = async () => {
    setTouched({ name: true, email: true, phone: true });
    if (!canSend || loading) return;
    setLoading(true);
    setError(null);
    setAlreadySent(false);
    try {
      const contact = [form.email.trim(), form.phone.trim()].filter(Boolean).join(' / ');
      const inserted = await createGuestExchangeAction(
        profileId,
        { name: form.name.trim(), contact },
        form.note.trim() || undefined,
        form.email.trim()
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex flex-col bg-white shadow-2xl overflow-hidden rounded-t-2xl"
            style={{ maxWidth: '420px', maxHeight: '92vh' }}
          >
            {/* Success overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-bb-dark rounded-t-2xl"
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
                    Details sent
                  </Text>
                  <Text
                    as={motion.p}
                    variant="note"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-white/45 mt-1"
                  >
                    {firstName} will remember you
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

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 pt-6 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex-1" />
                <Text variant="h3" color="dark">
                  Exchange
                </Text>
                <div className="flex-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-bb-rule hover:bg-bb-cream transition-colors"
                  >
                    <X size={14} strokeWidth={1.5} className="text-bb-dark" />
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <Text variant="note" align="center" className="mb-8 text-bb-dark">
                Share your contact information.
                <br />
                You will get <span className="font-semibold">{firstName}&apos;s</span> contact in a
                follow-up email.
              </Text>

              {/* Form */}
              <div>
                <div className="mb-5">
                  <Text variant="label-micro" className="mb-2 block">
                    Name
                  </Text>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    onBlur={blur('name')}
                    className={`font-granjon text-bb-dark w-full bg-white outline-none border px-4 py-3.5 text-[15px] italic tracking-[0.01em] placeholder:text-bb-muted/40 ${fieldErrors.name ? 'border-destructive' : 'border-bb-rule'}`}
                    placeholder="Full name"
                  />
                  {fieldErrors.name && (
                    <Text variant="note" color="destructive" className="mt-1">
                      {fieldErrors.name}
                    </Text>
                  )}
                </div>

                <div className="mb-5">
                  <Text variant="label-micro" className="mb-2 block">
                    Email *
                  </Text>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    className={`font-granjon text-bb-dark w-full bg-white outline-none border px-4 py-3.5 text-[15px] italic tracking-[0.01em] placeholder:text-bb-muted/40 ${fieldErrors.email ? 'border-destructive' : 'border-bb-rule'}`}
                    placeholder="your@email.com"
                  />
                  {fieldErrors.email && (
                    <Text variant="note" color="destructive" className="mt-1">
                      {fieldErrors.email}
                    </Text>
                  )}
                </div>

                <div className="mb-5">
                  <Text variant="label-micro" className="mb-2 block">
                    Phone
                  </Text>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    onBlur={blur('phone')}
                    className={`font-granjon text-bb-dark w-full bg-white outline-none border px-4 py-3.5 text-[15px] italic tracking-[0.01em] placeholder:text-bb-muted/40 ${fieldErrors.phone ? 'border-destructive' : 'border-bb-rule'}`}
                    placeholder="+1 000 000 0000"
                  />
                  {fieldErrors.phone && (
                    <Text variant="note" color="destructive" className="mt-1">
                      {fieldErrors.phone}
                    </Text>
                  )}
                </div>

                <div className="mb-7">
                  <Text variant="label-micro" className="mb-2 block">
                    Leave a note for {firstName}
                  </Text>
                  <textarea
                    value={form.note}
                    onChange={set('note')}
                    rows={3}
                    className="font-granjon text-bb-dark w-full bg-white outline-none border border-bb-rule px-4 py-3.5 text-[15px] italic leading-relaxed resize-none placeholder:text-bb-muted/40"
                    placeholder="Anything worth remembering..."
                  />
                </div>

                {alreadySent && (
                  <Text variant="note" align="center" className="mb-4">
                    You&apos;ve already sent your details to {firstName} recently.
                  </Text>
                )}

                {error && (
                  <Text variant="note" color="destructive" align="center" className="mb-4">
                    {error}
                  </Text>
                )}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend || loading}
                  className={`w-full py-[18px] rounded-md transition-colors disabled:cursor-not-allowed ${canSend && !loading ? 'bg-bb-dark' : 'bg-bb-dark/15'}`}
                >
                  <Text variant="label" color="cream" as="span">
                    {loading ? 'Sending…' : 'Exchange Contact'}
                  </Text>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExchangeDetailsModal;
