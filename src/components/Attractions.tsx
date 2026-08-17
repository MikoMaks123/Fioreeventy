"use client";

// §5.3 — ATRAKCJE: 3 karty ze zdjęciem 4:5, cena „od", rozwijane „+ Szczegóły"
// (animacja grid-template-rows, nie height).

import { useState } from "react";
import Image from "next/image";
import { atrakcje, sekcjaAtrakcje, type Atrakcja } from "@/data/content";
import { zl } from "@/lib/format";
import SectionHeader from "@/components/SectionHeader";
import { useGsapSection, revealUp } from "@/lib/useGsap";

function AttractionCard({ a }: { a: Atrakcja }) {
  const [open, setOpen] = useState(false);
  const panelId = `att-spec-${a.id}`;
  return (
    // hover przez `translate` i `scale` (osobne kanały niż inline `transform`
    // z GSAP, żeby transition nie przechwytywało klatek animacji wejścia)
    <article
      data-att-card
      className="group rounded-3xl border border-line bg-ink-soft/40 p-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-2 hover:border-gold/40 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
        <Image
          data-att-img
          src={a.img}
          alt={a.imgAlt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-[scale] duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-[2rem] font-medium leading-tight text-cream">
            {a.nazwa}
          </h3>
          <p className="mt-1.5 text-sm text-cream-dim">{a.haslo}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pb-1 pt-4">
        <p className="text-sm">
          <span className="text-cream-dim">{sekcjaAtrakcje.cenaOdLabel} </span>
          <span className="font-medium tabular-nums text-gold">{zl(a.cenaOd)}</span>
          <span className="text-cream-dim"> · {a.czas}</span>
        </p>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="text-sm font-medium text-gold transition-colors hover:text-gold-soft"
        >
          {open ? "− Schowaj" : sekcjaAtrakcje.szczegolyLabel}
        </button>
      </div>

      <div id={panelId} className="acc-panel px-3" data-open={open}>
        <div>
          <ul className="mb-3 mt-2 divide-y divide-line border-t border-line">
            {a.spec.map((s) => (
              <li key={s} className="py-2.5 text-sm text-cream-dim">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Attractions() {
  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-section-header]", el);
    gsap.from("[data-att-card]", {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: el.querySelector("[data-att-grid]"), start: "top 78%" },
    });
    gsap.utils.toArray<HTMLElement>("[data-att-img]").forEach((img) => {
      gsap.from(img, {
        scale: 1.08,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: img, start: "top 85%" },
      });
    });
  });

  return (
    <section ref={ref} id="atrakcje" className="noise bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow={sekcjaAtrakcje.eyebrow}
          h2={sekcjaAtrakcje.h2}
          lead={sekcjaAtrakcje.lead}
        />
        <div data-att-grid className="mt-12 grid gap-6 md:grid-cols-3">
          {atrakcje.map((a) => (
            <AttractionCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
