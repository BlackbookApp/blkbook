'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';

interface RecognitionItem {
  title: string;
  year: string | null;
  url: string | null;
}

interface RecognitionListData {
  items: RecognitionItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
  ai_generated: boolean;
}

const EMPTY_ITEM: RecognitionItem = { title: '', year: null, url: null };

export function RecognitionListEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<RecognitionListData>(component);

  const updateItem = (index: number, updates: Partial<RecognitionItem>) => {
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
      {component.ai_generated && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/60 border border-bb-rule px-3 py-2">
          AI generated — review before publishing
        </p>
      )}
      <div className="space-y-4">
        {localData.items.map((item, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Award {i + 1}
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
              placeholder="Title / award name"
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
            />
            <Input
              variant="primary"
              placeholder="Year (optional)"
              value={item.year ?? ''}
              onChange={(e) => updateItem(i, { year: e.target.value || null })}
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
        + Add recognition
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
