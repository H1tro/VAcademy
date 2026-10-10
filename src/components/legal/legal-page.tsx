import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/i18n/LocaleSwitcher";
import { Footer } from "@/components/landing/footer";
import { VLogo } from "@/components/v-logo";
import { legalDocuments, LEGAL_OPERATOR, LEGAL_COUNTRY, providerPolicies, type LegalDocumentId } from "@/lib/legal-content";
import { LEGAL_CONTACT, LEGAL_VERSION } from "@/lib/legal-config";
import { CookiePreferences } from "./cookie-preferences";

export async function legalMetadata(document: LegalDocumentId) {
  const i = (await getLocale()) === "en" ? 1 : 0;
  return { title: `${legalDocuments[document].title[i]} | VAcademy`, description: legalDocuments[document].intro[i] };
}
export async function LegalPage({ document }: { document: LegalDocumentId }) {
  const locale = (await getLocale()) === "en" ? "en" : "ru";
  const i = locale === "en" ? 1 : 0;
  const t = await getTranslations("legal");
  const content = legalDocuments[document];
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
      <Link href="/" aria-label={t("home")} className="flex items-center gap-2 font-bold text-xl"><VLogo className="h-8 w-8" />VAcademy</Link><LocaleSwitcher />
    </div></header>
    <main id="main" className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <nav aria-label={t("navigation")} className="mb-10 flex flex-wrap gap-3">
        {(["privacy", "terms", "cookies"] as const).map(id => <Link key={id} href={`/${id}`} aria-current={id === document ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-sm ${id === document ? "border-cyan bg-cyan/10 text-cyan" : "border-border text-muted-foreground hover:text-foreground"}`}>{t(id)}</Link>)}
      </nav>
      <h1 className="max-w-4xl font-headline text-3xl font-bold leading-tight md:text-5xl">{content.title[i]}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{content.intro[i]}</p>
      <dl className="mt-7 grid gap-3 rounded-xl border border-border bg-panel/30 p-5 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">{t("operator")}</dt><dd className="mt-1">{LEGAL_OPERATOR[locale]} · {LEGAL_COUNTRY[locale]}</dd></div>
        <div><dt className="text-muted-foreground">{t("updated")}</dt><dd className="mt-1"><time dateTime={LEGAL_VERSION}>{LEGAL_VERSION}</time></dd></div>
        <div className="sm:col-span-2"><dt className="text-muted-foreground">{t("contact")}</dt><dd className="mt-1 break-all"><a className="text-cyan underline" href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a></dd></div>
      </dl>
      <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside><nav aria-label={t("contents")} className="lg:sticky lg:top-6"><h2 className="mb-4 font-semibold">{t("contents")}</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">{content.sections.map(([id, title]) => <li key={id}><a href={`#${id}`} className="hover:text-cyan">{title[i]}</a></li>)}</ul>
        </nav></aside>
        <article className="min-w-0 space-y-10">
          {content.sections.map(([id, title, paragraphs]) => <section key={id} id={id} className="scroll-mt-6">
            <h2 className="mb-4 text-xl font-bold">{title[i]}</h2>
            <div className="space-y-4 leading-7 text-muted-foreground">{paragraphs.map((p, index) => <p key={index}>{p[i]}</p>)}</div>
            {document === "privacy" && id === "providers" && <div className="mt-5"><h3 className="mb-3 font-semibold">{t("providers")}</h3><ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">{providerPolicies.map(p => <li key={p.name}><a href={p.url} rel="noopener noreferrer" target="_blank" className="text-cyan underline">{p.name}</a></li>)}</ul></div>}
            {document === "cookies" && id === "controls" && <CookiePreferences />}
          </section>)}
        </article>
      </div>
    </main><Footer />
  </div>;
}
