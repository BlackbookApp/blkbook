'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EDITOR_MAP } from '@/config/editorMap';
import { REQUIRED_COMPONENTS } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';
import type { RoleType } from '@/config/roleSchemas';

interface Props {
  components: ProfileComponent[];
  roleType: RoleType;
}

export function ProfileEditor({ components, roleType }: Props) {
  const [activeId, setActiveId] = useState<string>(components[0]?.id ?? '');

  const active = components.find((c) => c.id === activeId);
  const config = active ? EDITOR_MAP[active.type as keyof typeof EDITOR_MAP] : null;
  const required = REQUIRED_COMPONENTS[roleType] ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal nav — scrollable strip */}
      <nav className="flex gap-2 px-6 py-3 overflow-x-auto border-b border-bb-rule scrollbar-none">
        {components.map((c) => {
          const entry = EDITOR_MAP[c.type as keyof typeof EDITOR_MAP];
          const isActive = c.id === activeId;
          const isRequired = required.includes(c.type as (typeof required)[number]);

          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] transition-all',
                isActive ? 'border-foreground bg-background' : 'border-bb-rule bg-transparent'
              )}
            >
              <span
                className={cn(
                  'font-helvetica text-[9px] uppercase tracking-[0.15em] whitespace-nowrap',
                  isActive ? 'text-foreground font-medium' : 'text-bb-muted font-light'
                )}
              >
                {entry?.label ?? c.type}
              </span>
              {isRequired && <span className="font-helvetica text-[8px] text-bb-muted/60">✱</span>}
              {c.ai_generated && (
                <span className="font-helvetica text-[7px] uppercase tracking-[0.1em] text-bb-muted/60 border border-bb-rule px-1">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Editor panel */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {active && config ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="blackbook-label mb-1">Editing</p>
              <div className="h-px bg-bb-rule mb-4" />
              <h2 className="font-granjon text-[22px] tracking-tight uppercase text-foreground mb-1">
                {config.label}.
              </h2>
              <p className="font-helvetica text-[11px] font-light text-bb-muted mb-6">
                {config.description}
              </p>
              <config.component component={active} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-32"
            >
              <p className="font-helvetica text-[10px] uppercase tracking-[0.2em] text-bb-muted/40">
                Select a section above
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
