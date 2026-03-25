'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';

interface NowBlockData {
  text: string | null;
}

interface ProfileComponent {
  id: string;
  data: unknown;
}

export function NowBlockEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<NowBlockData>(component);

  return (
    <div className="space-y-4">
      <div>
        <Text variant="label-micro" as="label" className="block mb-1">
          Currently
        </Text>
        <Textarea
          placeholder="What are you currently focused on?"
          value={localData.text ?? ''}
          onChange={(e) => onChange({ ...localData, text: e.target.value || null })}
          className="font-granjon italic text-[14px] bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground min-h-24"
        />
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
