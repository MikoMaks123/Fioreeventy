"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type BuildFn = (args: { el: HTMLElement; gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void;

/**
 * Wspólny hook animacji sekcji. Stan końcowy = domyślny CSS, więc:
 * - bez JS strona jest w pełni widoczna (prerender/SEO),
 * - przy prefers-reduced-motion nic nie odpalamy i nic nie znika (§6).
 */
export function useGsapSection<T extends HTMLElement = HTMLElement>(
  build: BuildFn,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => build({ el, gsap, ScrollTrigger }), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Domyślne wejście sekcji (§6): opacity 0→1, y 32→0, 0.9s power3.out, trigger top 78%. */
export function revealUp(
  g: typeof gsap,
  targets: gsap.TweenTarget,
  trigger: Element,
  vars: gsap.TweenVars = {},
) {
  g.from(targets, {
    opacity: 0,
    y: 32,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: { trigger, start: "top 78%" },
    ...vars,
  });
}
