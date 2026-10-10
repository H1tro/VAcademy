"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { practiceProblems, checkAnswer } from '@/lib/practice-problems';
import type { Problem } from '@/lib/problems-data';
import { SUBJECTS } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PracticePage() {
  const t = useTranslations('features.practice');
  const nav = useTranslations('nav');
  const [subject, setSubject] = useState('all');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<{ score: number; total: number } | null>(null);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem('vacademy-practice') || 'null'); if (typeof saved?.score === 'number' && typeof saved?.total === 'number') setHistory(saved); } catch {} }, []);
  useEffect(() => {
    if (!questions.length || finished) return;
    const deadline = Date.now() + remaining * 1000;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) setFinished(true);
    }, 1000);
    return () => clearInterval(timer);
    // The deadline is set once per new session, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, finished]);
  const score = questions.filter(p => checkAnswer(answers[p.id] || '', p.correctAnswer)).length;
  useEffect(() => {
    if (!finished) return;
    const result = { score, total: questions.length }; setHistory(result);
    try { localStorage.setItem('vacademy-practice', JSON.stringify(result)); } catch {}
  }, [finished, score, questions.length]);
  function start(retry?: Problem[]) {
    const pool = retry || practiceProblems.filter(p => subject === 'all' || p.subject === subject);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const selected = shuffled.slice(0, count);
    setAnswers({}); setFinished(false); setRemaining(selected.length * 120); setQuestions(selected);
  }
  const mistakes = questions.filter(p => !checkAnswer(answers[p.id] || '', p.correctAnswer));
  return <div className="mx-auto max-w-3xl space-y-6">
    <h1 className="font-headline text-3xl font-bold">{t('title')}</h1><p className="text-muted-foreground">{t('description')}</p>
    {!questions.length ? <section className="card-surface space-y-5 p-6">
      <label className="block space-y-2"><span>{t('subject')}</span><select className="w-full rounded-lg border border-border bg-background p-3" value={subject} onChange={e => setSubject(e.target.value)}><option value="all">{t('all')}</option>{SUBJECTS.map(s => <option key={s.key} value={s.key}>{nav(s.key)}</option>)}</select></label>
      <label className="block space-y-2"><span>{t('size')}</span><select className="w-full rounded-lg border border-border bg-background p-3" value={count} onChange={e => setCount(Number(e.target.value))}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select></label>
      <p className="text-sm text-muted-foreground">{t('languageNote')}</p>
      <Button onClick={() => start()}>{t('start')}</Button>
      {history && <p>{t('last', history)}</p>}
    </section> : <>
      <div className="card-surface flex flex-wrap items-center justify-between gap-3 p-5"><strong role="status">{finished ? t('score', { score, total: questions.length }) : t('time', { minutes: Math.floor(remaining / 60), seconds: String(remaining % 60).padStart(2, '0') })}</strong><Button variant="outline" onClick={() => { setQuestions([]); setFinished(false); }}>{t('new')}</Button></div>
      {questions.map((p, i) => <section key={p.id} className="card-surface space-y-3 p-6"><h2 className="text-lg font-bold">{i + 1}. {p.title}</h2><p>{p.description}</p><label className="block space-y-2"><span className="text-sm text-muted-foreground">{t('answer')}</span><Input value={answers[p.id] || ''} disabled={finished} onChange={e => setAnswers({ ...answers, [p.id]: e.target.value })} /></label>{finished && <div className="rounded-lg bg-panel p-4"><p className={checkAnswer(answers[p.id] || '', p.correctAnswer) ? 'text-mint' : 'text-amber'}>{checkAnswer(answers[p.id] || '', p.correctAnswer) ? t('correct') : t('incorrect')} · {p.correctAnswer}</p><p className="mt-2 text-sm">{p.explanation}</p><Link href={`/ai?question=${encodeURIComponent(`Помоги понять задачу: ${p.description}. Дай подсказку, не готовый ответ.`)}`} className="mt-3 block text-cyan">{t('askAI')}</Link></div>}</section>)}
      {!finished ? <Button onClick={() => setFinished(true)}>{t('finish')}</Button> : mistakes.length > 0 && <Button onClick={() => start(mistakes)}>{t('retry')}</Button>}
    </>}
  </div>;
}
