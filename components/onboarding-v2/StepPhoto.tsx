'use client';

import { useRef } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  heroPreview: string | null;
  onChangeHero: (file: File, preview: string) => void;
}

export function StepPhoto({ heroPreview, onChangeHero }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChangeHero(file, URL.createObjectURL(file));
  };

  return (
    <div className="flex justify-center mt-6">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        onClick={() => fileRef.current?.click()}
        className="flex flex-col items-center gap-4 group"
      >
        <div
          className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center transition-colors group-hover:border-bb-muted"
          style={{ border: '2px dashed var(--bb-rule, #e4e0da)' }}
        >
          {heroPreview ? (
            <img src={heroPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Plus className="w-5 h-5 text-bb-muted" />
          )}
        </div>
        <div className="text-center space-y-1">
          <p className="font-helvetica text-[11px] font-light text-bb-muted">
            {heroPreview ? 'Change photo' : 'Upload a photo'}
          </p>
          <p className="font-helvetica text-[10px] font-light text-bb-muted/50">
            Portraits work best. Square or vertical.
          </p>
        </div>
      </button>
    </div>
  );
}
