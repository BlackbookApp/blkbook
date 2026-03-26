'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';

interface QuoteBlockData {
  text: string | null;
  attributed: string | null;
}

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

export function QuoteBlockEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<QuoteBlockData>(component);

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <div>
          <Text variant="label-micro" as="label" className="block mb-1">
            Quote
          </Text>
          <Textarea
            placeholder="Quote text"
            value={localData.text ?? ''}
            onChange={(e) => onChange({ ...localData, text: e.target.value || null })}
            className="font-granjon italic text-[14px] bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground"
          />
        </div>
        <div>
          <Text variant="label-micro" as="label" className="block mb-1">
            Attribution
          </Text>
          <Input
            variant="primary"
            placeholder="Attribution"
            value={localData.attributed ?? ''}
            onChange={(e) => onChange({ ...localData, attributed: e.target.value || null })}
          />
        </div>
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
