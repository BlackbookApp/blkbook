'use client';

import { Check } from 'lucide-react';
import { useComponentEditor } from '@/hooks/use-component-editor';
import type { ProfileComponent } from '@/lib/data/components';
import type { SocialLinks } from '@/lib/data/profiles';

interface SocialStatItem {
  platform: string;
  handle: string | null;
  count: string | null;
  url: string | null;
}

interface SocialStatData {
  items: SocialStatItem[];
}

interface PlatformConfig {
  key: string;
  label: string;
  bg: string;
  placeholder: string;
  icon: React.ReactNode;
}

const CONTACT_OPTIONS: PlatformConfig[] = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    bg: '#0A66C2',
    placeholder: 'yourname',
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
    placeholder: '+1 555 000 0000',
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
    placeholder: 'hello@you.com',
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
    placeholder: '+1 555 000 0000',
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
    placeholder: 'yoursite.com',
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

const SOCIAL_OPTIONS: PlatformConfig[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    bg: '#E1306C',
    placeholder: '@yourhandle',
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
    key: 'tiktok',
    label: 'TikTok',
    bg: '#010101',
    placeholder: '@yourhandle',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.56V6.81a4.85 4.85 0 0 1-1.07-.12z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    bg: '#FF0000',
    placeholder: '@yourchannel',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <polygon points="8 17 18 12 8 7 8 17" />
      </svg>
    ),
  },
];

const CONTACT_KEYS = new Set(CONTACT_OPTIONS.map((o) => o.key));

interface StepButtonsProps {
  socialStatComponent: ProfileComponent;
  contacts: SocialLinks;
  onContactsChange: (contacts: SocialLinks) => void;
  selectedButtons: string[];
  onSelect: (buttons: string[]) => void;
  onContinue: (validButtons: string[]) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export function StepButtons({
  socialStatComponent,
  contacts,
  onContactsChange,
  selectedButtons,
  onSelect,
  onContinue,
  onBack,
  isSaving,
}: StepButtonsProps) {
  const { localData, onChange, saving, error } =
    useComponentEditor<SocialStatData>(socialStatComponent);

  const updateContact = (key: keyof SocialLinks, value: string) => {
    onContactsChange({ ...contacts, [key]: value || undefined });
  };

  const getItem = (platform: string) => localData.items.find((i) => i.platform === platform);

  const updateItem = (platform: string, field: 'handle' | 'count', value: string) => {
    const existing = localData.items.find((i) => i.platform === platform);
    if (existing) {
      onChange({
        ...localData,
        items: localData.items.map((i) =>
          i.platform === platform ? { ...i, [field]: value || null } : i
        ),
      });
    } else if (value) {
      onChange({
        ...localData,
        items: [
          ...localData.items,
          { platform, handle: null, count: null, url: null, [field]: value },
        ],
      });
    }
  };

  const toggle = (key: string) => {
    if (selectedButtons.includes(key)) {
      onSelect(selectedButtons.filter((k) => k !== key));
    } else if (selectedButtons.length < 2) {
      onSelect([...selectedButtons, key]);
    }
  };

  const handleContinue = () => {
    const validButtons = selectedButtons.filter((k) => {
      if (!CONTACT_KEYS.has(k)) return false;
      return !!contacts[k as keyof SocialLinks];
    });
    onContinue(validButtons);
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
      <div className="space-y-3 mb-8">
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

      {/* Contact buttons section */}
      <p className="font-helvetica text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
        Contact buttons
      </p>
      <p className="font-granjon text-[13px] text-muted-foreground italic mb-4">
        Choose two direct methods of contact for your profile.
      </p>

      <div className="space-y-2 mb-8">
        {CONTACT_OPTIONS.map((opt) => {
          const selected = selectedButtons.includes(opt.key);
          const isDisabled = !selected && selectedButtons.length >= 2;

          return (
            <div key={opt.key}>
              <button
                onClick={() => toggle(opt.key)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border transition-all text-left ${
                  selected
                    ? 'border-foreground bg-secondary/30'
                    : 'border-border hover:border-foreground/30'
                } ${isDisabled ? 'opacity-30' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
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
              <input
                value={contacts[opt.key as keyof SocialLinks] ?? ''}
                onChange={(e) => updateContact(opt.key as keyof SocialLinks, e.target.value)}
                placeholder={opt.placeholder}
                className="w-full bg-transparent border-b border-border px-4 py-3 font-granjon text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          );
        })}
      </div>

      {/* Socials section */}
      <p className="font-helvetica text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
        Socials
      </p>
      <p className="font-granjon text-[13px] text-muted-foreground italic mb-4">
        If you have an audience, show your follower count to make an impression.
      </p>

      <div className="space-y-2 mb-auto">
        {SOCIAL_OPTIONS.map((opt) => {
          const item = getItem(opt.key);

          return (
            <div key={opt.key}>
              <div className="flex items-center gap-3 px-4 py-3.5 border border-border">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: opt.bg }}
                >
                  {opt.icon}
                </div>
                <span className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-foreground">
                  {opt.label}
                </span>
              </div>
              <input
                value={item?.handle ?? ''}
                onChange={(e) => updateItem(opt.key, 'handle', e.target.value)}
                placeholder={opt.placeholder}
                className="w-full bg-transparent border-b border-border px-4 py-3 font-granjon text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              />
              <input
                value={item?.count ?? ''}
                onChange={(e) => updateItem(opt.key, 'count', e.target.value)}
                placeholder="Followers (e.g. 12.4K) — optional"
                className="w-full bg-transparent border-b border-border px-4 py-3 font-granjon text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          );
        })}
      </div>

      <div className="h-4 flex items-center mt-4">
        {saving && (
          <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40">
            Saving…
          </span>
        )}
        {error && (
          <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-destructive">
            {error}
          </span>
        )}
      </div>

      {/* CTAs */}
      <div className="pt-6 space-y-3">
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="w-full h-[52px] bg-foreground text-background font-helvetica uppercase tracking-[0.12em] text-[11px] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
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
