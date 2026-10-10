import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-server';
import { FieldValue } from 'firebase-admin/firestore';
import { BOT_SUBJECTS, BOT_CATEGORIES } from '@/lib/bot-constants';
import { z } from 'zod';

const schema = z.object({
  subject: z.string().refine(v => BOT_SUBJECTS.some(s => s.id === v)),
  category: z.string().refine(v => BOT_CATEGORIES.some(c => c.id === v)),
  message: z.string().trim().min(10).max(3000),
  userName: z.string().trim().min(1).max(100), email: z.string().trim().email().max(254),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Некорректный запрос.' }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Проверьте имя, email, предмет и сообщение (10–3000 символов).' }, { status: 400 });
  try {
    const data = parsed.data; const db = getDb();
    const subjectLabel = BOT_SUBJECTS.find(s => s.id === data.subject)!.label;
    const ticket = await db.collection('tickets').add({ ...data, source: 'web', userId: '', username: '', subjectLabel, department: data.subject, fileIds: [], replies: [], status: 'open', createdAt: FieldValue.serverTimestamp() });
    // Failure to notify must not discard an already saved ticket.
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        const config = (await db.doc(`admin_config/${data.subject}`).get()).data();
        const ids: number[] = Array.isArray(config?.chatIds) ? config.chatIds : config?.chatId ? [config.chatId] : [];
        await Promise.allSettled(ids.map(async chatId => {
          const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(5000),
            body: JSON.stringify({ chat_id: chatId, text: `Новая заявка #${ticket.id}\n${data.userName}\nEmail: ${data.email}\n${subjectLabel}\n${data.category}\n${data.message}` }),
          });
          if (!response.ok) console.error('Ticket notification failed', response.status);
        }));
      } catch { console.error('Ticket notification unavailable'); }
    }
    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch { return NextResponse.json({ error: 'Не удалось сохранить обращение. Попробуйте позже.' }, { status: 503 }); }
}
