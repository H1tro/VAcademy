"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

/** Gradient progress bar that animates width from 0 once in view. */
export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-brand transition-[width] duration-1000 ease-out",
          barClassName
        )}
        style={{ width: inView ? `${pct}%` : "0%" }}
      />
    </div>
  );
}