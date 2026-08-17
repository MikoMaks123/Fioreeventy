"use client";

// §5.8 — FAQ: akordeon na --cream, pierwszy otwarty, animacja grid-template-rows,
// ikona + obraca się do ×. Pełna obsługa klawiatury + aria-expanded/aria-controls.

import { useState } from "react";
import { faq, sekcjaFaq } from "@/data/content";
import SectionHeader from "@/components/SectionHeader";
import { useGsapSection, revealUp } from "@/lib/useGsap";

export default function Faq() {
  const [open, setOpen] = useState(0); // pierwszy otwarty (§5.8)
  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-section-header]", el);
    revealUp(gsap, "[data-faq-item]", el.querySelector("[data-faq-list]") ?? el, {
      stagger: 0.07,
      y: 24,
    });
  });

  return (
    <section ref={ref} id="faq" className="section-light bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeader tone="light" center eyebrow={sekcjaFaq.eyebrow} h2={sekcjaFaq.h2} />

        <div data-faq-list className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faq.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={f.q} data-faq-item>
                <h3>
                  <button
                    id={btnId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium"
                  >
                    {f.q}
                    <span
                      aria-hidden="true"
                      className={`grid size-8 shrink-0 place-items-center rounded-full border border-ink/15 text-xl font-normal leading-none transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="acc-panel"
                  data-open={isOpen}
                >
                  <div>
                    <p className="pb-5 pr-14 leading-relaxed text-ink/70">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
