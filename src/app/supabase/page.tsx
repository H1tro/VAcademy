import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { LocaleSwitcher } from "@/i18n/LocaleSwitcher";
import { LegalLinks } from "@/components/legal/legal-links";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SupabasePage() {
  const t = await getTranslations("supabase");
  let todos: { id: string | number; name: string }[] = [];
  let status: "notConfigured" | "loadError" | null = null;
  if (!isSupabaseConfigured()) status = "notConfigured";
  else {
    try {
      const supabase = createClient(await cookies());
      const { data, error } = await supabase.from("todos").select("id, name").limit(100);
      if (error) status = "loadError";
      else todos = data ?? [];
    } catch { status = "loadError"; }
  }
  return <main id="main" className="mx-auto min-h-screen max-w-3xl space-y-6 px-5 py-10">
    <div className="flex items-center justify-between gap-4"><Link href="/" className="font-bold text-cyan">VAcademy</Link><LocaleSwitcher /></div>
    <h1 className="text-3xl font-bold">{t("title")}</h1>
    <p className="text-muted-foreground">{t("description")}</p>
    {status ? <p role="status" className="rounded-lg border border-border p-4">{t(status)}</p>
      : todos.length ? <ul className="space-y-3">{todos.map(todo => <li key={todo.id} className="rounded-lg border border-border p-4">{todo.name}</li>)}</ul>
        : <p className="text-muted-foreground">{t("empty")}</p>}
    <LegalLinks />
  </main>;
}
