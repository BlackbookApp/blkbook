'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyVaultContactsAction,
  createVaultContactAction,
  deleteVaultContactAction,
} from '@/app/actions/vault-contacts';
import type { VaultContact } from '@/lib/data/vault-contacts';
import type { VaultContactInsert } from '@/lib/data/vault-contacts';

export function useVaultContacts() {
  return useQuery<VaultContact[]>({
    queryKey: ['vault-contacts'],
    queryFn: getMyVaultContactsAction,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateVaultContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VaultContactInsert) => createVaultContactAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-contacts'] });
    },
  });
}

export function useDeleteVaultContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVaultContactAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-contacts'] });
    },
  });
}
