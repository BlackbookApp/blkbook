'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyExchangesAction,
  acceptExchangeAction,
  getHasExchangedAction,
} from '@/app/actions/exchanges';
import type { Exchange } from '@/lib/data/exchanges';

export function useExchanges() {
  return useQuery<Exchange[]>({
    queryKey: ['exchanges'],
    queryFn: getMyExchangesAction,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAcceptExchange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exchangeId: string) => acceptExchangeAction(exchangeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchanges'] });
      queryClient.invalidateQueries({ queryKey: ['vault-contacts'] });
    },
  });
}

export function useHasExchanged(profileId: string) {
  return useQuery<boolean>({
    queryKey: ['has-exchanged', profileId],
    queryFn: () => getHasExchangedAction(profileId),
    enabled: !!profileId,
    staleTime: Infinity, // exchange is permanent — no need to refetch
  });
}
