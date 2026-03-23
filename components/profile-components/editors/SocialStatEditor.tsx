'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import {
  KNOWN_PLATFORMS,
  type KnownPlatform,
} from '@/components/public-profile/shared/profile-adapters';

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
  data: unknown;
  ai_generated: boolean;
}

const PLATFORM_OPTIONS: { value: KnownPlatform; label: string; placeholder: string }[] = [
  { value: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
  { value: 'tiktok', label: 'TikTok', placeholder: '@yourhandle' },
  { value: 'youtube', label: 'YouTube', placeholder: '@yourchannel' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'yourname' },
  { value: 'twitter', label: 'Twitter / X', placeholder: '@yourhandle' },
  { value: 'website', label: 'Website', placeholder: 'yoursite.com' },
  { value: 'email', label: 'Email', placeholder: 'hello@you.com' },
  { value: 'phone', label: 'Phone', placeholder: '+44 7700 000000' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: '+44 7700 000000' },
];

const SELECT_CLASS =
  'w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer';

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
      {component.ai_generated && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/60 border border-bb-rule px-3 py-2">
          AI generated — review before publishing
        </p>
      )}

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
                  ×
                </button>
              </div>
              <select
                className={SELECT_CLASS}
                value={item.platform.toLowerCase()}
                onChange={(e) =>
                  updateKnown(i, { platform: e.target.value, handle: null, count: null, url: null })
                }
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
                ×
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
