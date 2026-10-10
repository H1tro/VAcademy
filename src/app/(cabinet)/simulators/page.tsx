"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

function Parameter({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return <label className="block space-y-2"><span className="flex justify-between gap-4"><span>{label}</span><output>{value}</output></span><input className="w-full accent-cyan" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}
export default function SimulatorsPage() {
  const t = useTranslations('features.simulators');
  const [speed, setSpeed] = useState(20), [angle, setAngle] = useState(45);
  const [voltage, setVoltage] = useState(12), [resistance, setResistance] = useState(6);
  const [dominant, setDominant] = useState(0.5);
  const radians = angle * Math.PI / 180;
  const range = speed * speed * Math.sin(2 * radians) / 9.81;
  const height = speed * speed * Math.sin(radians) ** 2 / (2 * 9.81);
  const flight = 2 * speed * Math.sin(radians) / 9.81;
  const points = Array.from({ length: 61 }, (_, i) => {
    const time = flight * i / 60;
    const x = speed * Math.cos(radians) * time;
    const y = speed * Math.sin(radians) * time - 9.81 * time * time / 2;
    return `${30 + x * 440 / 180},${230 - y * 200 / 85}`;
  }).join(' ');
  return <div className="space-y-6"><h1 className="font-headline text-3xl font-bold">{t('title')}</h1><p className="text-muted-foreground">{t('description')}</p>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-surface space-y-5 p-6"><h2 className="text-xl font-bold">{t('projectile')}</h2><p className="text-sm text-muted-foreground">{t('projectileModel')}</p><Parameter label={t('speed')} value={speed} min={5} max={40} onChange={setSpeed} /><Parameter label={t('angle')} value={angle} min={5} max={85} onChange={setAngle} /><svg viewBox="0 0 500 260" role="img" aria-label={t('trajectory')} className="w-full rounded-xl bg-panel"><path d="M30 20V230H480" fill="none" stroke="currentColor" opacity="0.3" /><polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="3" /><text x="35" y="250" fill="currentColor" fontSize="11">x: 0–180 m; y: 0–85 m</text></svg><p aria-live="polite">{t('flightResult', { range: range.toFixed(1), height: height.toFixed(1), time: flight.toFixed(2) })}</p><p className="text-sm text-muted-foreground">R = v² sin(2α)/g · h = v² sin²(α)/(2g)</p><p>{t('projectileTask')}</p></section>
      <section className="card-surface space-y-5 p-6"><h2 className="text-xl font-bold">{t('ohm')}</h2><p className="text-sm text-muted-foreground">{t('ohmModel')}</p><Parameter label={t('voltage')} value={voltage} min={1} max={48} onChange={setVoltage} /><Parameter label={t('resistance')} value={resistance} min={1} max={24} onChange={setResistance} /><svg viewBox="0 0 400 160" className="w-full" role="img" aria-label={t('circuit')}><path d="M60 60H150M250 60H340V130H60V60" fill="none" stroke="#22d3ee" strokeWidth="3" /><rect x="150" y="40" width="100" height="40" fill="none" stroke="#a78bfa" strokeWidth="3" /><text x="178" y="66" fill="currentColor">{resistance} Ω</text><text x="160" y="120" fill="currentColor">{voltage} V</text></svg><div className="rounded-xl bg-panel p-5 text-2xl" aria-live="polite">I = {(voltage / resistance).toFixed(2)} A · P = {(voltage ** 2 / resistance).toFixed(2)} W</div><p className="text-sm text-muted-foreground">I = U/R · P = U²/R</p><p>{t('ohmTask')}</p></section>
      <section className="card-surface space-y-5 p-6 lg:col-span-2"><h2 className="text-xl font-bold">{t('genetics')}</h2><p className="text-sm text-muted-foreground">{t('geneticsModel')}</p><Parameter label={t('frequency')} value={dominant} min={0} max={1} step={0.01} onChange={setDominant} /><div className="grid grid-cols-3 gap-3">{[['AA', dominant ** 2], ['Aa', 2 * dominant * (1 - dominant)], ['aa', (1 - dominant) ** 2]].map(([label, fraction]) => <div key={String(label)} className="rounded-xl bg-panel p-5"><p>{label}</p><p className="text-2xl font-bold">{(Number(fraction) * 100).toFixed(1)}%</p><div className="mt-3 h-3 overflow-hidden rounded bg-background"><div className="h-full bg-cyan" style={{ width: `${Number(fraction) * 100}%` }} /></div></div>)}</div><p>p² + 2pq + q² = 1; q = 1 − p</p><p>{t('geneticsTask')}</p></section>
    </div><Button variant="outline" onClick={() => { setSpeed(20); setAngle(45); setVoltage(12); setResistance(6); setDominant(0.5); }}>{t('reset')}</Button>
  </div>;
}
