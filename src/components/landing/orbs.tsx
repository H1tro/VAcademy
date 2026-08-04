"use client";

import { useEffect, useRef } from "react";

/** Fixed full-screen layer of gradient orbs with scroll parallax + idle drift. */
export function Orbs() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = layerRef.current;
        if (!el) return;
        const y = window.scrollY;
        const rect = el.children;
        for (let i = 0; i < rect.length; i++) {
          const node = rect[i] as HTMLElement;
          // slow factor pushes orbs in opposite directions for depth
          node.style.transform = `translateY(${y * (i % 2 === 0 ? -0.06 : 0.09)}px)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="orb left-[-10%] top-[-5%] h-[38vmax] w-[38vmax] bg-violet/25 animate-float-slow" />
      <div className="orb right-[-12%] top-[20%] h-[34vmax] w-[34vmax] bg-cyan/20 animate-float" />
      <div className="orb bottom-[-15%] left-[20%] h-[40vmax] w-[40vmax] bg-violet/15 animate-float-slow" />
      <div className="orb left-[40%] top-[55%] h-[28vmax] w-[28vmax] bg-cyan/10 animate-float" />
    </div>
  );
}