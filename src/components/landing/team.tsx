"use client";
import { useTranslations } from "next-intl";
import { teamGroups } from "@/lib/team";

export function Team() {
  const t = useTranslations("features.team");
  return <section id="team" className="scroll-mt-24 space-y-10">
    <div><p className="text-sm font-semibold uppercase tracking-wider text-cyan">VAcademy</p>
      <h2 className="mt-3 font-headline text-3xl font-bold">{t("title")}</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("description")}</p>
    </div>
    {teamGroups.map(group => <div key={group.id} className="space-y-4">
      <h3 className="text-xl font-semibold">{t(`groups.${group.id}`)}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.positions.map(position => <article key={position.role} className="card-surface flex flex-col gap-5 p-6">
          <h4 className="text-sm font-medium text-muted-foreground">{t(`roles.${position.role}`)}</h4>
          {position.members.length ? <ul className="space-y-3">{position.members.map(member => <li key={member} className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-sm font-bold text-cyan">{t(`members.${member}`).split(" ").map(part => part[0]).slice(0, 2).join("")}</span>
            <span className="font-semibold">{t(`members.${member}`)}</span>
          </li>)}</ul> : <p className="w-fit rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-sm text-cyan">{t("vacancy")}</p>}
        </article>)}
      </div>
    </div>)}
  </section>;
}
