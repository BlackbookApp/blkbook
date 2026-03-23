'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';

interface ProfileHeroCenteredData {
  name: string | null;
  image_url: string | null;
  tagline: string | null;
  location: string | null;
}

interface ProfileComponent {
  id: string;
  data: unknown;
}

export function ProfileHeroCenteredEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } =
    useComponentEditor<ProfileHeroCenteredData>(component);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Input
          variant="primary"
          placeholder="Name"
          value={localData.name ?? ''}
          onChange={(e) => onChange({ ...localData, name: e.target.value || null })}
        />
        <Input
          variant="primary"
          placeholder="Tagline / role"
          value={localData.tagline ?? ''}
          onChange={(e) => onChange({ ...localData, tagline: e.target.value || null })}
        />
        <Input
          variant="primary"
          placeholder="Location"
          value={localData.location ?? ''}
          onChange={(e) => onChange({ ...localData, location: e.target.value || null })}
        />
        <ImageUpload
          value={localData.image_url}
          onChange={(url) => onChange({ ...localData, image_url: url })}
          bucket="avatars"
          buildPath={(userId, file) => {
            const ext = file.name.split('.').pop() ?? 'jpg';
            return `${userId}/avatar.${ext}`;
          }}
          aspect="aspect-[3/4]"
          label="Upload portrait"
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
