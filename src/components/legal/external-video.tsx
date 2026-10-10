"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { youtubeEmbed } from "@/lib/video-resources";
import { Button } from "@/components/ui/button";
export function ExternalVideo({ url, title }: { url: string; title: string }) {
  const t = useTranslations("legal");
  const [loaded, setLoaded] = useState(false);
  const src = youtubeEmbed(url);
  if (!src) return null;
  return loaded ? <iframe className="mb-3 aspect-video w-full rounded-lg" src={src} title={title}
    loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    : <div className="mb-3 space-y-3 rounded-lg border border-border bg-background/50 p-5">
      <p className="text-sm text-muted-foreground">{t("videoNotice")}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" onClick={() => setLoaded(true)}>{t("loadVideo")}</Button>
        <Link className="text-sm text-primary underline" href="/cookies">{t("cookies")}</Link>
      </div>
    </div>;
}
