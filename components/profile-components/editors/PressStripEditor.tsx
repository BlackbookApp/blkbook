'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';

interface PressItem {
  name: string;
  logo_url: string | null;
  url: string | null;
}

interface PressStripData {
  items: PressItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
}

const EMPTY_ITEM: PressItem = { name: '', logo_url: null, url: null };

export function PressStripEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<PressStripData>(component);

  const updateItem = (index: number, updates: Partial<PressItem>) => {
    const newItems = localData.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onChange({ ...localData, items: newItems });
  };

  const addItem = () => {
    onChange({ ...localData, items: [...localData.items, { ...EMPTY_ITEM }] });
  };

  const removeItem = (index: number) => {
    onChange({ ...localData, items: localData.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {localData.items.map((item, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Publication {i + 1}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
            <Input
              variant="primary"
              placeholder="Publication name"
              value={item.name}
              onChange={(e) => updateItem(i, { name: e.target.value })}
            />
            <Input
              variant="primary"
              placeholder="Logo Image URL (optional)"
              value={item.logo_url ?? ''}
              onChange={(e) => updateItem(i, { logo_url: e.target.value || null })}
            />
            <Input
              variant="primary"
              placeholder="URL (optional)"
              value={item.url ?? ''}
              onChange={(e) => updateItem(i, { url: e.target.value || null })}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add press mention
      </button>
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
