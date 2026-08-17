"use client";

// §5.4 — KREATOR PAKIETU (serce demo, sekcja jasna na --cream).
// Data i typ przychodzą z hera (Context), rabaty liczą się z reguł w content.ts.
// FAZA 2: panel administracyjny — zaznaczanie zajętych terminów, edycja cen
// i zarządzanie promocjami; kreator czyta wtedy dane z API zamiast z content.ts.

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  atrakcje,
  dodatki,
  sekcjaKreator,
  typyImprez,
} from "@/data/content";
import { getAvailabilityMap, shortDate } from "@/lib/availability";
import { wycenPakiet } from "@/lib/pricing";
import { zl, plDate, todayISO } from "@/lib/format";
import { useBooking } from "@/context/BookingContext";
import { useGsapSection, revealUp } from "@/lib/useGsap";
import { scrollToId } from "@/lib/scroll";
import SectionHeader from "@/components/SectionHeader";
import AnimatedNumber from "@/components/AnimatedNumber";
import { IconCheck } from "@/components/icons";

export default function PackageBuilder() {
  const {
    date,
    setDate,
    typ,
    setTyp,
    wybrane,
    toggleAtrakcja,
    setWybrane,
    addons,
    toggleAddon,
    sprawdzono,
  } = useBooking();

  const ids = useMemo(() => atrakcje.map((a) => a.id), []);
  const avail = useMemo(() => (date ? getAvailabilityMap(date, ids) : null), [date, ids]);
  const wolne = avail ? ids.filter((id) => avail[id] !== "zajete").length : 0;
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => setMinDate(todayISO()), []);

  // zmiana daty może „zabrać" zaznaczoną atrakcję — zajęte wypadają z pakietu
  useEffect(() => {
    if (!avail) return;
    const filtered = wybrane.filter((id) => avail[id] !== "zajete");
    if (filtered.length !== wybrane.length) setWybrane(filtered);
  }, [avail, wybrane, setWybrane]);

  const wycena = useMemo(() => wycenPakiet(wybrane, addons, date || undefined), [wybrane, addons, date]);

  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-section-header]", el);
    revealUp(gsap, "[data-kreator-col]", el.querySelector("[data-kreator-grid]") ?? el, {
      stagger: 0.15,
    });
  });

  return (
    <section ref={ref} id="pakiet" className="section-light bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeader
          tone="light"
          eyebrow={sekcjaKreator.eyebrow}
          h2={sekcjaKreator.h2}
          lead={sekcjaKreator.lead}
        />

        <div
          data-kreator-grid
          className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_minmax(340px,420px)]"
        >
          {/* lewa kolumna — wybór */}
          <div data-kreator-col className="space-y-9">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
                  {sekcjaKreator.labelData}
                </span>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-ink"
                />
                {sprawdzono && date && (
                  <span className="mt-2 block text-xs text-ink/60">
                    {sekcjaKreator.sprawdzonePrefix}{" "}
                    <span className="font-medium text-ink">
                      {wolne} z {ids.length}
                    </span>{" "}
                    {sekcjaKreator.sprawdzoneSuffix}
                  </span>
                )}
              </label>

              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
                  {sekcjaKreator.labelTyp}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={sekcjaKreator.labelTyp}>
                  {typyImprez.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTyp(t.id)}
                      aria-pressed={typ === t.id}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        typ === t.id
                          ? "bg-ink text-cream"
                          : "border border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink"
                      }`}
                    >
                      {t.short}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
                {sekcjaKreator.labelAtrakcje}
              </span>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {atrakcje.map((a) => {
                  const st = avail?.[a.id];
                  const zajete = st === "zajete";
                  const active = wybrane.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAtrakcja(a.id)}
                      disabled={zajete}
                      aria-pressed={active}
                      className={`relative rounded-2xl border-2 bg-white p-3 text-left transition-[border-color,box-shadow,opacity] ${
                        active
                          ? "border-gold shadow-[0_10px_30px_-12px_rgba(229,163,182,0.5)]"
                          : "border-ink/10 hover:border-ink/30"
                      } ${zajete ? "cursor-not-allowed opacity-45" : ""}`}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 z-10 grid size-6 place-items-center rounded-full bg-gold text-ink">
                          <IconCheck className="size-4" />
                        </span>
                      )}
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                        <Image
                          src={a.img}
                          alt={a.imgAlt}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </span>
                      <span className="mt-3 block font-medium">{a.nazwa}</span>
                      <span className="block text-sm tabular-nums text-ink/60">
                        od {zl(a.cenaOd)}
                      </span>
                      {st && (
                        <span
                          className={`mt-1.5 flex items-center gap-1.5 text-xs ${
                            zajete
                              ? "text-blush"
                              : st === "ostatni"
                                ? "font-medium text-gold-deep"
                                : "text-ink/55"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              zajete ? "bg-blush" : st === "ostatni" ? "bg-gold" : "bg-blush/70"
                            }`}
                          />
                          {zajete
                            ? `zajęte ${shortDate(date)}`
                            : st === "ostatni"
                              ? "został 1 termin"
                              : "wolne w tym terminie"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
                {sekcjaKreator.labelDodatki}
              </span>
              <ul className="mt-3 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white px-4">
                {dodatki.map((d) => (
                  <li key={d.id}>
                    <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addons.includes(d.id)}
                          onChange={() => toggleAddon(d.id)}
                          className="size-4 accent-ink"
                        />
                        <span className="text-sm">{d.nazwa}</span>
                      </span>
                      <span className="text-sm tabular-nums text-ink/60">+ {zl(d.cena)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* prawa kolumna — podsumowanie (sticky, karta na --ink w jasnej sekcji) */}
          <div data-kreator-col className="lg:sticky lg:top-24">
            <div className="noise rounded-3xl bg-ink p-6 text-cream shadow-lift md:p-7">
              <h3 className="font-display text-2xl font-medium">{sekcjaKreator.podsumowanie}</h3>
              {date && (
                <p className="mt-1 text-sm text-cream-dim">
                  {plDate(date)} · {typyImprez.find((t) => t.id === typ)?.label}
                </p>
              )}

              {/* pakiet bez ATRAKCJI (nawet z dodatkami) = brak pakietu —
                  dodatki same w sobie nie są ofertą */}
              {wybrane.length === 0 ? (
                <p className="mt-5 text-sm text-cream-dim">{sekcjaKreator.pustyPakiet}</p>
              ) : (
                <ul className="mt-5 space-y-2.5">
                  {wycena.pozycje.map((p) => (
                    <li
                      key={p.id}
                      className="item-enter flex items-baseline justify-between gap-4 text-sm"
                    >
                      <span className={p.typ === "dodatek" ? "text-cream-dim" : ""}>{p.nazwa}</span>
                      <span className="shrink-0 tabular-nums text-cream-dim">
                        {p.typ === "atrakcja" ? "od " : ""}
                        {zl(p.cena)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {wybrane.length > 0 && wycena.rabat && (
                <div className="item-enter mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="flex items-center gap-2">
                    <span className="rounded-full border border-gold/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
                      {wycena.rabat.etykieta}
                    </span>
                  </span>
                  <span className="text-sm font-medium tabular-nums text-gold">
                    −{Math.round(wycena.rabat.procent * 100)}% (−{zl(wycena.rabat.kwota)})
                  </span>
                </div>
              )}

              {wybrane.length > 0 && (
                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-cream-dim">{sekcjaKreator.sumaLabel}</span>
                    <span className="text-3xl font-medium">
                      <AnimatedNumber value={wycena.suma} />
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-cream-dim">
                    {sekcjaKreator.zastrzezenie}
                  </p>
                </div>
              )}

              <button
                onClick={() => scrollToId("kontakt")}
                disabled={wybrane.length === 0}
                className="mt-5 w-full rounded-xl bg-gold px-5 py-3.5 font-medium text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sekcjaKreator.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
