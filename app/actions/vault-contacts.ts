'use server';

import {
  getMyVaultContacts,
  createVaultContact,
  updateVaultContact,
  deleteVaultContact,
} from '@/lib/data/vault-contacts';
import type { VaultContactInsert } from '@/lib/data/vault-contacts';

export async function getMyVaultContactsAction() {
  return getMyVaultContacts();
}

export async function createVaultContactAction(input: VaultContactInsert) {
  return createVaultContact(input);
}

export async function updateVaultContactAction(id: string, input: Partial<VaultContactInsert>) {
  return updateVaultContact(id, input);
}

export async function deleteVaultContactAction(id: string) {
  return deleteVaultContact(id);
}
