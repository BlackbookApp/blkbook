'use client';

import { createContext, useContext } from 'react';
import type { ProfileCTAProps } from '@/components/public-profile/shared/profile-cta';

// Present only when rendering inside a public profile view.
// Display components that need interaction (e.g. ActionButtonsSecondary)
// consume this to get the data required by ProfileCTA.
export type ProfileViewContextValue = Omit<ProfileCTAProps, 'compact' | 'textOnly'>;

const ProfileViewContext = createContext<ProfileViewContextValue | null>(null);

export function ProfileViewProvider({
  value,
  children,
}: {
  value: ProfileViewContextValue;
  children: React.ReactNode;
}) {
  return <ProfileViewContext.Provider value={value}>{children}</ProfileViewContext.Provider>;
}

/** Returns null when rendered outside a public profile (editor, preview, etc.) */
export function useProfileView() {
  return useContext(ProfileViewContext);
}
