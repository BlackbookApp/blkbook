import 'server-only';
import { createClient } from '@/lib/supabase/server';

/** Fields snapshot stored in exchanges.initiator_shared_fields / recipient_shared_fields */
export interface SharedFields {
  name: string;
  username?: string | null;
  role?: string | null;
  photo_url?: string | null;
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  website?: string | null;
  location?: string | null;
  /** Guest-only: raw "email or phone" string */
  contact?: string | null;
}

export interface Exchange {
  id: string;
  initiator_profile_id: string | null;
  initiator_shared_fields: SharedFields;
  initiator_note: string | null;
  recipient_profile_id: string;
  recipient_shared_fields: SharedFields | null;
  recipient_note: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface PerformExchangeInput {
  recipientProfileId: string;
  recipientName: string;
  recipientRole?: string | null;
  recipientPhotoUrl?: string | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  recipientInstagram?: string | null;
  recipientTiktok?: string | null;
  recipientYoutube?: string | null;
  recipientWebsite?: string | null;
  initiatorFields: SharedFields;
  note?: string;
}

/** Authenticated member initiates a mutual exchange */
export async function performExchange(input: PerformExchangeInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('perform_exchange', {
    p_recipient_profile_id: input.recipientProfileId,
    p_recipient_name: input.recipientName,
    p_recipient_role: input.recipientRole ?? null,
    p_recipient_photo_url: input.recipientPhotoUrl ?? null,
    p_recipient_email: input.recipientEmail ?? null,
    p_recipient_phone: input.recipientPhone ?? null,
    p_recipient_instagram: input.recipientInstagram ?? null,
    p_recipient_tiktok: input.recipientTiktok ?? null,
    p_recipient_youtube: input.recipientYoutube ?? null,
    p_recipient_website: input.recipientWebsite ?? null,
    p_initiator_fields: input.initiatorFields,
    p_note: input.note ?? null,
  });
  if (error) throw error;
}

/** Recipient accepts a pending exchange — auto-shares their full profile + upserts vault */
export async function acceptExchange(exchangeId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('accept_exchange', {
    p_exchange_id: exchangeId,
  });
  if (error) throw error;
}

/** Save or update the recipient's note on a pending exchange */
export async function updateExchangeNote(exchangeId: string, note: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('exchanges')
    .update({ recipient_note: note || null })
    .eq('id', exchangeId);
  if (error) throw error;
}

/**
 * Guest initiates a one-way exchange.
 * Returns true if created, false if deduped (same contact within 24h).
 */
export async function createGuestExchange(
  recipientProfileId: string,
  initiatorFields: Pick<SharedFields, 'name' | 'contact' | 'email' | 'phone'>,
  note?: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('create_guest_exchange', {
    p_recipient_profile_id: recipientProfileId,
    p_initiator_fields: initiatorFields,
    p_note: note ?? null,
  });
  if (error) throw error;
  return data as boolean;
}

/** Recipient declines a pending exchange */
export async function declineExchange(exchangeId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('exchanges')
    .update({ status: 'declined' })
    .eq('id', exchangeId);
  if (error) throw error;
}

/** Fetch pending exchanges where current user is the recipient */
export async function getMyExchanges(): Promise<Exchange[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!profile) return [];

  const { data, error } = await supabase
    .from('exchanges')
    .select('*')
    .eq('recipient_profile_id', profile.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Exchange[];
}

/** Check if the current authenticated user already initiated an exchange with a profile */
export async function getHasExchanged(profileId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_has_exchanged', {
    p_profile_id: profileId,
  });
  if (error) throw error;
  return data as boolean;
}
