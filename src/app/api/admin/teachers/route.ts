import { NextResponse } from 'next/server';
import { requestAdmin } from '@/lib/server-auth';
import { getDb } from '@/lib/database';
import { FieldValue } from '@/lib/database';
import { z } from 'zod';

export async function GET(req: Request) {
  if (!await requestAdmin(req)) return NextResponse.json({ error: 'Доступ только администратору.' }, { status: 403 });
  try {
    const snap = await getDb().collection('teacher_applications').where('status', '==', 'pending').limit(100).get();
    return NextResponse.json(snap.docs.map(doc => ({ ...doc.data(), uid: doc.id })));
  } catch { return NextResponse.json({ error: 'Не удалось загрузить заявки.' }, { status: 503 }); }
}
export async function PATCH(req: Request) {
  const admin = await requestAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Доступ только администратору.' }, { status: 403 });
  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'Некорректный запрос.' }, { status: 400 }); }
  const parsed = z.object({ uid: z.string().min(1).max(128).regex(/^[^/]+$/), decision: z.enum(['approved', 'rejected']) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Некорректное решение.' }, { status: 400 });
  try {
    const db = getDb(); const { uid, decision } = parsed.data;
    const changed = await db.runTransaction(async tx => {
      const ref = db.doc(`teacher_applications/${uid}`);
      if ((await tx.get(ref)).data()?.status !== 'pending') return false;
      const review = { reviewedBy: admin, reviewedAt: FieldValue.serverTimestamp() };
      tx.set(ref, { status: decision, ...review }, { merge: true });
      tx.set(db.doc(`users/${uid}`), { role: decision === 'approved' ? 'teacher' : 'student', teacherStatus: decision, ...review }, { merge: true });
      return true;
    });
    return NextResponse.json({ success: changed }, { status: changed ? 200 : 409 });
  } catch { return NextResponse.json({ error: 'Не удалось сохранить решение.' }, { status: 503 }); }
}
