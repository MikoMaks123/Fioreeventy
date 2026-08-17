"use client";

// §5.7 — DLA FIRM: wąska sekcja na --ink-soft, CTA prefiltrowuje typ „Event firmowy".

import Image from "next/image";
import { obrazy, sekcjaFirmy } from "@/data/content";
import { useBooking } from "@/context/BookingContext";
import { useGsapSection, revealUp } from "@/lib/useGsap";
import { scrollToId } from "@/lib/scroll";
import { IconArrow } from "@/components/icons";

export default function ForCompanies() {
  const { setTyp } = useBooking();
  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-firm-col]", el, { stagger: 0.15 });
  });

  const askForOffer = () => {
    setTyp("firmowa"); // formularz dostaje prefiltrowany typ imprezy
    scrollToId("kontakt");
  };

  return (
    <section ref={ref} id="dla-firm" className="noise border-y border-line bg-ink-soft">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-2">
        <div data-firm-col className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={obrazy.firmy.src}
              alt={obrazy.firmy.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
        <div data-firm-col>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold md:text-xs">
            {sekcjaFirmy.eyebrow}
          </p>
          <h3 className="mt-3 max-w-lg font-display text-3xl font-medium leading-tight text-cream md:text-4xl">
            {sekcjaFirmy.h3}
          </h3>
          <ul className="mt-6 space-y-3">
            {sekcjaFirmy.punkty.map((p) => (
              <li key={p} className="flex items-start gap-3 text-cream-dim">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" />
                {p}
              </li>
            ))}
          </ul>
          <button
            onClick={askForOffer}
            className="group mt-8 inline-flex items-center gap-2.5 font-medium text-gold transition-colors hover:text-gold-soft"
          >
            {sekcjaFirmy.cta}
            <IconArrow className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
