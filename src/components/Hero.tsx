"use client";

// HERO (§5.1) — „Sprawdź datę": pełny viewport, panel dostępności po prawej,
// taśma fotobudkowa jako efekt sygnaturowy. Sekwencja wejścia < 1,6 s.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { atrakcje, firma, hero, obrazy, typyImprez } from "@/data/content";
import { getAvailabilityMap, dostepnoscLabel, type Dostepnosc } from "@/lib/availability";
import { todayISO } from "@/lib/format";
import { useBooking } from "@/context/BookingContext";
import { useGsapSection } from "@/lib/useGsap";
import { scrollToId } from "@/lib/scroll";
import { IconClock, IconPeople, IconPrint } from "@/components/icons";

const trustIcons = { clock: IconClock, people: IconPeople, print: IconPrint };
const STRIP_TILT = [-2, 1.5, -1.5, 2];

/** H1 słowo po słowie — każde słowo w masce (reveal od dołu). */
function Words({ text, gradient = false }: { text: string; gradient?: boolean }) {
  return (
    <span className="block">
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top"
        >
          <span
            data-h1-word
            className={`inline-block ${
              gradient
                ? "bg-gradient-to-r from-gold to-gold-soft bg-clip-text text-transparent"
                : ""
            }`}
          >
            {w}
            {" "}
          </span>
        </span>
      ))}
    </span>
  );
}

function StripFrame({ index, className = "" }: { index: number; className?: string }) {
  const o = obrazy.tasma[index];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        data-strip-frame
        className="frame-cream p-1.5 pb-4"
        style={{ transform: `rotate(${STRIP_TILT[index]}deg)` }}
      >
        <Image
          src={o.src}
          alt={o.alt}
          width={o.w}
          height={o.h}
          sizes="(min-width: 1536px) 7rem, 7rem"
          className="aspect-[4/5] w-full rounded-[3px] object-cover"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const { date, setDate, typ, setTyp, setSprawdzono } = useBooking();
  const [checking, setChecking] = useState(false);
  // wynik trzymany RAZEM z datą, dla której go policzono — zmiana daty
  // (także z kreatora/formularza przez Context) automatycznie go ukrywa
  const [results, setResults] = useState<{
    date: string;
    map: Record<string, Dostepnosc>;
  } | null>(null);
  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const dateRef = useRef(date);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  // min daty ustawiane po stronie klienta (uniknięcie niezgodności hydracji);
  // data LOKALNA — toISOString dawałoby wczorajszy dzień tuż po północy
  useEffect(() => {
    setMinDate(todayISO());
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    // na mobile hero zostaje statyczny: tekst widoczny od pierwszego painta
    // (budżet LCP < 2,5 s na 4G, §3), pełna sekwencja gra na desktopie
    if (window.innerWidth < 768) return;

    // sekwencja wejścia (§5.1): H1 słowa -> lead -> panel -> drukowanie taśmy
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-h1-word]", { yPercent: 112, duration: 0.7, stagger: 0.06 }, 0)
      .from("[data-hero-eyebrow]", { opacity: 0, y: 12, duration: 0.5 }, 0.05)
      .from("[data-hero-lead]", { opacity: 0, y: 20, duration: 0.6 }, 0.35)
      .from("[data-hero-trust] > *", { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, 0.5)
      .from("[data-hero-panel]", { opacity: 0, y: 30, duration: 0.7 }, 0.4)
      .from(
        "[data-strip-frame]",
        { yPercent: 120, duration: 0.55, stagger: 0.18, ease: "power3.out" },
        0.35,
      );

    // bardzo powolny parallax tła (scale 1 -> 1.06) — slot pod przyszłe wideo
    gsap.to("[data-hero-bg-img]", {
      scale: 1.06,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
    // taśma przesuwa się wolniej niż strona
    gsap.to("[data-strip]", {
      y: -80,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
  });

  const check = () => {
    if (!date) {
      setError(hero.panel.bladBrakDaty);
      return;
    }
    const reqDate = date;
    setError("");
    setResults(null);
    setChecking(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    // 600 ms stanu ładowania (§5.1); wynik deterministyczny dla tej samej daty
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setChecking(false);
      // data zmieniła się w trakcie ładowania -> wynik dla starej daty do kosza
      if (dateRef.current !== reqDate) return;
      setResults({ date: reqDate, map: getAvailabilityMap(reqDate, atrakcje.map((a) => a.id)) });
      setSprawdzono(true);
    }, 600);
  };

  return (
    // bez .noise: nad zdjęciem z winietą ziarno i tak jest niewidoczne,
    // a rastrowanie feTurbulence na cały viewport opóźniało LCP
    <section ref={ref} id="top" className="relative overflow-hidden bg-ink">
      {/* SLOT WIDEO: docelowo zapętlone wideo (sala, bokeh, konfetti) z tym samym
          overlayem — na razie zdjęcie + powolny parallax (§5.1).
          Zwykłe <picture> zamiast next/image: art direction (pionowy kadr na
          mobile) + images.unoptimized i tak nie daje srcsetów. */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={obrazy.heroTloMobile.src} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-hero-bg-img
            src={obrazy.heroTlo.src}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        {/* neutralna czerń zamiast ciepłego brązu i BEZ winiety —
            zdjęcie ma zostać wyraziste, nie "latte" */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* transform-gpu: tekst hero na własnej warstwie kompozycji — doładowanie
          tła pod spodem nie wymusza jego repaintu (repaint = nowy kandydat LCP) */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl transform-gpu items-center gap-12 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-[3fr_2fr] lg:pb-24 lg:pt-32 2xl:pr-44">
        <div>
          <p
            data-hero-eyebrow
            className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold md:text-xs"
          >
            {firma.miasto} i okolice · do {firma.promienKm} km
          </p>
          <h1 className="mt-5 font-display font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(3.2rem,6vw,5.8rem)]">
            <Words text={hero.h1Line1} />
            <Words text={hero.h1Line2} gradient />
          </h1>
          <p data-hero-lead className="mt-6 max-w-xl text-lg text-cream-dim">
            {hero.lead}
          </p>
          <ul data-hero-trust className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {hero.mikroZaufanie.map((t) => {
              const Ikona = trustIcons[t.icon];
              return (
                <li key={t.text} className="flex items-center gap-2.5 text-sm text-cream-dim">
                  <Ikona className="size-[18px] shrink-0 text-gold" />
                  {t.text}
                </li>
              );
            })}
          </ul>
        </div>

        {/* panel „Sprawdź datę" */}
        <div
          data-hero-panel
          id="sprawdz-date"
          className="glass rounded-3xl p-6 shadow-lift md:p-8"
        >
          <h2 className="font-display text-2xl font-medium md:text-[1.7rem]">
            {hero.panel.naglowek}
          </h2>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim">
                {hero.panel.labelData}
              </span>
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setResults(null);
                  setError("");
                }}
                className="mt-2 w-full rounded-xl border border-line bg-ink-soft/80 px-4 py-3 text-cream"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim">
                {hero.panel.labelTyp}
              </span>
              <select
                value={typ}
                onChange={(e) => setTyp(e.target.value)}
                className="mt-2 w-full appearance-none rounded-xl border border-line bg-ink-soft/80 px-4 py-3 text-cream"
              >
                {typyImprez.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            {error && (
              <p role="alert" className="text-sm text-blush">
                {error}
              </p>
            )}
            <button
              onClick={check}
              disabled={checking}
              className="w-full rounded-xl bg-gold px-5 py-3.5 font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-70"
            >
              {hero.panel.cta}
            </button>
          </div>

          <div aria-live="polite">
            {checking && (
              <div className="flex justify-center gap-2 pt-5" aria-label="Sprawdzam kalendarz">
                <span className="dot size-2 rounded-full bg-gold" />
                <span className="dot size-2 rounded-full bg-gold" />
                <span className="dot size-2 rounded-full bg-gold" />
              </div>
            )}
            {results && results.date === date && !checking && (
              <>
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {atrakcje.map((a) => {
                    const st = results.map[a.id];
                    return (
                      <li key={a.id} className="flex items-center justify-between py-3">
                        <span
                          className={
                            st === "zajete" ? "text-cream-dim/60 line-through" : "text-cream"
                          }
                        >
                          {a.nazwa}
                        </span>
                        {st === "wolne" && (
                          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-cream">
                            <span className="size-2 rounded-full bg-blush" />
                            {dostepnoscLabel.wolne}
                          </span>
                        )}
                        {st === "ostatni" && (
                          <span className="pulse-slow flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-gold">
                            <span className="size-2 rounded-full bg-gold" />
                            {dostepnoscLabel.ostatni}
                          </span>
                        )}
                        {st === "zajete" && (
                          <span className="text-xs font-medium uppercase tracking-[0.15em] text-cream-dim/60">
                            {dostepnoscLabel.zajete}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => scrollToId("pakiet")}
                  className="mt-4 w-full rounded-xl border border-gold/60 px-5 py-3 font-medium text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  {hero.panel.ctaPakiet}
                </button>
              </>
            )}
          </div>
        </div>

        {/* taśma fotobudkowa — wariant poziomy (mobile/laptop), 3 kadry (§5.1) */}
        <div data-strip className="flex justify-center gap-4 pb-2 lg:justify-start 2xl:hidden">
          {[0, 1, 2].map((i) => (
            <StripFrame key={i} index={i} className="w-24 sm:w-28" />
          ))}
        </div>
      </div>

      {/* taśma fotobudkowa — pion przy prawej-dolnej krawędzi (szeroki desktop) */}
      <div
        data-strip
        className="pointer-events-none absolute bottom-10 right-8 z-10 hidden w-28 flex-col gap-3 2xl:flex"
      >
        {[0, 1, 2, 3].map((i) => (
          <StripFrame key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
