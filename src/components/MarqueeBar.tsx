"use client";

// §5.2 — pasek atrakcji: marquee 40 s/pętla, pauza na hover, kierunek podąża
// za kierunkiem scrolla. Render tylko pozycji potwierdzonych (confirmed: true).

import { marqueeItems } from "@/data/content";
import { useGsapSection } from "@/lib/useGsap";

function Sequence() {
  // powielenie listy, żeby połówka toru była szersza niż viewport
  const repeated = Array.from({ length: 4 }, () => marqueeItems).flat();
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {repeated.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="text-sm uppercase tracking-[0.28em] text-cream-dim">{item}</span>
          <span className="text-[9px] text-gold" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeBar() {
  const ref = useGsapSection<HTMLDivElement>(({ el, gsap, ScrollTrigger }) => {
    const track = el.querySelector<HTMLElement>("[data-track]");
    if (!track) return;
    const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
    // duży zapas playheada: przy timeScale -1 (scroll w górę) tween może grać
    // wstecz godzinami zamiast utknąć na totalTime 0 i zamrozić taśmę
    tween.totalTime(40 * 600, true);
    let dir = 1;
    let hovered = false;
    ScrollTrigger.create({
      onUpdate(self) {
        dir = self.direction; // subtelna zmiana kierunku za scrollem
        if (!hovered) gsap.to(tween, { timeScale: dir, duration: 0.6, overwrite: true });
      },
    });
    const enter = () => {
      hovered = true;
      gsap.to(tween, { timeScale: 0, duration: 0.35, overwrite: true });
    };
    const leave = () => {
      hovered = false;
      gsap.to(tween, { timeScale: dir, duration: 0.35, overwrite: true });
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  });

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y border-line bg-ink-soft py-3.5"
      aria-hidden="true"
    >
      <div data-track className="marquee-track flex w-max">
        <Sequence />
        <Sequence />
      </div>
    </div>
  );
}
