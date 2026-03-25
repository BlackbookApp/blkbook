'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Options {
  bucket: 'avatars' | 'portfolio';
  buildPath: (userId: string, file: File) => string;
}

export function useImageUpload({ bucket, buildPath }: Options) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const path = buildPath(user.id, file);
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

      if (error) throw error;

      return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, uploadError };
}
