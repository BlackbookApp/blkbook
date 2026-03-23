'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/hooks/use-image-upload';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: 'avatars' | 'portfolio';
  buildPath: (userId: string, file: File) => string;
  /** Tailwind aspect class e.g. "aspect-square", "aspect-[3/4]" */
  aspect?: string;
  label?: string;
  fit?: 'cover' | 'contain';
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  buildPath,
  aspect = 'aspect-[3/4]',
  label = 'Upload image',
  fit = 'cover',
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, uploadError } = useImageUpload({ bucket, buildPath });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
    // reset so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="space-y-1.5">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div
        className={cn('relative w-full overflow-hidden border border-bb-rule bg-muted/20', aspect)}
      >
        {value ? (
          <>
            <img
              src={value}
              alt=""
              className={cn('w-full h-full', fit === 'contain' ? 'object-contain' : 'object-cover')}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity bg-foreground/10">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-8 h-8 flex items-center justify-center bg-background/90 border border-bb-rule"
              >
                <Upload className="w-3.5 h-3.5 text-foreground" />
              </button>
              <button
                onClick={() => onChange(null)}
                className="w-8 h-8 flex items-center justify-center bg-background/90 border border-bb-rule"
              >
                <X className="w-3.5 h-3.5 text-foreground" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
          >
            {uploading ? (
              <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted animate-pulse">
                Uploading…
              </span>
            ) : (
              <>
                <Upload className="w-4 h-4 text-bb-muted" />
                <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted">
                  {label}
                </span>
              </>
            )}
          </button>
        )}

        {/* Uploading overlay over existing image */}
        {uploading && value && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted animate-pulse">
              Uploading…
            </span>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  );
}
