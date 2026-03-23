'use client';

import { useState } from 'react';
import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { X } from 'lucide-react';

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
}

const EMPTY_BUTTON: ButtonItem = { label: '', url: null, style: 'secondary' };

const PREVIEW_VIEWS = [
  {
    key: 'owner',
    label: 'Your view',
    primary: 'Share Profile',
    secondary: 'Edit Profile',
  },
  {
    key: 'member',
    label: 'Member view',
    primary: 'Add to Vault',
    secondary: 'Exchange Details',
  },
  {
    key: 'guest',
    label: 'Guest view',
    primary: 'Save Contact',
    secondary: 'Exchange Details',
  },
] as const;

function DynamicPreview() {
  const [active, setActive] = useState<'owner' | 'member' | 'guest'>('owner');
  const view = PREVIEW_VIEWS.find((v) => v.key === active)!;

  return (
    <div className="space-y-3 pb-4 border-b border-bb-rule">
      <div className="flex items-center justify-between">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
          Dynamic buttons
        </span>
        <div className="flex gap-3">
          {PREVIEW_VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setActive(v.key)}
              className={
                active === v.key
                  ? 'font-helvetica text-[9px] uppercase tracking-[0.12em] text-foreground'
                  : 'font-helvetica text-[9px] uppercase tracking-[0.12em] text-bb-muted/40 hover:text-bb-muted transition-colors'
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none space-y-2 opacity-50">
        <div className="bb-btn-primary flex items-center justify-center">{view.primary}</div>
        <div className="border border-bb-rule py-3 w-full font-helvetica text-[11px] uppercase tracking-widest text-foreground text-center">
          {view.secondary}
        </div>
      </div>
    </div>
  );
}

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
      <DynamicPreview />

      <div className="space-y-1">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
          Custom buttons
        </span>
      </div>

      <div className="space-y-4">
        {localData.buttons.map((btn, i) => (
          <div key={i} className="space-y-4 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Button {i + 1}
              </span>
              <button
                onClick={() => removeButton(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Label
              </Text>
              <Input
                variant="primary"
                placeholder="Label"
                value={btn.label}
                onChange={(e) => updateButton(i, { label: e.target.value })}
              />
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                URL
              </Text>
              <Input
                variant="primary"
                placeholder="URL (optional)"
                value={btn.url ?? ''}
                onChange={(e) => updateButton(i, { url: e.target.value || null })}
              />
            </div>
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
