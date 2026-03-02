import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const font = "'EB Garamond', serif";

interface ExchangeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  firstName: string;
}

const ExchangeDetailsModal = ({ open, onClose, firstName }: ExchangeDetailsModalProps) => {
  const [form, setForm] = useState({
    name: '',
    emailOrPhone: '',
    note: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSend = form.name.trim().length > 0 && form.emailOrPhone.trim().length > 0;

  const handleCancel = () => {
    if (Object.values(form).some(Boolean)) {
      if (window.confirm('Discard your details?')) {
        setForm({ name: '', emailOrPhone: '', note: '' });
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    if (navigator.vibrate) navigator.vibrate(10);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setForm({ name: '', emailOrPhone: '', note: '' });
      onClose();
    }, 2500);
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
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
                style={{ backgroundColor: '#0E0E0E' }}
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
                  className="text-bb-cream font-normal text-[15px] tracking-[0.01em] uppercase"
                  style={{ fontFamily: font }}
                >
                  Details sent
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-white/45 font-normal text-[13px] tracking-[0.01em] mt-1 italic"
                  style={{ fontFamily: font }}
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

          <div className="flex-1 overflow-y-auto px-6">
            {/* Header */}
            <div className="flex items-center justify-between mt-8 mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-bb-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/60 mb-10" />

            {/* Subtitle */}
            <p
              className="text-bb-muted text-[10px] uppercase tracking-[0.25em] text-center mb-10"
              style={{ fontFamily: font }}
            >
              Send {firstName} your details
            </p>

            {/* Form */}
            <div className="max-w-[400px] mx-auto">
              {/* Name */}
              <div className="mb-8">
                <p
                  className="text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]"
                  style={{ fontFamily: font }}
                >
                  Your Name *
                </p>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Full name"
                  autoFocus
                  className="text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] tracking-[0.01em] placeholder:text-muted-foreground/25"
                  style={{ fontFamily: font }}
                />
              </div>

              {/* Email or Phone */}
              <div className="mb-8">
                <p
                  className="text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]"
                  style={{ fontFamily: font }}
                >
                  Email or Phone *
                </p>
                <input
                  type="text"
                  value={form.emailOrPhone}
                  onChange={set('emailOrPhone')}
                  placeholder="How to reach you"
                  className="text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic tracking-[0.01em] placeholder:text-muted-foreground/25"
                  style={{ fontFamily: font }}
                />
              </div>

              {/* Note */}
              <div className="mb-10">
                <p
                  className="text-bb-muted font-medium text-[11px] uppercase mb-3 tracking-[0.2em]"
                  style={{ fontFamily: font }}
                >
                  Note
                </p>
                <textarea
                  value={form.note}
                  onChange={set('note')}
                  placeholder="Anything worth remembering..."
                  rows={3}
                  className="text-bb-dark font-normal w-full bg-transparent outline-none border-b border-border/60 pb-3 text-[20px] italic leading-relaxed resize-none placeholder:text-muted-foreground/25"
                  style={{ fontFamily: font }}
                />
              </div>

              {/* Send button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={`font-helvetica font-normal ${canSend ? 'bg-bb-dark cursor-pointer' : 'bg-bb-dark/15 cursor-not-allowed'} text-bb-cream w-full py-5 uppercase tracking-[0.12em] text-[11px] transition-colors relative overflow-hidden grain-overlay`}
              >
                Send My Details
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExchangeDetailsModal;
