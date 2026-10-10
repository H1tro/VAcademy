"use client";
import { useEffect, useState, type FormEvent } from 'react';
import type { User } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function TeacherApplication({ user, onApproved }: { user: User; onApproved: () => void }) {
  const t = useTranslations('features.roles.approval');
  const [status, setStatus] = useState('loading'), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function refresh() {
    setError('');
    try {
      const res = await fetch('/api/teacher-applications', { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
      if (!res.ok) throw new Error();
      const data = await res.json(); setStatus(data.status);
      if (data.status === 'approved') onApproved();
    } catch { setError(t('error')); }
  }
  useEffect(() => { let active = true;
    user.getIdToken().then(token => fetch('/api/teacher-applications', { headers: { Authorization: `Bearer ${token}` } })).then(async res => {
      if (!res.ok) throw new Error(); const data = await res.json(); if (active) setStatus(data.status);
    }).catch(() => { if (active) setError(t('error')); });
    return () => { active = false; };
  }, [user, t]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError('');
    try {
      const res = await fetch('/api/teacher-applications', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify(Object.fromEntries(form)) });
      if (!res.ok) throw new Error(); const data = await res.json(); setStatus(data.status);
    } catch { setError(t('error')); } finally { setBusy(false); }
  }
  return <section className="card-surface space-y-4 p-6"><h2 className="text-xl font-bold">{t('title')}</h2><p>{t('explanation')}</p><p role="alert" className="text-destructive">{error}</p>
    {status === 'loading' ? <Button onClick={refresh}>{t('refresh')}</Button> : status === 'pending' || status === 'approved' ? <><p role="status">{t(status)}</p><Button onClick={refresh}>{t('refresh')}</Button></> : <>
      {status === 'rejected' && <p>{t('rejected')}</p>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-2"><span>{t('name')}</span><Input name="displayName" defaultValue={user.displayName || ''} required minLength={2} maxLength={120} /></label>
        <label className="block space-y-2"><span>{t('school')}</span><Input name="school" required minLength={2} maxLength={200} /></label>
        <label className="block space-y-2"><span>{t('reason')}</span><Textarea name="reason" required minLength={10} maxLength={1500} /><span className="text-sm text-muted-foreground">{t('reasonHelp')}</span></label>
        <Button disabled={busy}>{busy ? t('sending') : t('apply')}</Button>
      </form></>}
  </section>;
}
