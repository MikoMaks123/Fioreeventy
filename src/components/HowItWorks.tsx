"use client";

// §5.5 — JAK TO DZIAŁA: timeline ze złotą linią rysującą się na scrollu
// (strokeDashoffset + scrub). Desktop poziomo, mobile pionowo.
// Bez JS / przy reduced-motion linia jest narysowana, węzły zapalone (stan końcowy).

import { sekcjaKroki } from "@/data/content";
import SectionHeader from "@/components/SectionHeader";
import { useGsapSection, revealUp } from "@/lib/useGsap";

export default function HowItWorks() {
  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-section-header]", el);

    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    const lines = Array.from(el.querySelectorAll<SVGLineElement>("[data-timeline-line]"));
    // stan startowy dopiero tutaj — bez JS wszystko zostaje „zapalone"
    nodes.forEach((n) => n.removeAttribute("data-active"));

    gsap.fromTo(
      lines,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector("[data-timeline]"),
          start: "top 72%",
          end: "bottom 55%",
          scrub: true,
          onUpdate(self) {
            const thresholds = [0.12, 0.5, 0.88];
            nodes.forEach((n, i) => {
              // węzły idą parami (desktop + mobile render tej samej listy)
              const step = i % sekcjaKroki.kroki.length;
              if (self.progress >= thresholds[step]) n.setAttribute("data-active", "");
              else n.removeAttribute("data-active");
            });
          },
        },
      },
    );
  });

  return (
    <section ref={ref} id="jak-to-dziala" className="noise bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeader eyebrow={sekcjaKroki.eyebrow} h2={sekcjaKroki.h2} />

        <div data-timeline className="relative mt-14">
          {/* linia pozioma (desktop) */}
          <svg
            className="absolute left-0 top-[13px] hidden h-0.5 w-full md:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(229,163,182,0.2)" strokeWidth="2" />
            <line
              data-timeline-line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="#E5A3B6"
              strokeWidth="2"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="0"
            />
          </svg>
          {/* linia pionowa (mobile) */}
          <svg
            className="absolute bottom-2 left-[13px] top-0 w-0.5 md:hidden"
            preserveAspectRatio="none"
            viewBox="0 0 2 100"
            aria-hidden="true"
          >
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(229,163,182,0.2)" strokeWidth="2" />
            <line
              data-timeline-line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="#E5A3B6"
              strokeWidth="2"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="0"
            />
          </svg>

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {sekcjaKroki.kroki.map((k, i) => (
              <li key={k.tytul} className="relative flex gap-5 md:block">
                <span
                  data-node
                  data-active=""
                  className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border border-gold/60 bg-ink text-xs font-medium text-gold transition-colors duration-500 [&[data-active]]:bg-gold [&[data-active]]:text-ink"
                >
                  {i + 1}
                </span>
                <div className="md:mt-5">
                  <h3 className="font-display text-xl font-medium text-cream">{k.tytul}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream-dim">{k.opis}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
