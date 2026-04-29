'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { TextInput } from '@/components/ui/text-input';
import { authTokens } from './step1';

const { helvetica, card, ink, muted, hairline, hairlineSoft } = authTokens;

interface ContactButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}

const CONTACT_BUTTONS: ContactButton[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'linkedin.com/in/you',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
    id: 'whatsapp',
    label: 'WhatsApp',
    placeholder: '+44 7700 000000',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    placeholder: 'hello@you.com',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
    id: 'phone',
    label: 'Phone',
    placeholder: '+44 7700 000000',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 5.49 5.49l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'website',
    label: 'Website',
    placeholder: 'yoursite.com',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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

const CONTACT_IDS = new Set(CONTACT_BUTTONS.map((b) => b.id));

const SOCIAL_BUTTONS: ContactButton[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: '@yourhandle',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
    id: 'tiktok',
    label: 'TikTok',
    placeholder: '@yourhandle',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.56V6.81a4.85 4.85 0 0 1-1.07-.12z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    placeholder: 'youtube.com/@you',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
];

interface Step2Props {
  selectedButtons: string[];
  setSelectedButtons: (v: string[]) => void;
  buttonValues: Record<string, string>;
  setButtonValues: (v: Record<string, string>) => void;
  onContinue: () => void;
  onBack: () => void;
  isSaving?: boolean;
}

export function Step2({
  selectedButtons,
  setSelectedButtons,
  buttonValues,
  setButtonValues,
  onContinue,
  onBack,
  isSaving,
}: Step2Props) {
  const selectedContacts = selectedButtons.filter((id) => CONTACT_IDS.has(id));

  const toggle = (id: string) => {
    if (selectedButtons.includes(id)) {
      setSelectedButtons(selectedButtons.filter((b) => b !== id));
    } else if (!CONTACT_IDS.has(id) || selectedContacts.length < 2) {
      setSelectedButtons([...selectedButtons, id]);
    }
  };

  const renderRow = (btn: ContactButton, isLast: boolean) => {
    const isSelected = selectedButtons.includes(btn.id);
    const atLimit = CONTACT_IDS.has(btn.id) && !isSelected && selectedContacts.length >= 2;
    return (
      <div key={btn.id} style={{ borderBottom: isLast ? 'none' : `1px solid ${hairlineSoft}` }}>
        <button
          type="button"
          onClick={() => toggle(btn.id)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity hover:opacity-80"
          style={{ opacity: atLimit ? 0.35 : 1 }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ color: ink, border: `1px solid ${hairline}` }}
          >
            {btn.icon}
          </span>
          <span
            className="flex-1"
            style={{ fontFamily: helvetica, fontSize: '11px', color: ink, letterSpacing: '0.08em' }}
          >
            {btn.label}
          </span>
          {isSelected ? (
            <span
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: ink }}
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} style={{ color: '#fbfaf6' }} />
            </span>
          ) : (
            <span
              className="w-[18px] h-[18px] rounded-full shrink-0"
              style={{ border: `1px solid ${hairline}` }}
            />
          )}
        </button>
        <div style={{ borderTop: `1px solid ${hairlineSoft}` }}>
          <TextInput
            value={buttonValues[btn.id] ?? ''}
            onChange={(e) => setButtonValues({ ...buttonValues, [btn.id]: e.target.value })}
            placeholder={btn.placeholder}
          />
        </div>
      </div>
    );
  };

  const renderGroup = (items: ContactButton[]) => (
    <div
      className="rounded-[6px] overflow-hidden"
      style={{ background: card, border: `1px solid ${hairline}` }}
    >
      {items.map((b, i) => renderRow(b, i === items.length - 1))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-y-auto min-h-0"
    >
      <div className="flex flex-col items-center mb-8">
        <p className="font-helvetica text-[10px] uppercase tracking-[0.15em] mb-2">Your buttons</p>
        <h2 className="font-granjon text-[28px] leading-tight text-bb-dark mb-1 normal-case">
          How to <em>reach you</em>
        </h2>
      </div>

      <div className="mb-2 px-1">
        <span
          style={{
            fontFamily: helvetica,
            fontSize: '9.5px',
            color: muted,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          Contact
        </span>
      </div>
      <div className="mb-6">{renderGroup(CONTACT_BUTTONS)}</div>

      <div className="mb-2 px-1">
        <span
          style={{
            fontFamily: helvetica,
            fontSize: '9.5px',
            color: muted,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          Socials
        </span>
      </div>
      <div className="mb-8">{renderGroup(SOCIAL_BUTTONS)}</div>

      <div className="pt-2">
        <button className="bb-btn-primary" onClick={onContinue} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Continue'}
        </button>
        <button
          type="button"
          className="w-full mt-3 font-helvetica text-[11px] tracking-[0.1em] text-bb-muted/50 hover:text-foreground transition-colors text-center"
          onClick={onBack}
          disabled={isSaving}
        >
          BACK
        </button>
      </div>
    </motion.div>
  );
}
