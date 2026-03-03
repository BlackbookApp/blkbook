'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateProfile } from '@/lib/data/profiles';
import type { Profile } from '@/lib/data/profiles';

export function useProfile() {
  return useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) =>
      updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
