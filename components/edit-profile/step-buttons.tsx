'use client';

import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SocialLinks } from '@/lib/data/profiles';
import type { ProfileComponent } from '@/lib/data/components';
import { extractContactsFromComponents } from '@/components/public-profile/shared/profile-adapters';
import { SocialStatInlineEditor } from '@/components/edit-profile/social-stat-inline-editor';

interface ButtonOption {
  key: keyof SocialLinks;
  label: string;
  bg: string;
  icon: React.ReactNode;
}

const BUTTON_OPTIONS: ButtonOption[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    bg: '#E1306C',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    bg: '#0A66C2',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    bg: '#25D366',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    bg: '#5B9BD5',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: 'Phone',
    bg: '#34C759',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 5.49 5.49l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    key: 'website',
    label: 'Website',
    bg: '#007AFF',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

const PLACEHOLDERS: Partial<Record<keyof SocialLinks, string>> = {
  instagram: '@yourhandle',
  linkedin: 'linkedin.com/in/you',
  whatsapp: '+1 555 000 0000',
  email: 'hello@you.com',
  phone: '+1 555 000 0000',
  website: 'yoursite.com',
  tiktok: '@yourhandle',
  twitter: '@yourhandle',
};

interface StepButtonsProps {
  socialStatComponent: ProfileComponent;
  selectedButtons: string[];
  onSelect: (buttons: string[]) => void;
  onContinue: (validButtons: string[]) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export function StepButtons({
  socialStatComponent,
  selectedButtons,
  onSelect,
  onContinue,
  onBack,
  isSaving,
}: StepButtonsProps) {
  const socialLinks = extractContactsFromComponents([socialStatComponent]);
  const availableOptions = BUTTON_OPTIONS.filter((opt) => !!socialLinks[opt.key]);
  const availableKeys = new Set(availableOptions.map((o) => o.key));
  const remaining = Math.max(0, 2 - selectedButtons.length);

  const toggle = (key: string) => {
    if (selectedButtons.includes(key)) {
      onSelect(selectedButtons.filter((k) => k !== key));
    } else if (selectedButtons.length < 2) {
      onSelect([...selectedButtons, key]);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-y-auto min-h-0">
      <p className="font-helvetica text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Your buttons
      </p>
      <h1
        className="text-foreground mb-6 uppercase font-granjon"
        style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '0.01em' }}
      >
        How can people reach you?
      </h1>

      {/* Always-included rows */}
      <div className="space-y-3 mb-6">
        {[
          { label: 'Save Contact', desc: 'Lets people save your contact card to their phone' },
          { label: 'Exchange Details', desc: 'Lets people share their details with you' },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 py-3 border-b border-border/30">
            <div className="flex-1 min-w-0">
              <span className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-foreground block">
                {item.label}
              </span>
              <span className="font-granjon text-[13px] text-muted-foreground italic block mt-1">
                {item.desc}
              </span>
            </div>
            <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 shrink-0 mt-0.5">
              Included
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Choose {remaining} more
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Selectable options */}
      {availableOptions.length === 0 ? (
        <p className="font-helvetica text-[11px] text-muted-foreground text-center py-4">
          Add links below to enable more buttons.
        </p>
      ) : (
        <div className="space-y-2">
          {availableOptions.map((opt) => {
            const selected = selectedButtons.includes(opt.key);
            const isDisabled = !selected && selectedButtons.length >= 2;
            return (
              <div key={opt.key}>
                <button
                  onClick={() => toggle(opt.key)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border transition-all ${
                    selected
                      ? 'border-foreground bg-secondary/30'
                      : isDisabled
                        ? 'border-border/30 opacity-40'
                        : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: opt.bg }}
                  >
                    {opt.icon}
                  </div>
                  <span className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-foreground">
                    {opt.label}
                  </span>
                  <div className="ml-auto">
                    {selected ? (
                      <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
                        <Check className="w-3 h-3 text-foreground" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-border" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <input
                        readOnly
                        value={socialLinks[opt.key] ?? ''}
                        placeholder={PLACEHOLDERS[opt.key] ?? ''}
                        className="w-full bg-transparent border-b border-border px-4 py-3 font-granjon text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none cursor-default select-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Social links editor */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Your links
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <SocialStatInlineEditor component={socialStatComponent} />
      </div>

      {/* CTAs */}
      <div className="pt-6 space-y-3">
        <button
          className="bb-btn-primary"
          onClick={() =>
            onContinue(selectedButtons.filter((k) => availableKeys.has(k as keyof SocialLinks)))
          }
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Continue'}
        </button>
        <button
          onClick={onBack}
          disabled={isSaving}
          className="w-full py-2 font-helvetica text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground/50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
