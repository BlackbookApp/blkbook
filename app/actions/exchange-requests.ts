'use server';

import {
  createExchangeRequest,
  performExchange,
  getMyExchangeRequests,
  markExchangeRequestsSeen,
} from '@/lib/data/exchange-requests';
import type { ExchangeRequestInsert, PerformExchangeInput } from '@/lib/data/exchange-requests';

export async function createExchangeRequestAction(
  profileId: string,
  input: Omit<ExchangeRequestInsert, 'profile_id'>
): Promise<void> {
  return createExchangeRequest({ profile_id: profileId, ...input });
}

export async function performExchangeAction(input: PerformExchangeInput): Promise<void> {
  return performExchange(input);
}

export async function getMyExchangeRequestsAction() {
  return getMyExchangeRequests();
}

export async function markExchangeRequestsSeenAction(ids: string[]): Promise<void> {
  return markExchangeRequestsSeen(ids);
}
