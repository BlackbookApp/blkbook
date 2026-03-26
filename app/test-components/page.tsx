'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_COMPONENT_SAMPLES } from '@/config/componentSchemas';
import { DISPLAY_MAP } from '@/config/displayMap';
import { EDITOR_MAP } from '@/config/editorMap';
import { cn } from '@/lib/utils';
import type { ComponentType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

const ALL_TYPES = Object.keys(ALL_COMPONENT_SAMPLES) as ComponentType[];

// Stable fake component objects — IDs prefixed with "test-" so patchComponentData is a no-op
const TEST_COMPONENTS: ProfileComponent[] = ALL_TYPES.map((type, i) => ({
  id: `test-${type}`,
  profile_id: 'test-profile',
  type,
  data: ALL_COMPONENT_SAMPLES[type],
  position: (i + 1) * 1000,
  ai_generated: false,
  is_predefined: false,
  is_visible: true,
}));

function TestSection({ component }: { component: ProfileComponent }) {
  const [isEditing, setIsEditing] = useState(false);

  const displayEntry = DISPLAY_MAP[component.type as ComponentType];
  const editorEntry = EDITOR_MAP[component.type as ComponentType];
  if (!displayEntry || !editorEntry) return null;

  const Display = displayEntry.component;
  const Editor = editorEntry.component;

  return (
    <div className="border-b border-bb-rule last:border-b-0">
      <div className="flex items-center justify-between px-6 py-3">
        <span className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/50">
          {editorEntry.label}
        </span>
        <button
          onClick={() => setIsEditing((v) => !v)}
          className={cn(
            'font-helvetica text-[9px] uppercase tracking-[0.1em] transition-colors',
            isEditing ? 'text-foreground' : 'text-bb-muted/50 hover:text-foreground'
          )}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-6 pb-6"
          >
            <Editor component={component} />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-6 pb-6"
          >
            <Display data={component.data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TestComponentsPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-md mx-auto">
        <div className="px-6 py-8 border-b border-bb-rule">
          <p className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/50 mb-1">
            Test page
          </p>
          <h1 className="font-granjon text-xl text-foreground">All components</h1>
          <p className="font-helvetica text-[10px] text-bb-muted mt-1">
            Editing is local only — no data is saved.
          </p>
        </div>

        {TEST_COMPONENTS.map((component) => (
          <TestSection key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
}
