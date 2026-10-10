"use client";
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { practiceProblems } from '@/lib/practice-problems';
import { SUBJECTS } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { TeacherApplication } from '@/components/teacher-application';

type Assignment = { id: string; title: string; problemIds: string[] };
export default function TeacherPage() {
  const t = useTranslations('features.roles'); const nav = useTranslations('nav');
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Assignment[]>([]), [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState(''), [pending, setPending] = useState(false);
  const [subject, setSubject] = useState('mathematics'), [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (!user) { setAllowed(null); setItems([]); return; }
    let active = true;
    user.getIdToken().then(token => fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } })).then(async res => {
      if (!active) return;
      if (res.status === 403) { setAllowed(false); return; }
      if (!res.ok) throw new Error(t('loadError'));
      const data = await res.json(); if (active) { setItems(data); setAllowed(true); }
    }).catch(() => { if (active) setError(t('loadError')); });
    return () => { active = false; };
  }, [user, t]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user) return;
    const form = event.currentTarget; const title = new FormData(form).get('title');
    setPending(true); setError('');
    try {
      const res = await fetch('/api/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ title, problemIds: selected }) });
      if (!res.ok) throw new Error(t('saveError'));
      const item = await res.json(); setItems(old => [item, ...old]); setSelected([]); form.reset();
    } catch { setError(t('saveError')); } finally { setPending(false); }
  }
  return <div className="mx-auto max-w-3xl space-y-6"><h1 className="font-headline text-3xl font-bold">{t('title')}</h1><p className="text-muted-foreground">{t('description')}</p><p role="alert" className="text-destructive">{error}</p>
    {loading || (user && allowed === null && !error) ? <p>{t('loading')}</p> : !user ? <Button asChild><Link href="/login">{t('login')}</Link></Button> : allowed === false ? <TeacherApplication user={user} onApproved={() => window.location.reload()} /> : allowed && <>
      <form onSubmit={save} className="card-surface space-y-4 p-6"><label className="block space-y-2"><span>{t('assignmentTitle')}</span><Input name="title" required minLength={3} maxLength={120} /></label><label className="block space-y-2"><span>{t('subject')}</span><select value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-lg border border-border bg-background p-3">{SUBJECTS.map(s => <option key={s.key} value={s.key}>{nav(s.key)}</option>)}</select></label><p>{t('selected', { count: selected.length })}</p><div className="max-h-72 space-y-2 overflow-y-auto">{practiceProblems.filter(p => p.subject === subject).map(p => <label key={p.id} className="flex items-center gap-3 rounded-lg bg-panel p-3"><input type="checkbox" checked={selected.includes(p.id)} disabled={!selected.includes(p.id) && selected.length >= 20} onChange={e => setSelected(e.target.checked ? [...selected, p.id] : selected.filter(id => id !== p.id))} />{p.title}</label>)}</div><Button disabled={pending || !selected.length}>{pending ? t('saving') : t('save')}</Button></form>
      <h2 className="text-xl font-bold">{t('saved')}</h2>{items.length === 0 && <p>{t('empty')}</p>}{items.map(item => <section key={item.id} className="card-surface p-5"><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{t('selected', { count: item.problemIds.length })}</p><details className="mt-3"><summary className="cursor-pointer">{t('show')}</summary><ol className="list-decimal space-y-3 pl-5 pt-3">{item.problemIds.map(id => { const p = practiceProblems.find(p => p.id === id); return p && <li key={id}>{p.description}<p className="text-sm text-muted-foreground">{p.explanation}</p></li>; })}</ol></details></section>)}
    </>}
  </div>;
}
