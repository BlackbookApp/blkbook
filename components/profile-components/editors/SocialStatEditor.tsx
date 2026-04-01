'use client';

import { useState, useRef, useEffect } from 'react';
import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import {
  KNOWN_PLATFORMS,
  type KnownPlatform,
} from '@/components/public-profile/shared/profile-adapters';

import { X } from 'lucide-react';
interface SocialStatItem {
  platform: string;
  handle: string | null;
  count: string | null;
  url: string | null;
}

interface SocialStatData {
  items: SocialStatItem[];
}

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

const PLATFORM_OPTIONS: { value: KnownPlatform; label: string; placeholder: string }[] = [
  { value: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
  { value: 'tiktok', label: 'TikTok', placeholder: '@yourhandle' },
  { value: 'youtube', label: 'YouTube', placeholder: '@yourchannel' },
];

function PlatformSelect({
  value,
  onChange,
}: {
  value: KnownPlatform;
  onChange: (val: KnownPlatform) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PLATFORM_OPTIONS.find((p) => p.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative" onClick={() => setOpen((o) => !o)}>
        <input
          readOnly
          value={selected?.label ?? ''}
          className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors cursor-pointer"
        />
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`absolute right-0 top-1/2 -translate-y-1/2 text-bb-muted transition-transform pointer-events-none ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-bb-cream border border-bb-rule mt-1 py-1 max-h-64 overflow-y-auto shadow-sm">
          {PLATFORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 font-helvetica text-[11px] tracking-[0.04em] transition-colors hover:bg-bb-rule/60 ${
                value === opt.value ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_KNOWN: SocialStatItem = { platform: 'instagram', handle: null, count: null, url: null };
const EMPTY_CUSTOM: SocialStatItem = { platform: '', handle: null, count: null, url: null };

function isKnown(platform: string) {
  return (KNOWN_PLATFORMS as readonly string[]).includes(platform.toLowerCase());
}

export function SocialStatEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<SocialStatData>(component);

  const knownItems = localData.items.filter((item) => isKnown(item.platform));
  const customItems = localData.items.filter((item) => !isKnown(item.platform));

  const commit = (known: SocialStatItem[], custom: SocialStatItem[]) => {
    onChange({ ...localData, items: [...known, ...custom] });
  };

  const updateKnown = (index: number, updates: Partial<SocialStatItem>) => {
    commit(
      knownItems.map((item, i) => (i === index ? { ...item, ...updates } : item)),
      customItems
    );
  };

  const updateCustom = (index: number, updates: Partial<SocialStatItem>) => {
    commit(
      knownItems,
      customItems.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const addKnown = () => commit([...knownItems, { ...EMPTY_KNOWN }], customItems);
  const addCustom = () => commit(knownItems, [...customItems, { ...EMPTY_CUSTOM }]);

  const removeKnown = (index: number) =>
    commit(
      knownItems.filter((_, i) => i !== index),
      customItems
    );
  const removeCustom = (index: number) =>
    commit(
      knownItems,
      customItems.filter((_, i) => i !== index)
    );

  return (
    <div className="space-y-6">
      {/* Known platforms */}
      <div className="space-y-4">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
          Platforms
        </span>
        {knownItems.map((item, i) => {
          const platformOpt = PLATFORM_OPTIONS.find((p) => p.value === item.platform.toLowerCase());
          const handlePlaceholder = platformOpt?.placeholder ?? '@yourhandle';

          return (
            <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
              <div className="flex items-center justify-between">
                <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                  {i + 1}
                </span>
                <button
                  onClick={() => removeKnown(i)}
                  className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <PlatformSelect
                value={item.platform.toLowerCase() as KnownPlatform}
                onChange={(val) =>
                  updateKnown(i, { platform: val, handle: null, count: null, url: null })
                }
              />
              <Input
                variant="primary"
                placeholder={handlePlaceholder}
                value={item.handle ?? ''}
                onChange={(e) => updateKnown(i, { handle: e.target.value || null })}
              />
              <Input
                variant="primary"
                placeholder="Followers (e.g. 12.4K)"
                value={item.count ?? ''}
                onChange={(e) => updateKnown(i, { count: e.target.value || null })}
              />
            </div>
          );
        })}
        <button
          onClick={addKnown}
          className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
        >
          + Add platform
        </button>
      </div>

      {/* Custom links */}
      <div className="space-y-4">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
          Custom links
        </span>
        {customItems.map((item, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                {i + 1}
              </span>
              <button
                onClick={() => removeCustom(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <Input
              variant="primary"
              placeholder="Label (e.g. My Blog)"
              value={item.platform}
              onChange={(e) => updateCustom(i, { platform: e.target.value })}
            />
            <Input
              variant="primary"
              placeholder="https://..."
              value={item.url ?? ''}
              onChange={(e) => updateCustom(i, { url: e.target.value || null })}
            />
          </div>
        ))}
        <button
          onClick={addCustom}
          className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
        >
          + Add custom link
        </button>
      </div>

      <div className="flex items-center gap-2 h-4">
        {saving && (
          <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/40">
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
