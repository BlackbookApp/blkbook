'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileViewProvider } from '@/contexts/profile-view-context';
import { DISPLAY_MAP } from '@/config/displayMap';
import type { ProfileComponent } from '@/lib/data/components';
import type { ProfileViewContextValue } from '@/contexts/profile-view-context';
import type { ComponentType } from '@/config/roleSchemas';

interface Props {
  components: ProfileComponent[];
  profileView: ProfileViewContextValue;
  theme?: string;
}

const ScrollReveal = ({
  children,
  margin = '-80px',
}: {
  children: React.ReactNode;
  margin?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hiddenY, setHiddenY] = useState(32);

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      custom={hiddenY}
      variants={{
        hidden: (y: number) => ({
          opacity: 0,
          y,
          transition: { duration: 0 },
        }),
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      onViewportEnter={() => setIsVisible(true)}
      onViewportLeave={(entry) => {
        setHiddenY(entry && entry.boundingClientRect.top < 0 ? -32 : 32);
        setIsVisible(false);
      }}
      viewport={{ margin }}
    >
      {children}
    </motion.div>
  );
};

function hasData(data: Record<string, unknown>): boolean {
  if (!data) return false;
  return Object.values(data).some(
    (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  );
}

export function ProfileComponentsView({ components, profileView, theme = 'blanc' }: Props) {
  const DATA_EXEMPT = new Set(['profile_hero_centered', 'action_buttons_secondary']);
  const visible = components.filter(
    (c) => c.is_visible && (DATA_EXEMPT.has(c.type) || hasData(c.data as Record<string, unknown>))
  );

  const hero = visible.find((c) => c.type === 'profile_hero_centered');
  const sections = visible.filter((c) => c.type !== 'profile_hero_centered');

  return (
    <ProfileViewProvider value={profileView}>
      {/* Fixed logo */}
      <div className="fixed top-0 left-0 z-50 bb-safe-top-6 pl-6">
        <span className="font-granjon font-normal text-[12px] tracking-[0.15em] uppercase text-bb-muted">
          BLKBOOK
        </span>
      </div>

      <div className="max-w-md mx-auto px-6 pt-28 pb-10" data-pg-theme={theme}>
        {/* Hero — no divider, no py-10 */}
        {hero &&
          (() => {
            const entry = DISPLAY_MAP[hero.type as ComponentType];
            if (!entry) return null;
            const Display = entry.component;
            return <Display key={hero.id} data={hero.data} />;
          })()}

        {/* Sections — py-10 each */}
        <div>
          {sections.map((component) => {
            const entry = DISPLAY_MAP[component.type as ComponentType];
            if (!entry) return null;
            const Display = entry.component;
            return (
              <ScrollReveal key={component.id}>
                <div className="py-10">
                  <Display data={component.data} />
                </div>
              </ScrollReveal>
            );
          })}

          {/* Footer */}
          <ScrollReveal margin="0px">
            <div className="py-10 text-center">
              <span className="font-granjon font-normal text-[18px] tracking-[0.15em] uppercase">
                BLKBOOK
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </ProfileViewProvider>
  );
}
