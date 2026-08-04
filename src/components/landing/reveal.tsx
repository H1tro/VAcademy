"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

/** Fades a section in once it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Section header (eyebrow + title + subtitle) with consistent styling. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  id?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-3xl font-bold leading-tight md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}