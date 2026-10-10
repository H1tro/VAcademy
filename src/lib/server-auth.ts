import { getAuth } from 'firebase-admin/auth';
import { getDb } from './firebase-server';

export async function requestUser(req: Request): Promise<string | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  try { getDb(); return (await getAuth().verifyIdToken(token, true)).uid; } catch { return null; }
}

/** Trusted administrator IDs are configured on the server, never in a profile. */
export async function requestAdmin(req: Request): Promise<string | null> {
  const uid = await requestUser(req);
  const trusted = (process.env.ADMIN_UIDS || '').split(',').map(id => id.trim()).filter(Boolean);
  return uid && trusted.includes(uid) ? uid : null;
}
