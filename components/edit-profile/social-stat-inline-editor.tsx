'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useComponentEditor } from '@/hooks/use-component-editor';
import {
  KNOWN_PLATFORMS,
  type KnownPlatform,
} from '@/components/public-profile/shared/profile-adapters';
import type { ProfileComponent } from '@/lib/data/components';

interface SocialStatItem {
  platform: string;
  handle: string | null;
  count: string | null;
  url: string | null;
}

interface SocialStatData {
  items: SocialStatItem[];
}

const PLATFORM_CONFIG: Record<
  KnownPlatform,
  { label: string; bg: string; placeholder: string; icon: React.ReactNode }
> = {
  instagram: {
    label: 'Instagram',
    bg: '#E1306C',
    placeholder: '@yourhandle',
    icon: (
      <svg
        width="18"
        height="18"
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
  tiktok: {
    label: 'TikTok',
    bg: '#010101',
    placeholder: '@yourhandle',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.56V6.81a4.85 4.85 0 0 1-1.07-.12z" />
      </svg>
    ),
  },
  youtube: {
    label: 'YouTube',
    bg: '#FF0000',
    placeholder: '@yourchannel',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" opacity="0.9" />
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    bg: '#0A66C2',
    placeholder: 'yourname',
    icon: (
      <svg
        width="18"
        height="18"
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
  twitter: {
    label: 'Twitter / X',
    bg: '#000000',
    placeholder: '@yourhandle',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  website: {
    label: 'Website',
    bg: '#007AFF',
    placeholder: 'yoursite.com',
    icon: (
      <svg
        width="18"
        height="18"
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
  email: {
    label: 'Email',
    bg: '#5B9BD5',
    placeholder: 'hello@you.com',
    icon: (
      <svg
        width="18"
        height="18"
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
  phone: {
    label: 'Phone',
    bg: '#34C759',
    placeholder: '+1 555 000 0000',
    icon: (
      <svg
        width="18"
        height="18"
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
  whatsapp: {
    label: 'WhatsApp',
    bg: '#25D366',
    placeholder: '+1 555 000 0000',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
};

function isKnown(platform: string): platform is KnownPlatform {
  return (KNOWN_PLATFORMS as readonly string[]).includes(platform.toLowerCase());
}

export function SocialStatInlineEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<SocialStatData>(component);
  const [showPicker, setShowPicker] = useState(false);

  const knownItems = localData.items.filter((item) => isKnown(item.platform));
  const customItems = localData.items.filter((item) => !isKnown(item.platform));

  const addedPlatforms = new Set(knownItems.map((i) => i.platform.toLowerCase() as KnownPlatform));
  const availableToAdd = KNOWN_PLATFORMS.filter((p) => !addedPlatforms.has(p));

  const commit = (known: SocialStatItem[], custom: SocialStatItem[]) => {
    onChange({ ...localData, items: [...known, ...custom] });
  };

  const updateKnown = (index: number, updates: Partial<SocialStatItem>) => {
    commit(
      knownItems.map((item, i) => (i === index ? { ...item, ...updates } : item)),
      customItems
    );
  };

  const removeKnown = (index: number) => {
    commit(
      knownItems.filter((_, i) => i !== index),
      customItems
    );
  };

  const addPlatform = (platform: KnownPlatform) => {
    commit([...knownItems, { platform, handle: null, count: null, url: null }], customItems);
    setShowPicker(false);
  };

  return (
    <div className="space-y-2">
      {knownItems.map((item, i) => {
        const key = item.platform.toLowerCase() as KnownPlatform;
        const config = PLATFORM_CONFIG[key];
        if (!config) return null;

        return (
          <div key={i}>
            <div className="flex items-center gap-3 px-4 py-3.5 border border-border">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: config.bg }}
              >
                {config.icon}
              </div>
              <span className="font-helvetica text-[11px] uppercase tracking-[0.12em] text-foreground flex-1">
                {config.label}
              </span>
              <button
                onClick={() => removeKnown(i)}
                className="text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              value={item.handle ?? ''}
              onChange={(e) => updateKnown(i, { handle: e.target.value || null })}
              placeholder={config.placeholder}
              className="w-full bg-transparent border-b border-border px-4 py-3 font-granjon text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/50 transition-colors"
            />
            <input
              value={item.count ?? ''}
              onChange={(e) => updateKnown(i, { count: e.target.value || null })}
              placeholder="Followers (e.g. 12.4K) — optional"
              className="w-full bg-transparent border-b border-border px-4 py-2.5 font-granjon text-[12px] text-muted-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/50 transition-colors"
            />
          </div>
        );
      })}

      {availableToAdd.length > 0 && (
        <div>
          {showPicker ? (
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-2">
                {availableToAdd.map((platform) => {
                  const config = PLATFORM_CONFIG[platform];
                  return (
                    <button
                      key={platform}
                      onClick={() => addPlatform(platform)}
                      className="flex items-center gap-2 border border-border px-3 py-2 hover:border-foreground/30 transition-colors"
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ backgroundColor: config.bg }}
                      >
                        <span style={{ transform: 'scale(0.72)', display: 'flex' }}>
                          {config.icon}
                        </span>
                      </div>
                      <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-foreground">
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPicker(true)}
              className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              + Add platform
            </button>
          )}
        </div>
      )}

      <div className="h-4 flex items-center">
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
    </div>
  );
}
