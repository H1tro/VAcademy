"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { practiceProblems } from '@/lib/practice-problems';
import { olympiadCatalog } from '@/lib/olympiad-catalog';
import { videoResources } from '@/lib/video-resources';
import { Team } from './team';

export function PlatformDetails() {
  const t = useTranslations('features.landing');
  return <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6">
    <section className="card-surface overflow-hidden p-6 sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-cyan">{t('badge')}</p><h2 className="mt-3 font-headline text-2xl font-bold sm:text-3xl">{t('title')}</h2><p className="mt-4 max-w-2xl text-muted-foreground">{t('description')}</p><div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4">{[[practiceProblems.length, 'exercises'], [3, 'simulators'], [olympiadCatalog.length, 'olympiads'], [videoResources.length, 'videoCourses']].map(([value, key]) => <div key={key} className="rounded-xl border border-border p-5"><p className="font-mono text-3xl text-cyan">{value}</p><p className="mt-2 text-sm text-muted-foreground">{t(String(key))}</p></div>)}</div><div className="flex flex-wrap gap-3"><Button asChild><Link href="/practice">{t('tryPractice')}</Link></Button><Button variant="outline" asChild><Link href="/simulators">{t('trySimulators')}</Link></Button></div></section>
    <Team />
    <section className="rounded-3xl border border-cyan/30 bg-cyan/5 p-8"><h2 className="text-2xl font-bold">{t('teachers')}</h2><p className="my-4 max-w-2xl text-muted-foreground">{t('teachersDescription')}</p><Button asChild><Link href="/register">{t('join')}</Link></Button></section>
  </div>;
}
