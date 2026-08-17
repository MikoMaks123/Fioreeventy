"use client";

// Suma orientacyjna: count-up 400 ms, tabular-nums, stała szerokość minimalna,
// żeby licznik nie skakał (§5.4). Reduced motion => wartość docelowa od razu.

import { useEffect, useRef, useState } from "react";
import { zl } from "@/lib/format";

export default function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const dur = 400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="inline-block min-w-[6ch] text-right tabular-nums">{zl(shown)}</span>;
}
