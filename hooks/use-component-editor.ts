'use client';

import { useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQueryClient } from '@tanstack/react-query';
import { patchComponentData } from '@/lib/api/components';

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

export function useComponentEditor<T extends object>(component: ProfileComponent) {
  const [localData, setLocalData] = useState<T>(component.data as T);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Track the latest intended state so rollbacks use the right data
  const latestDataRef = useRef<T>(component.data as T);

  const save = useDebouncedCallback(async (patch: Partial<T>) => {
    if (Object.keys(patch).length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await patchComponentData(component.id, patch as Record<string, unknown>);
      queryClient.invalidateQueries({ queryKey: ['profile-components', component.profile_id] });
    } catch {
      setError('Failed to save');
      setLocalData(latestDataRef.current);
    } finally {
      setSaving(false);
    }
  }, 600);

  const onChange = useCallback(
    (newData: T) => {
      latestDataRef.current = newData;
      setLocalData(newData);
      const patch = Object.fromEntries(
        Object.entries(newData as Record<string, unknown>).filter(
          ([k, v]) =>
            JSON.stringify(v) !== JSON.stringify((component.data as Record<string, unknown>)[k])
        )
      ) as Partial<T>;
      save(patch);
    },
    [save, component.data]
  );

  return { localData, onChange, saving, error };
}
