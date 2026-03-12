import 'server-only';
import { createClient } from '@/lib/supabase/server';

export interface ExchangeRequestInsert {
  profile_id: string;
  requester_user_id?: string;
  requester_name: string;
  requester_contact: string;
  note?: string;
}

/** Guest-only: atomic check-then-insert via RPC — eliminates TOCTOU race */
export async function createExchangeRequest(data: ExchangeRequestInsert): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('create_guest_exchange_request', {
    p_profile_id: data.profile_id,
    p_requester_name: data.requester_name,
    p_requester_contact: data.requester_contact,
    p_note: data.note ?? null,
  });
  if (error) throw error;
}

export interface PerformExchangeInput {
  profileId: string;
  profileName: string;
  profileRole?: string | null;
  profilePhotoUrl?: string | null;
  profileEmail?: string | null;
  profilePhone?: string | null;
  profileInstagram?: string | null;
  profileWebsite?: string | null;
  requesterName: string;
  requesterContact: string;
  note?: string;
}

export type ExchangeRequestStatus = 'pending' | 'seen' | 'archived';

export interface ExchangeRequest {
  id: string;
  profile_id: string;
  requester_user_id: string | null;
  requester_name: string;
  requester_contact: string;
  note: string | null;
  status: ExchangeRequestStatus;
  created_at: string;
}

export async function getMyExchangeRequests(): Promise<ExchangeRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('exchange_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markExchangeRequestsSeen(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from('exchange_requests')
    .update({ status: 'seen' })
    .in('id', ids)
    .eq('status', 'pending');
  if (error) throw error;
}

/** Authenticated-only: atomically adds to vault + creates exchange request via RPC */
export async function performExchange(input: PerformExchangeInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('perform_exchange', {
    p_profile_id: input.profileId,
    p_profile_name: input.profileName,
    p_requester_name: input.requesterName,
    p_requester_contact: input.requesterContact,
    p_profile_role: input.profileRole ?? null,
    p_profile_photo_url: input.profilePhotoUrl ?? null,
    p_profile_email: input.profileEmail ?? null,
    p_profile_phone: input.profilePhone ?? null,
    p_profile_instagram: input.profileInstagram ?? null,
    p_profile_website: input.profileWebsite ?? null,
    p_note: input.note ?? null,
  });
  if (error) throw error;
}
