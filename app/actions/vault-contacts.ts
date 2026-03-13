'use server';

import {
  getMyVaultContacts,
  getVaultContactById,
  createVaultContact,
  updateVaultContact,
  deleteVaultContact,
  isProfileInVault,
} from '@/lib/data/vault-contacts';
import type { VaultContactInsert } from '@/lib/data/vault-contacts';

export async function getMyVaultContactsAction() {
  return getMyVaultContacts();
}

export async function getVaultContactByIdAction(id: string) {
  return getVaultContactById(id);
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

export async function isProfileInVaultAction(profileId: string): Promise<boolean> {
  return isProfileInVault(profileId);
}
