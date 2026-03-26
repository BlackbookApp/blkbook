'use server';

import {
  performExchange,
  acceptExchange,
  declineExchange,
  createGuestExchange,
  getMyExchanges,
  getHasExchanged,
} from '@/lib/data/exchanges';
import type { PerformExchangeInput, SharedFields } from '@/lib/data/exchanges';

export async function performExchangeAction(input: PerformExchangeInput): Promise<void> {
  return performExchange(input);
}

export async function acceptExchangeAction(exchangeId: string): Promise<void> {
  return acceptExchange(exchangeId);
}

export async function declineExchangeAction(exchangeId: string): Promise<void> {
  return declineExchange(exchangeId);
}

/**
 * Returns true if the request was created, false if deduped (same contact within 24h).
 */
export async function createGuestExchangeAction(
  recipientProfileId: string,
  initiatorFields: Pick<SharedFields, 'name' | 'contact'>,
  note?: string
): Promise<boolean> {
  return createGuestExchange(recipientProfileId, initiatorFields, note);
}

export async function getMyExchangesAction() {
  return getMyExchanges();
}

export async function getHasExchangedAction(profileId: string): Promise<boolean> {
  return getHasExchanged(profileId);
}
