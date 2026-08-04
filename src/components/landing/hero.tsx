"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VLogo } from "@/components/v-logo";
import { IconArrowRight, IconPlay } from "./icons";
import { useCountUp, useInView } from "./use-in-view";
import { Reveal } from "./reveal";

const STATS = [
  { value: 24000, suffix: "+", label: "учеников растут" },
  { value: 120, suffix: "+", label: "курсов и материалов" },
  { value: 92, suffix: "%", label: "достигают целевого балла" },
];

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="text-center">
      <p className="font-mono text-3xl font-semibold text-gradient sm:text-4xl">
        {count.toLocaleString("ru-RU")}
        {suffix}
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 md:pt-24">
      <Reveal>
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-panel/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <VLogo className="h-5 w-5" />
          <span>
            Олимпиадная платформа <span className="text-cyan">нового поколения</span>
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-extrabold leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl">
          VAcademy — учись
          <br />
          со скоростью <span className="text-gradient">мысли</span>
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Персональные траектории, адаптивные курсы и измеримый прогресс.
          Превращаем подготовку к STEM-олимпиадам в систему.
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="btn-primary h-14 rounded-full px-10 text-base" asChild>
            <Link href="/register">
              Начать обучение
              <IconArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-border px-10 text-base hover:bg-white/5"
            asChild
          >
            <Link href="#courses">
              <IconPlay className="h-5 w-5 text-cyan" />
              Как это работает
            </Link>
          </Button>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <dl className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-6 rounded-3xl border border-border bg-panel/50 p-6 sm:p-8">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </dl>
      </Reveal>
    </section>
  );
}