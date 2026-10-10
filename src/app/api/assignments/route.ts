import { NextResponse } from 'next/server';
import { requestUser } from '@/lib/server-auth';
import { getDb } from '@/lib/firebase-server';
import { FieldValue } from 'firebase-admin/firestore';
import { problemsData } from '@/lib/problems-data';
import { z } from 'zod';
import { isApprovedTeacher } from '@/lib/teacher-access';

const schema = z.object({ title: z.string().trim().min(3).max(120), problemIds: z.array(z.string()).min(1).max(20) });
export async function GET(req: Request) {
  const uid = await requestUser(req);
  if (!uid) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  try {
    const db = getDb();
    if (!isApprovedTeacher((await db.doc(`users/${uid}`).get()).data())) return NextResponse.json({ error: 'Требуется подтверждение учителя.' }, { status: 403 });
    const snap = await db.collection('assignments').where('teacherId', '==', uid).limit(50).get();
    return NextResponse.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch { return NextResponse.json({ error: 'Не удалось загрузить задания.' }, { status: 503 }); }
}
export async function POST(req: Request) {
  const uid = await requestUser(req);
  if (!uid) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'Некорректный запрос.' }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success || parsed.data.problemIds.some(id => !problemsData.some(p => p.id === id))) return NextResponse.json({ error: 'Проверьте название и список задач.' }, { status: 400 });
  try {
    const db = getDb();
    if (!isApprovedTeacher((await db.doc(`users/${uid}`).get()).data())) return NextResponse.json({ error: 'Требуется подтверждение учителя.' }, { status: 403 });
    const ref = await db.collection('assignments').add({ ...parsed.data, teacherId: uid, createdAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ id: ref.id, ...parsed.data });
  } catch { return NextResponse.json({ error: 'Не удалось сохранить задание.' }, { status: 503 }); }
}
