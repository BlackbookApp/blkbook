'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface VentureItem {
  name: string;
  years: string | null;
  role: string | null;
  description: string | null;
  detail: string | null;
  url: string | null;
  logo_url: string | null;
}

interface VentureCardData {
  items: VentureItem[];
}

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

const EMPTY_ITEM: VentureItem = {
  name: '',
  years: null,
  role: null,
  description: null,
  detail: null,
  url: null,
  logo_url: null,
};

export function VentureCardEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<VentureCardData>(component);

  const updateItem = (index: number, updates: Partial<VentureItem>) => {
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
      <div className="space-y-6">
        {localData.items.map((item, i) => (
          <div key={i} className="space-y-4 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Venture {i + 1}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div>
              <Input
                variant="primary"
                placeholder="Name"
                value={item.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
              />
            </div>
            <div>
              <Input
                variant="primary"
                placeholder="e.g. 2020 – 2024"
                value={item.years ?? ''}
                onChange={(e) => updateItem(i, { years: e.target.value || null })}
              />
            </div>
            <div>
              <Input
                variant="primary"
                placeholder="e.g. Co-Founder & CEO"
                value={item.role ?? ''}
                onChange={(e) => updateItem(i, { role: e.target.value || null })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={item.description ?? ''}
                onChange={(e) => updateItem(i, { description: e.target.value || null })}
                className="bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground text-sm min-h-16"
              />
            </div>
            <div>
              <Input
                variant="primary"
                placeholder="e.g. AI · Early stage · Stealth"
                value={item.detail ?? ''}
                onChange={(e) => updateItem(i, { detail: e.target.value || null })}
              />
            </div>
            <div>
              <Input
                variant="primary"
                placeholder="URL"
                value={item.url ?? ''}
                onChange={(e) => updateItem(i, { url: e.target.value || null })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add venture
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
