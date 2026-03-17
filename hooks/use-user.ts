'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

async function fetchUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export function useUser() {
  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}
