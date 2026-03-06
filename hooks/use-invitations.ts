'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyInvitationsAction, createInviteAction } from '@/app/actions/invitations';
import type { Invitation } from '@/lib/data/invitations';

export function useInvitations() {
  return useQuery<Invitation[]>({
    queryKey: ['invitations'],
    queryFn: getMyInvitationsAction,
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteeEmail?: string) => createInviteAction(inviteeEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
