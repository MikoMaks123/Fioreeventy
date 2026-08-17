"use client";

// §5.6 — REALIZACJE: ściana magnesów (masonry, kremowe ramki, przechyły),
// kafle „przyciągane do lodówki" (back.out), hover prostuje i unosi.
// Opinie z badge PRZYKŁAD — do podmiany na prawdziwe od klientki.
// FAZA 2: galeria zdjęć z imprez dla gości (unikalny link po evencie) — ta sekcja
// dostanie wtedy podstronę /galeria/[event] zasilaną z tego samego źródła zdjęć.

import Image from "next/image";
import type { CSSProperties } from "react";
import { obrazy, opinie, sekcjaRealizacje } from "@/data/content";
import SectionHeader from "@/components/SectionHeader";
import StatsBand from "@/components/StatsBand";
import { useGsapSection, revealUp } from "@/lib/useGsap";

// stały układ przechyłów (deterministyczny — stabilna hydracja SSR)
const TILTS = [-3, 2, -1.5, 3, -2, 1, 2.5, -1, 1.5, -2.5];

export default function Realizations() {
  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-section-header]", el);
    gsap.from("[data-magnet]", {
      opacity: 0,
      y: 64,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.4)",
      stagger: { each: 0.07, from: "start" }, // stagger po przekątnej układu kolumnowego
      scrollTrigger: { trigger: el.querySelector("[data-magnet-wall]"), start: "top 80%" },
    });
    revealUp(gsap, "[data-opinia]", el.querySelector("[data-opinie]") ?? el);
  });

  return (
    <section ref={ref} id="realizacje" className="noise bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeader eyebrow={sekcjaRealizacje.eyebrow} h2={sekcjaRealizacje.h2} />

        <div data-magnet-wall className="mt-12 columns-2 gap-4 md:columns-3 xl:columns-5">
          {obrazy.galeria.map((o, i) => (
            <div key={o.src} data-magnet className="mb-4 break-inside-avoid">
              <figure
                className="magnet frame-cream relative p-2 pb-6"
                style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
              >
                <Image
                  src={o.src}
                  alt={o.alt}
                  width={o.w}
                  height={o.h}
                  loading="lazy"
                  className="aspect-square w-full rounded-[3px] object-cover"
                  sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 45vw"
                />
              </figure>
            </div>
          ))}
        </div>

        <StatsBand />

        <div data-opinie className="mt-16 grid gap-6 md:grid-cols-3">
          {opinie.map((op) => (
            <figure
              key={op.imie}
              data-opinia
              className="relative rounded-2xl border border-line bg-ink-soft/60 p-6"
            >
              {op.przyklad && (
                <span className="absolute right-4 top-4 rounded-full border border-line px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-gold">
                  {sekcjaRealizacje.badgePrzyklad}
                </span>
              )}
              <blockquote className="pr-16 font-display text-lg font-medium leading-snug text-cream">
                „{op.cytat}"
              </blockquote>
              <figcaption className="mt-4 text-sm text-cream-dim">
                {op.imie} · {op.typ}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
