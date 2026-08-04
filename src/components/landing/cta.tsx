import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "./icons";
import { Reveal } from "./reveal";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="cta-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-panel/60 px-6 py-16 text-center sm:px-12 md:py-20">
          <div
            className="absolute inset-0 bg-gradient-to-br from-violet/25 via-transparent to-cyan/20"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">Начни прямо сейчас</p>
            <h2 id="cta-title" className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Твой рост начинается <span className="text-gradient">с первого шага</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Пройди диагностику, получи личный план — и увидь, как быстро учиться со скоростью мысли.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                <Link href="/login">Войти в аккаунт</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}