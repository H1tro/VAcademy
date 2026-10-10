import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/utils/supabase/config';

export async function requestUser(req: Request): Promise<string | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  try {
    const { url, key } = getSupabaseConfig();
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(token);
    return error ? null : data.user?.id ?? null;
  } catch { return null; }
}

/** Trusted administrator IDs are configured on the server, never in a profile. */
export async function requestAdmin(req: Request): Promise<string | null> {
  const uid = await requestUser(req);
  const trusted = (process.env.ADMIN_UIDS || '').split(',').map(id => id.trim()).filter(Boolean);
  return uid && trusted.includes(uid) ? uid : null;
}
