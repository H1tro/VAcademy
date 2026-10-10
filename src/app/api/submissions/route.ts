import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { FieldValue } from '@/lib/database';
import { problemsData, DIFFICULTY_POINTS } from '@/lib/problems-data';
import { checkAnswer } from '@/lib/practice-problems';
import { requestUser } from '@/lib/server-auth';

export async function POST(req: Request) {
  const uid = await requestUser(req);
  if (!uid) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Некорректный запрос.' }, { status: 400 }); }
  const problem = problemsData.find(p => p.id === body.problemId);
  if (!problem || typeof body.answer !== 'string' || body.answer.length > 2000 || !body.answer.trim()) return NextResponse.json({ error: 'Выберите задачу и введите ответ.' }, { status: 400 });
  const correct = checkAnswer(body.answer, problem.correctAnswer);
  try {
    const db = getDb(); const userRef = db.doc(`users/${uid}`);
    await db.runTransaction(async transaction => {
      const snapshot = await transaction.get(userRef);
      const solved: string[] = snapshot.data()?.solvedProblems || [];
      transaction.set(db.collection('submissions').doc(), {
        uid, problemId: problem.id, platform: 'internal', answer: body.answer,
        solution: String(body.solution || '').slice(0, 5000), imageUrl: String(body.imageUrl || '').slice(0, 2000),
        status: correct ? 'accepted' : 'incorrect', createdAt: FieldValue.serverTimestamp(),
      });
      if (correct && !solved.includes(problem.id)) transaction.set(userRef, {
        solvedProblems: FieldValue.arrayUnion(problem.id), tasksSolved: FieldValue.increment(1), totalScore: FieldValue.increment(DIFFICULTY_POINTS[problem.difficulty]),
        subjectProgress: { [problem.subject]: FieldValue.increment(1) },
      }, { merge: true });
    });
    return NextResponse.json({ success: true, correct, explanation: problem.explanation });
  } catch { return NextResponse.json({ error: 'Не удалось сохранить результат.' }, { status: 503 }); }
}
