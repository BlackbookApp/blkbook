'use client';

import { useComponentEditor } from '@/hooks/use-component-editor';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { Text } from '@/components/ui/text';
import { X } from 'lucide-react';

interface PortfolioItem {
  title: string;
  image_url: string | null;
  url: string | null;
}

interface PortfolioCardData {
  items: PortfolioItem[];
}

interface ProfileComponent {
  id: string;
  data: unknown;
}

const EMPTY_ITEM: PortfolioItem = { title: '', image_url: null, url: null };

export function PortfolioCardEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<PortfolioCardData>(component);

  const updateItem = (index: number, updates: Partial<PortfolioItem>) => {
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
      <div className="space-y-6">
        {localData.items.map((item, i) => (
          <div key={i} className="space-y-4 border-l border-bb-rule pl-4">
            <div className="flex items-center justify-between">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted">
                Project {i + 1}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="font-helvetica text-[10px] text-bb-muted/60 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Title
              </Text>
              <Input
                variant="primary"
                placeholder="Title"
                value={item.title}
                onChange={(e) => updateItem(i, { title: e.target.value })}
              />
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Image
              </Text>
              <ImageUpload
                value={item.image_url}
                onChange={(url) => updateItem(i, { image_url: url })}
                bucket="portfolio"
                buildPath={(userId, file) => {
                  const ext = file.name.split('.').pop() ?? 'jpg';
                  return `${userId}/portfolio-${Date.now()}-${i}.${ext}`;
                }}
                aspect="aspect-[4/3]"
                label="Upload image"
              />
            </div>
            <div>
              <Text variant="label-micro" as="label" className="block mb-1">
                Link
              </Text>
              <Input
                variant="primary"
                placeholder="Link URL"
                value={item.url ?? ''}
                onChange={(e) => updateItem(i, { url: e.target.value || null })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted hover:text-foreground transition-colors"
      >
        + Add project
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
