"use client";
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { olympiadCatalog } from '@/lib/olympiad-catalog';
import { SUBJECTS } from '@/lib/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OlympiadsPage() {
  const t = useTranslations('features.olympiads'); const nav = useTranslations('nav');
  const locale = useLocale() === 'en' ? 'en' : 'ru';
  const [subject, setSubject] = useState('all'), [region, setRegion] = useState('all'), [search, setSearch] = useState('');
  const entries = olympiadCatalog.filter(o => (subject === 'all' || o.subjects.some(s => s === subject)) && (region === 'all' || o.region === region) && (o.title[locale] + ' ' + o.description[locale]).toLowerCase().includes(search.toLowerCase().trim()));
  return <div className="space-y-6"><h1 className="font-headline text-3xl font-bold">{t('title')}</h1><p className="text-muted-foreground">{t('description')}</p><div className="card-surface space-y-3 p-5"><p>{t('notice')}</p><p className="text-sm text-muted-foreground">{t('verified')}</p></div>
    <div className="grid gap-3 sm:grid-cols-3"><Input aria-label={t('search')} placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} /><select aria-label={t('subject')} value={subject} onChange={e => setSubject(e.target.value)} className="rounded-lg border border-border bg-background p-3"><option value="all">{t('allSubjects')}</option>{SUBJECTS.map(s => <option key={s.key} value={s.key}>{nav(s.key)}</option>)}</select><select aria-label={t('region')} value={region} onChange={e => setRegion(e.target.value)} className="rounded-lg border border-border bg-background p-3"><option value="all">{t('allRegions')}</option><option value="kg">{t('kg')}</option><option value="international">{t('international')}</option></select></div>
    <p role="status">{t('found', { count: entries.length })}</p><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{entries.map(o => <article key={o.id} className="card-surface flex flex-col space-y-4 p-6"><span className="text-sm text-cyan">{t(o.region)}</span><h2 className="text-xl font-bold">{o.title[locale]}</h2><p className="flex-1 text-sm text-muted-foreground">{o.description[locale]}</p><p className="text-sm">{t(o.participation)}</p><p className="text-xs text-muted-foreground">{o.subjects.map(s => nav(s)).join(' · ')}</p><Button variant="outline" asChild><a href={o.url} target="_blank" rel="noopener noreferrer">{t('source')} ↗</a></Button></article>)}</div>{!entries.length && <p>{t('empty')}</p>}<Button asChild><Link href="/practice">{t('practice')}</Link></Button>
  </div>;
}
