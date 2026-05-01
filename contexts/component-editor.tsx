'use client';

import { createContext, useContext, useMemo } from 'react';

interface ComponentEditorContextValue {
  /** Memory mode (create wizard): capture changes without any DB write */
  onDataChange?: (componentId: string, data: unknown) => void;
  /** Admin patch mode (edit wizard): use service-role RPC instead of client Supabase */
  patchOverride?: (componentId: string, patch: Record<string, unknown>) => Promise<void>;
}

export const ComponentEditorContext = createContext<ComponentEditorContextValue | null>(null);

export function useComponentEditorContext() {
  return useContext(ComponentEditorContext);
}

export function InMemoryEditorProvider({
  children,
  onDataChange,
}: {
  children: React.ReactNode;
  onDataChange: (componentId: string, data: unknown) => void;
}) {
  const value = useMemo(() => ({ onDataChange }), [onDataChange]);
  return (
    <ComponentEditorContext.Provider value={value}>{children}</ComponentEditorContext.Provider>
  );
}

export function AdminPatchEditorProvider({
  children,
  patchOverride,
}: {
  children: React.ReactNode;
  patchOverride: (componentId: string, patch: Record<string, unknown>) => Promise<void>;
}) {
  const value = useMemo(() => ({ patchOverride }), [patchOverride]);
  return (
    <ComponentEditorContext.Provider value={value}>{children}</ComponentEditorContext.Provider>
  );
}
