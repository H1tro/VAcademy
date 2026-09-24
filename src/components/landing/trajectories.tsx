import { useTranslations } from "next-intl";
import { IconCheck } from "./icons";
import { Reveal, SectionHeading } from "./reveal";

const STEPS = [
  {
    title: "Диагностика",
    text: "Тест уровня выявляет базу и пробелы — за 30 минут получаешь точку старта.",
    mono: "01",
    key: "diagnosis",
  },
  {
    title: "Личный план",
    text: "Строим траекторию до нужного олимпиадного уровня с недельными целями.",
    mono: "02",
    key: "plan",
  },
  {
    title: "Обучение и практика",
    text: "Курсы, разборы и адаптивные задачи. Система проверяет решения и показывает ошибки.",
    mono: "03",
    key: "learning",
  },
  {
    title: "Победы и рост",
    text: "Измеримый прогресс, дипломы и уверенность на реальных олимпиадах.",
    mono: "04",
    key: "victory",
  },
];

export function Trajectories() {
  const t = useTranslations("landing.trajectories");

  return (
    <section id="trajectories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="trajectories-title">
      <SectionHeading
        eyebrow={t("eyebrow")}
        id="trajectories-title"
        title={
          <>
            {t("title")}
          </>
        }
        subtitle={t("subtitle")}
      />

      <div className="relative mx-auto mt-14 max-w-2xl">
        <div
          className="absolute bottom-4 left-[27px] top-4 w-px bg-gradient-to-b from-violet via-cyan to-mint"
          aria-hidden="true"
        />
        <ol className="space-y-8">
          {STEPS.map((step) => (
            <Reveal key={step.mono} delay={STEPS.indexOf(step) * 100}>
              <li className="relative flex gap-6">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-gradient-brand font-mono text-sm font-semibold text-white shadow-lg shadow-violet/25">
                  {step.mono}
                </div>
                <div className="flex-1 rounded-3xl border border-border bg-panel/60 p-6">
                  <h3 className="text-lg font-bold">{t(`steps.${step.key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`steps.${step.key}.text`)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal className="mt-12 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <IconCheck className="h-4 w-4 text-mint" />
          {t("measure")}
        </p>
      </Reveal>
    </section>
  );
}
