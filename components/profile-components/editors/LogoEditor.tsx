'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useComponentEditor } from '@/hooks/use-component-editor';
import { useImageUpload } from '@/hooks/use-image-upload';

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
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, uploadError } = useImageUpload({
    bucket: 'portfolio',
    buildPath: (userId, file) => {
      const ext = file.name.split('.').pop() ?? 'png';
      return `${userId}/logo.${ext}`;
    },
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange({ ...localData, url });
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {localData.url ? (
        <div
          className="relative w-full overflow-hidden bg-muted/20 border border-bb-rule"
          style={{ aspectRatio: '3/1' }}
        >
          <img src={localData.url} alt="" className="w-full h-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity bg-foreground/10">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center bg-background/90 border border-bb-rule"
            >
              <Upload className="w-3.5 h-3.5 text-foreground" />
            </button>
            <button
              onClick={() => onChange({ ...localData, url: null })}
              className="w-8 h-8 flex items-center justify-center bg-background/90 border border-bb-rule"
            >
              <X className="w-3.5 h-3.5 text-foreground" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted animate-pulse">
                Uploading…
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-bb-rule rounded-[4px] py-6 flex items-center justify-center gap-2.5 hover:bg-muted/20 transition-colors"
        >
          {uploading ? (
            <span className="font-helvetica text-[10px] uppercase tracking-[0.2em] text-bb-muted animate-pulse">
              Uploading…
            </span>
          ) : (
            <span className="font-helvetica text-[10px] uppercase tracking-[0.2em] text-bb-muted">
              + Upload your logo
            </span>
          )}
        </button>
      )}

      {(uploadError ?? error) && (
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-destructive">
          {uploadError ?? error}
        </span>
      )}
      {saving && (
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/40">
          Saving…
        </span>
      )}
    </div>
  );
}
