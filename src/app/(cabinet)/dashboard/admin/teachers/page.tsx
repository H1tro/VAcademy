"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { authFetch } from '@/lib/auth-fetch';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Application = { uid: string; displayName: string; school: string; reason: string };
export default function TeacherReviewPage() {
  const t = useTranslations('features.roles.approval'); const { user, loading } = useAuth();
  const [items, setItems] = useState<Application[]>([]), [allowed, setAllowed] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function load() {
    setBusy(true); setError('');
    try {
      const res = await authFetch('/api/admin/teachers');
      if (res.status === 403) { setAllowed(false); setError(t('adminOnly')); return; }
      if (!res.ok) throw new Error(); setItems(await res.json()); setAllowed(true);
    } catch { setError(t('error')); } finally { setBusy(false); }
  }
  useEffect(() => { setItems([]); setAllowed(false); if (user) void load(); }, [user]);
  async function review(uid: string, decision: 'approved' | 'rejected') {
    setBusy(true); setError('');
    try {
      const res = await authFetch('/api/admin/teachers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, decision }) });
      if (res.status === 409) { await load(); setError(t('changed')); return; }
      if (!res.ok) throw new Error(); setItems(old => old.filter(item => item.uid !== uid));
    } catch { setError(t('error')); } finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-3xl space-y-5"><h1 className="text-3xl font-bold">{t('reviewTitle')}</h1><p>{t('reviewHelp')}</p><p role="alert" className="text-destructive">{error}</p>
    {loading ? <p>{t('sending')}</p> : !user ? <Button asChild><Link href="/login">{t('signIn')}</Link></Button> : <Button disabled={busy} onClick={load}>{t('refresh')}</Button>}
    {allowed && <>{items.length === 0 && <p>{t('empty')}</p>}{items.map(item => <article key={item.uid} className="card-surface space-y-3 p-6"><h2 className="text-xl font-bold">{item.displayName}</h2><p>{item.school}</p><p className="whitespace-pre-wrap">{item.reason}</p><p className="break-all text-sm text-muted-foreground">UID: {item.uid}</p><div className="flex gap-3"><Button disabled={busy} onClick={() => review(item.uid, 'approved')}>{t('approve')}</Button><Button variant="outline" disabled={busy} onClick={() => review(item.uid, 'rejected')}>{t('reject')}</Button></div></article>)}</>}
  </div>;
}
