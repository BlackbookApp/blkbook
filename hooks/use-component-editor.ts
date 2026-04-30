'use client';

import { useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQueryClient } from '@tanstack/react-query';
import { patchComponentData } from '@/lib/api/components';
import { useComponentEditorContext } from '@/contexts/component-editor';

interface ProfileComponent {
  id: string;
  profile_id: string;
  data: unknown;
}

export function useComponentEditor<T extends object>(component: ProfileComponent) {
  const memCtx = useComponentEditorContext();

  const [localData, setLocalData] = useState<T>(component.data as T);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Track the latest intended state so rollbacks use the right data
  const latestDataRef = useRef<T>(component.data as T);

  // useDebouncedCallback always calls the latest closure (d.current = n on every render),
  // so memCtx?.patchOverride here is always fresh.
  const save = useDebouncedCallback(async (patch: Partial<T>) => {
    if (Object.keys(patch).length === 0) return;
    setSaving(true);
    setError(null);
    try {
      if (memCtx?.patchOverride) {
        await memCtx.patchOverride(component.id, patch as Record<string, unknown>);
      } else {
        await patchComponentData(component.id, patch as Record<string, unknown>);
        queryClient.invalidateQueries({ queryKey: ['profile-components', component.profile_id] });
      }
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

      if (memCtx?.onDataChange) {
        // In-memory mode: notify parent, skip DB entirely
        memCtx.onDataChange(component.id, newData as unknown);
        return;
      }

      const patch = Object.fromEntries(
        Object.entries(newData as Record<string, unknown>).filter(
          ([k, v]) =>
            JSON.stringify(v) !== JSON.stringify((component.data as Record<string, unknown>)[k])
        )
      ) as Partial<T>;
      save(patch);
    },
    [save, component.data, component.id, memCtx]
  );

  return { localData, onChange, saving, error };
}
