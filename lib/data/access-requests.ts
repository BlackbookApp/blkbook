import 'server-only';
import { adminClient } from '@/lib/supabase/admin';

export interface AccessRequest {
  id: string;
  email: string;
  full_name: string;
  social_handle: string | null;
  brand_link: string | null;
  city: string | null;
  how_heard: string | null;
  notes: string | null;
  attempt_count: number;
  status: 'pending' | 'approved' | 'rejected';
  invite_code: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export async function getAllAccessRequests(): Promise<AccessRequest[]> {
  const { data, error } = await adminClient
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as AccessRequest[];
}

export async function getAccessRequestById(id: string): Promise<AccessRequest | null> {
  const { data, error } = await adminClient
    .from('access_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return data as AccessRequest;
}

export async function getAccessRequestByEmail(email: string): Promise<AccessRequest | null> {
  const { data, error } = await adminClient
    .from('access_requests')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as AccessRequest;
}

export async function insertAccessRequest(fields: {
  email: string;
  full_name: string;
  social_handle?: string;
  city?: string;
  how_heard?: string;
  notes?: string;
}): Promise<{ id: string } | { error: string }> {
  const existing = await getAccessRequestByEmail(fields.email);
  if (existing) {
    if (existing.status === 'approved') return { id: existing.id };

    const { error } = await adminClient
      .from('access_requests')
      .update({
        full_name: fields.full_name,
        social_handle: fields.social_handle ?? null,
        city: fields.city ?? null,
        how_heard: fields.how_heard ?? null,
        notes: fields.notes ?? null,
        status: 'pending',
        attempt_count: existing.attempt_count + 1,
        invite_code: null,
        reviewed_by: null,
        reviewed_at: null,
      })
      .eq('id', existing.id);

    if (error) return { error: error.message };
    return { id: existing.id };
  }

  const { data, error } = await adminClient
    .from('access_requests')
    .insert({
      email: fields.email,
      full_name: fields.full_name,
      social_handle: fields.social_handle ?? null,
      city: fields.city ?? null,
      how_heard: fields.how_heard ?? null,
      notes: fields.notes ?? null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateAccessRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  inviteCode?: string
): Promise<{ error: string | null }> {
  const { error } = await adminClient
    .from('access_requests')
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      invite_code: inviteCode ?? null,
    })
    .eq('id', id);

  return { error: error?.message ?? null };
}
