'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';

interface ButtonItem {
  label: string;
  url: string | null;
  style: 'primary' | 'secondary' | null;
}

interface ActionButtonsSecondaryData {
  buttons: ButtonItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
  ai_generated: boolean;
}

const EMPTY_BUTTON: ButtonItem = { label: '', url: null, style: 'secondary' };

export function ActionButtonsSecondaryEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } =
    useComponentEditor<ActionButtonsSecondaryData>(component);

  const updateButton = (index: number, updates: Partial<ButtonItem>) => {
    const newButtons = localData.buttons.map((btn, i) =>
      i === index ? { ...btn, ...updates } : btn
    );
    onChange({ ...localData, buttons: newButtons });
  };

  const addButton = () => {
    onChange({ ...localData, buttons: [...localData.buttons, { ...EMPTY_BUTTON }] });
  };

  const removeButton = (index: number) => {
    onChange({ ...localData, buttons: localData.buttons.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {component.ai_generated && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/60 border border-bb-rule px-3 py-2">
          AI generated — review before publishing
        </p>
      )}
      <div className="space-y-4">
        {localData.buttons.map((btn, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Button {i + 1}
              </span>
              <button
                onClick={() => removeButton(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
            <Input
              variant="primary"
              placeholder="Label"
              value={btn.label}
              onChange={(e) => updateButton(i, { label: e.target.value })}
            />
            <Input
              variant="primary"
              placeholder="URL (optional)"
              value={btn.url ?? ''}
              onChange={(e) => updateButton(i, { url: e.target.value || null })}
            />
            <div className="flex gap-3 pt-1">
              {(['primary', 'secondary'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateButton(i, { style: s })}
                  className={
                    btn.style === s
                      ? 'font-helvetica text-[9px] uppercase tracking-[0.15em] text-foreground'
                      : 'font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/40 hover:text-bb-muted transition-colors'
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addButton}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add button
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
