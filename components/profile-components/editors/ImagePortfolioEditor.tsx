'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

interface ImageItem {
  url: string | null;
  caption: string | null;
}

interface ImagePortfolioData {
  text: string | null;
  text_attributed: string | null;
  images: ImageItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
  ai_generated: boolean;
}

const EMPTY_IMAGE: ImageItem = { url: null, caption: null };

export function ImagePortfolioEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<ImagePortfolioData>(component);

  const updateImage = (index: number, updates: Partial<ImageItem>) => {
    const newImages = localData.images.map((img, i) =>
      i === index ? { ...img, ...updates } : img
    );
    onChange({ ...localData, images: newImages });
  };

  const addImage = () => {
    onChange({ ...localData, images: [...localData.images, { ...EMPTY_IMAGE }] });
  };

  const removeImage = (index: number) => {
    onChange({ ...localData, images: localData.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {component.ai_generated && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/60 border border-bb-rule px-3 py-2">
          AI generated — review before publishing
        </p>
      )}
      <div className="space-y-2 border-l border-bb-rule pl-4">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
          Text after first image
        </span>
        <Textarea
          placeholder="Quote or note (optional)"
          value={localData.text ?? ''}
          onChange={(e) => onChange({ ...localData, text: e.target.value || null })}
          className="bg-transparent border-b border-border border-0 rounded-none px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-foreground text-sm min-h-16"
        />
        <Input
          variant="primary"
          placeholder="Attribution (optional)"
          value={localData.text_attributed ?? ''}
          onChange={(e) => onChange({ ...localData, text_attributed: e.target.value || null })}
        />
      </div>
      <div className="space-y-4">
        {localData.images.map((img, i) => (
          <div key={i} className="space-y-2 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Image {i + 1}
              </span>
              <button
                onClick={() => removeImage(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
            <ImageUpload
              value={img.url}
              onChange={(url) => updateImage(i, { url })}
              bucket="portfolio"
              buildPath={(userId, file) => {
                const ext = file.name.split('.').pop() ?? 'jpg';
                return `${userId}/portfolio-${Date.now()}-${i}.${ext}`;
              }}
              aspect="aspect-[3/4]"
              label="Upload image"
            />
            <Input
              variant="primary"
              placeholder="Caption (optional)"
              value={img.caption ?? ''}
              onChange={(e) => updateImage(i, { caption: e.target.value || null })}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addImage}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add image
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
