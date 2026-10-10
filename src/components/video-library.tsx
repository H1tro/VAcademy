"use client";
import { useTranslations } from 'next-intl';
import { videoResources } from '@/lib/video-resources';
import Link from 'next/link';
export function VideoLibrary() {
  const t = useTranslations('features.videos'); const nav = useTranslations('nav');
  return <section className="card-surface space-y-4 p-6"><h2 className="text-xl font-bold">{t('title')}</h2><p className="text-sm text-muted-foreground">{t('description')}</p><div className="grid gap-3 sm:grid-cols-2">{videoResources.map(v => <a key={v.subject} href={v.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border p-4 hover:border-cyan"><p className="text-sm text-cyan">{nav(v.subject)} · MIT OCW · English</p><p className="mt-2 font-bold">{v.title} ↗</p></a>)}</div><Link href="/practice" className="inline-block text-cyan">{t('practice')} →</Link></section>;
}
