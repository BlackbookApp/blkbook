'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Textarea } from '@/components/ui/textarea';

interface TopBioData {
  text: string | null;
}

interface ProfileComponent {
  id: string;
  data: unknown;
  ai_generated: boolean;
}

export function TopBioEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<TopBioData>(component);

  return (
    <div className="space-y-4">
      {component.ai_generated && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/60 border border-bb-rule px-3 py-2">
          AI generated — review before publishing
        </p>
      )}
      <Textarea
        placeholder="Write a short bio…"
        value={localData.text ?? ''}
        onChange={(e) => onChange({ ...localData, text: e.target.value || null })}
        className="font-granjon text-[14px] bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground min-h-24"
      />
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
