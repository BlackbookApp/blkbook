'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileComponentsAction } from '@/app/actions/components';
import type { ProfileComponent } from '@/lib/data/components';

export function useProfileComponents(profileId: string | undefined) {
  return useQuery<ProfileComponent[]>({
    queryKey: ['profile-components', profileId],
    queryFn: () => getProfileComponentsAction(profileId!),
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvalidateProfileComponents() {
  const queryClient = useQueryClient();
  return (profileId: string) => {
    queryClient.invalidateQueries({ queryKey: ['profile-components', profileId] });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };
}
