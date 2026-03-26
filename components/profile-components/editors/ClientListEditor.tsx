'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { X } from 'lucide-react';

interface ClientItem {
  name: string;
  logo_url: string | null;
}

interface ClientListData {
  items: ClientItem[];
}

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

const EMPTY_ITEM: ClientItem = { name: '', logo_url: null };

export function ClientListEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<ClientListData>(component);

  const updateItem = (index: number, updates: Partial<ClientItem>) => {
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
          <div key={i} className="space-y-4 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Client {i + 1}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Name
              </Text>
              <Input
                variant="primary"
                placeholder="Client name"
                value={item.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
              />
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Logo URL
              </Text>
              <Input
                variant="primary"
                placeholder="Image URL (optional)"
                value={item.logo_url ?? ''}
                onChange={(e) => updateItem(i, { logo_url: e.target.value || null })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add client
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
