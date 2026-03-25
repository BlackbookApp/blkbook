'use client';

import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { patchComponentData } from '@/lib/api/components';

interface ProfileComponent {
  id: string;
  data: unknown;
}

function getDiff<T extends object>(original: T, updated: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(updated as Record<string, unknown>).filter(
      ([k, v]) => JSON.stringify(v) !== JSON.stringify((original as Record<string, unknown>)[k])
    )
  ) as Partial<T>;
}

export function useComponentEditor<T extends object>(component: ProfileComponent) {
  const [localData, setLocalData] = useState<T>(component.data as T);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useDebouncedCallback(async (patch: Partial<T>) => {
    if (Object.keys(patch).length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await patchComponentData(component.id, patch as Record<string, unknown>);
    } catch {
      setError('Failed to save');
      setLocalData(component.data as T);
    } finally {
      setSaving(false);
    }
  }, 600);

  const onChange = useCallback(
    (newData: T) => {
      setLocalData(newData);
      save(getDiff(component.data as T, newData));
    },
    [save, component.data]
  );

  return { localData, onChange, saving, error };
}
