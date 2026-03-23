'use client';

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

export function ProfileComponentsView({ components, profileView, theme = 'blanc' }: Props) {
  const visible = components.filter((c) => c.is_visible);

  return (
    <ProfileViewProvider value={profileView}>
      <div className="max-w-md mx-auto px-6 py-8 space-y-8" data-pg-theme={theme}>
        {visible.map((component) => {
          const entry = DISPLAY_MAP[component.type as ComponentType];
          if (!entry) return null;
          const Display = entry.component;
          return <Display key={component.id} data={component.data} />;
        })}
      </div>
    </ProfileViewProvider>
  );
}
