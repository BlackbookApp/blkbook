'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { Text } from '@/components/ui/text';

interface LogoData {
  url: string | null;
  label: string | null;
}

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

export function LogoEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<LogoData>(component);

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <div>
          <Text variant="label-micro" as="label" className="block mb-1">
            Logo
          </Text>
          <ImageUpload
            value={localData.url}
            onChange={(url) => onChange({ ...localData, url })}
            bucket="portfolio"
            buildPath={(userId, file) => {
              const ext = file.name.split('.').pop() ?? 'png';
              return `${userId}/logo.${ext}`;
            }}
            aspect="aspect-[3/1]"
            label="Upload logo"
            fit="contain"
          />
        </div>
        <div>
          <Text variant="label-micro" as="label" className="block mb-1">
            Label
          </Text>
          <Input
            variant="primary"
            placeholder="Shown if no image"
            value={localData.label ?? ''}
            onChange={(e) => onChange({ ...localData, label: e.target.value || null })}
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
