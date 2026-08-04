import { IconZap, IconShield, IconTarget, IconTrendingUp } from "./icons";
import { Reveal, SectionHeading } from "./reveal";

const ITEMS = [
  {
    icon: IconTrendingUp,
    title: "Рост измерим",
    text: "Прогресс в цифрах: статистика, баллы и дельта до цели в каждом решении.",
  },
  {
    icon: IconZap,
    title: "Скорость мысли",
    text: "Адаптивные задачи подхватывают твой уровень и ускоряются вместе с тобой.",
  },
  {
    icon: IconTarget,
    title: "Личная траектория",
    text: "План от твоего уровня до призового места — без лишнего и без пропусков.",
  },
  {
    icon: IconShield,
    title: "Обратная связь",
    text: "Каждое решение проверяется: видно ошибку, разбор и как её больше не допускать.",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="advantages-title">
      <SectionHeading
        eyebrow="Почему VAcademy"
        id="advantages-title"
        title={
          <>
            Система, в которой <span className="text-gradient">рост очевиден</span>
          </>
        }
        subtitle="Мы построили обучение так, чтобы ты всегда видел, куда идёшь и сколько прошёл."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 90}>
            <article className="card-lift h-full rounded-3xl border border-border bg-panel/60 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-gradient-brand text-white shadow-lg shadow-violet/20">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}