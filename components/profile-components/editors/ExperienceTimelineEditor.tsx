'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ExperienceItem {
  role: string;
  company: string;
  start_year: string | null;
  end_year: string | null;
  description: string | null;
}

interface ExperienceTimelineData {
  items: ExperienceItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
  ai_generated: boolean;
}

const EMPTY_ITEM: ExperienceItem = {
  role: '',
  company: '',
  start_year: null,
  end_year: null,
  description: null,
};

export function ExperienceTimelineEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } =
    useComponentEditor<ExperienceTimelineData>(component);

  const updateItem = (index: number, updates: Partial<ExperienceItem>) => {
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
      <div className="space-y-6">
        {localData.items.map((item, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Position {i + 1}
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
              placeholder="Role / title"
              value={item.role}
              onChange={(e) => updateItem(i, { role: e.target.value })}
            />
            <Input
              variant="primary"
              placeholder="Company"
              value={item.company}
              onChange={(e) => updateItem(i, { company: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                variant="primary"
                placeholder="Start year"
                value={item.start_year ?? ''}
                onChange={(e) => updateItem(i, { start_year: e.target.value || null })}
              />
              <Input
                variant="primary"
                placeholder="End year"
                value={item.end_year ?? ''}
                onChange={(e) => updateItem(i, { end_year: e.target.value || null })}
              />
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={item.description ?? ''}
              onChange={(e) => updateItem(i, { description: e.target.value || null })}
              className="bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground text-sm min-h-16"
            />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add position
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
