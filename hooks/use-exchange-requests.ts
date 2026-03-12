'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyExchangeRequestsAction,
  markExchangeRequestsSeenAction,
} from '@/app/actions/exchange-requests';
import type { ExchangeRequest } from '@/lib/data/exchange-requests';

export function useExchangeRequests() {
  return useQuery<ExchangeRequest[]>({
    queryKey: ['exchange-requests'],
    queryFn: getMyExchangeRequestsAction,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMarkExchangeRequestsSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => markExchangeRequestsSeenAction(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exchange-requests'] }),
  });
}
