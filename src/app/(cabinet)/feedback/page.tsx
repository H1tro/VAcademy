"use client";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { BOT_SUBJECTS, BOT_CATEGORIES } from "@/lib/bot-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

export default function FeedbackPage() {
  const t = useTranslations('features.feedback');
  const { user } = useAuth();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setPending(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, userName: user?.displayName || values.userName }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('error'));
      setResult(t('success', { id: data.ticketId })); form.reset();
    } catch (err) { setError(err instanceof Error ? err.message : t('error')); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-2xl space-y-6">
    <h1 className="font-headline text-3xl font-bold">{t('title')}</h1><p className="text-muted-foreground">{t('description')}</p>
    <form onSubmit={submit} className="card-surface space-y-5 p-6">
      <label className="block space-y-2"><span>{t('name')}</span><Input name="userName" required maxLength={100} defaultValue={user?.displayName || ''} /></label>
      <label className="block space-y-2"><span>{t('email')}</span><Input name="email" type="email" required maxLength={254} defaultValue={user?.email || ''} /></label>
      <label className="block space-y-2"><span>{t('subject')}</span><select name="subject" className="w-full rounded-lg border border-border bg-background p-3">{BOT_SUBJECTS.map(s => <option key={s.id} value={s.id}>{t(`subjects.${s.id}`)}</option>)}</select></label>
      <label className="block space-y-2"><span>{t('category')}</span><select name="category" className="w-full rounded-lg border border-border bg-background p-3">{BOT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{t(`categories.${c.id}`)}</option>)}</select></label>
      <label className="block space-y-2"><span>{t('message')}</span><Textarea name="message" required minLength={10} maxLength={3000} rows={6} /></label>
      <p role="status" className="text-mint">{result}</p><p role="alert" className="text-destructive">{error}</p>
      <Button type="submit" disabled={pending}>{pending ? t('sending') : t('send')}</Button>
    </form>
  </div>;
}
