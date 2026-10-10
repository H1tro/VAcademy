import { NextResponse } from 'next/server';
import { requestUser } from '@/lib/server-auth';
import { getDb } from '@/lib/database';
import { FieldValue } from '@/lib/database';
import { z } from 'zod';

const schema = z.object({ displayName: z.string().trim().min(2).max(120), school: z.string().trim().min(2).max(200), reason: z.string().trim().min(10).max(1500) });
export async function GET(req: Request) {
  const uid = await requestUser(req);
  if (!uid) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  try {
    const snap = await getDb().doc(`teacher_applications/${uid}`).get();
    return NextResponse.json(snap.exists ? snap.data() : { status: 'none' });
  } catch { return NextResponse.json({ error: 'Не удалось загрузить заявку.' }, { status: 503 }); }
}
export async function POST(req: Request) {
  const uid = await requestUser(req);
  if (!uid) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'Некорректный запрос.' }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Укажите имя, школу и основание заявки.' }, { status: 400 });
  try {
    const db = getDb();
    const status = await db.runTransaction(async tx => {
      const ref = db.doc(`teacher_applications/${uid}`);
      const existing = await tx.get(ref);
      // Repeated requests cannot revoke approval or replace an application under review.
      if (existing.data()?.status === 'pending' || existing.data()?.status === 'approved') return existing.data()!.status;
      tx.set(ref, { ...parsed.data, uid, status: 'pending', createdAt: FieldValue.serverTimestamp() });
      tx.set(db.doc(`users/${uid}`), { role: 'student', teacherStatus: 'pending' }, { merge: true });
      return 'pending';
    });
    return NextResponse.json({ status });
  } catch { return NextResponse.json({ error: 'Не удалось сохранить заявку.' }, { status: 503 }); }
}
