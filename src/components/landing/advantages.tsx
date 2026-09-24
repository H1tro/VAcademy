"use client";

import { useTranslations } from "next-intl";
import { IconZap, IconShield, IconTarget, IconTrendingUp } from "./icons";
import { Reveal, SectionHeading } from "./reveal";

export function Advantages() {
  const t = useTranslations("landing.advantages");
  const items = [
    { icon: IconTrendingUp, key: "growth" },
    { icon: IconZap, key: "speed" },
    { icon: IconTarget, key: "trajectory" },
    { icon: IconShield, key: "feedback" },
  ];

  return (
    <section id="advantages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="advantages-title">
      <SectionHeading
        eyebrow={t("eyebrow")}
        id="advantages-title"
        title={
          <>
            {t("title")}
          </>
        }
        subtitle={t("subtitle")}
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 90}>
            <article className="card-lift h-full rounded-3xl border border-border bg-panel/60 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-gradient-brand text-white shadow-lg shadow-violet/20">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold">{t(`items.${item.key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`items.${item.key}.text`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
