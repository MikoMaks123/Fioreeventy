"use client";

// §5.9 — FINALNE CTA + FORMULARZ: prefill z kreatora (data, typ, pigułki atrakcji),
// walidacja inline po blur, stan sukcesu = flip karty (bez przeładowania).
// Wysyłka: fallback mailto + wizualne potwierdzenie.
// TODO: podpiąć Resend/Formspree na produkcji

import { useEffect, useMemo, useState, type FocusEvent } from "react";
import Image from "next/image";
import { atrakcje, firma, obrazy, sekcjaKontakt, typyImprez } from "@/data/content";
import { useBooking } from "@/context/BookingContext";
import { useGsapSection, revealUp } from "@/lib/useGsap";
import { plDate, todayISO } from "@/lib/format";
import { IconCheck, IconMessenger, IconPhone, IconX } from "@/components/icons";

const t = sekcjaKontakt.form;

type Errors = Partial<Record<"data" | "imie" | "telefon" | "email" | "rodo", string>>;

export default function FinalCta() {
  const { date, setDate, typ, setTyp, wybrane, usunAtrakcje } = useBooking();
  const [miejsce, setMiejsce] = useState("");
  const [imie, setImie] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [rodo, setRodo] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => setMinDate(todayISO()), []);

  const ref = useGsapSection<HTMLElement>(({ el, gsap }) => {
    revealUp(gsap, "[data-cta-head] > *", el, { stagger: 0.12 });
    revealUp(gsap, "[data-cta-card]", el.querySelector("[data-cta-grid]") ?? el, {
      stagger: 0.15,
    });
  });

  const validate = (field?: keyof Errors): Errors => {
    const next: Errors = { ...errors };
    const rules: Record<keyof Errors, () => string | undefined> = {
      data: () =>
        !date ? t.bladData : date < todayISO() ? t.bladDataPrzeszla : undefined,
      imie: () => (!imie.trim() ? t.bladImie : undefined),
      telefon: () => (telefon.replace(/\D/g, "").length < 7 ? t.bladTelefon : undefined),
      email: () => (!/^\S+@\S+\.\S+$/.test(email) ? t.bladEmail : undefined),
      rodo: () => (!rodo ? t.bladRodo : undefined),
    };
    const keys = field ? [field] : (Object.keys(rules) as (keyof Errors)[]);
    for (const k of keys) {
      const msg = rules[k]();
      if (msg) next[k] = msg;
      else delete next[k];
    }
    setErrors(next);
    return next;
  };

  const blurCheck = (field: keyof Errors) => (_e: FocusEvent) => validate(field);

  const mailtoHref = useMemo(() => {
    const typLabel = typyImprez.find((x) => x.id === typ)?.label ?? typ;
    const lista = wybrane
      .map((id) => atrakcje.find((a) => a.id === id)?.nazwa)
      .filter(Boolean)
      .join(", ");
    const subject = `Zapytanie o termin ${date ? plDate(date) : ""} — ${typLabel}`;
    const body = [
      `Data imprezy: ${date ? plDate(date) : "-"}`,
      `Typ imprezy: ${typLabel}`,
      `Miejsce: ${miejsce || "-"}`,
      `Atrakcje: ${lista || "-"}`,
      `Imię: ${imie}`,
      `Telefon: ${telefon}`,
      wiadomosc ? `Wiadomość: ${wiadomosc}` : "",
    ]
      .filter(Boolean)
      .join("\r\n"); // RFC 6068: łamanie linii w mailto to %0D%0A
    return `mailto:${firma.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [date, typ, miejsce, wybrane, imie, telefon, wiadomosc]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return;
    // Demo: wizualne potwierdzenie + fallback mailto na karcie sukcesu.
    // TODO: podpiąć Resend/Formspree na produkcji
    // FAZA 2: rezerwacja online z zaliczką (płatności) — po wysłaniu zapytania
    // klient dostaje link do opłacenia zaliczki i termin blokuje się w kalendarzu.
    setSent(true);
  };

  const inputCls = (bad?: string) =>
    `mt-2 w-full rounded-xl border bg-ink-soft/80 px-4 py-3 text-cream placeholder:text-cream-dim/50 ${
      bad ? "border-blush" : "border-line"
    }`;
  const labelCls = "text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim";

  return (
    <section ref={ref} id="kontakt" className="noise relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src={obrazy.ctaTlo.src}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover"
        />
        {/* neutralne przyciemnienie bez winiety — spójnie z hero */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div data-cta-head className="mx-auto max-w-3xl text-center">
          <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.1] text-cream">
            {sekcjaKontakt.h2}
          </h2>
          <p className="mt-4 text-lg text-cream-dim">{sekcjaKontakt.sub}</p>
        </div>

        <div data-cta-grid className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_300px]">
          {/* karta formularza z flipem sukcesu */}
          <div data-cta-card className="flip-wrap">
            <div className="flip relative" data-flipped={sent}>
              <form
                onSubmit={submit}
                noValidate
                className="flip-face flip-front glass rounded-3xl p-6 md:p-8"
                aria-hidden={sent}
                inert={sent}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>{t.labelData}</span>
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onBlur={blurCheck("data")}
                      aria-invalid={!!errors.data}
                      aria-describedby={errors.data ? "err-data" : undefined}
                      className={inputCls(errors.data)}
                    />
                    {errors.data && (
                      <span id="err-data" className="mt-1.5 block text-xs text-blush">
                        {errors.data}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t.labelTyp}</span>
                    <select
                      value={typ}
                      onChange={(e) => setTyp(e.target.value)}
                      className={`${inputCls()} appearance-none`}
                    >
                      {typyImprez.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className={labelCls}>{t.labelMiejsce}</span>
                  <input
                    type="text"
                    value={miejsce}
                    onChange={(e) => setMiejsce(e.target.value)}
                    autoComplete="address-level2"
                    className={inputCls()}
                  />
                </label>

                {wybrane.length > 0 && (
                  <div className="mt-5">
                    <span className={labelCls}>{t.labelAtrakcje}</span>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {wybrane.map((id) => {
                        const a = atrakcje.find((x) => x.id === id);
                        if (!a) return null;
                        return (
                          <li
                            key={id}
                            className="flex items-center gap-1.5 rounded-full border border-gold/50 py-1.5 pl-3.5 pr-1.5 text-sm text-cream"
                          >
                            {a.nazwa}
                            <button
                              type="button"
                              onClick={() => usunAtrakcje(id)}
                              aria-label={`Usuń ${a.nazwa} z zapytania`}
                              className="grid size-5 place-items-center rounded-full text-cream-dim transition-colors hover:bg-blush/30 hover:text-cream"
                            >
                              <IconX className="size-3" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <label className="block">
                    <span className={labelCls}>{t.labelImie}</span>
                    <input
                      type="text"
                      value={imie}
                      onChange={(e) => setImie(e.target.value)}
                      onBlur={blurCheck("imie")}
                      autoComplete="given-name"
                      aria-invalid={!!errors.imie}
                      aria-describedby={errors.imie ? "err-imie" : undefined}
                      className={inputCls(errors.imie)}
                    />
                    {errors.imie && (
                      <span id="err-imie" className="mt-1.5 block text-xs text-blush">
                        {errors.imie}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t.labelTelefon}</span>
                    <input
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      onBlur={blurCheck("telefon")}
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={!!errors.telefon}
                      aria-describedby={errors.telefon ? "err-telefon" : undefined}
                      className={inputCls(errors.telefon)}
                    />
                    {errors.telefon && (
                      <span id="err-telefon" className="mt-1.5 block text-xs text-blush">
                        {errors.telefon}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t.labelEmail}</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={blurCheck("email")}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className={inputCls(errors.email)}
                    />
                    {errors.email && (
                      <span id="err-email" className="mt-1.5 block text-xs text-blush">
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className={labelCls}>{t.labelWiadomosc}</span>
                  <textarea
                    value={wiadomosc}
                    onChange={(e) => setWiadomosc(e.target.value)}
                    placeholder={t.placeholderWiadomosc}
                    rows={3}
                    className={inputCls()}
                  />
                </label>

                <label className="mt-5 flex items-start gap-3 text-sm text-cream-dim">
                  <input
                    type="checkbox"
                    checked={rodo}
                    onChange={(e) => {
                      setRodo(e.target.checked);
                      if (e.target.checked) validate("rodo");
                    }}
                    aria-invalid={!!errors.rodo}
                    aria-describedby={errors.rodo ? "err-rodo" : undefined}
                    className="mt-0.5 size-4 accent-[#E5A3B6]"
                  />
                  <span>
                    {t.rodo}{" "}
                    <a href="/polityka-prywatnosci/" className="underline hover:text-gold">
                      {t.rodoLink}
                    </a>
                    .
                    {errors.rodo && (
                      <span id="err-rodo" className="mt-1 block text-xs text-blush">
                        {errors.rodo}
                      </span>
                    )}
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-xl bg-gold px-5 py-4 font-medium text-ink transition-colors hover:bg-gold-soft"
                >
                  {t.cta}
                </button>
              </form>

              {/* tył karty — stan sukcesu */}
              <div
                className={`flip-back flip-face glass grid place-items-center rounded-3xl p-8 text-center ${
                  sent ? "" : "pointer-events-none"
                }`}
                aria-hidden={!sent}
                inert={!sent}
                role="status"
              >
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
                    <IconCheck className="size-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-medium text-cream">
                    {t.sukcesTytul}
                  </h3>
                  <p className="mt-2 text-cream-dim">{t.sukcesTekst}</p>
                  <p className="mt-6 text-sm text-cream-dim">{t.sukcesAlt}</p>
                  <a
                    href={firma.telefonHref}
                    className="mt-2 inline-block font-display text-2xl font-medium text-gold hover:text-gold-soft"
                  >
                    {firma.telefon}
                  </a>
                  <p className="mt-4 text-xs text-cream-dim">
                    <a href={mailtoHref} className="underline hover:text-gold">
                      Wolisz maila? Otwórz gotowe zapytanie w swojej poczcie
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* kontakt bezpośredni */}
          <aside data-cta-card className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl font-medium text-cream">
              {sekcjaKontakt.kontaktBok.naglowek}
            </h3>
            <a
              href={firma.telefonHref}
              className="mt-4 flex items-center gap-3 font-display text-2xl font-medium text-gold hover:text-gold-soft"
            >
              <IconPhone className="size-5 shrink-0" />
              {firma.telefon}
            </a>
            <a
              href={`mailto:${firma.email}`}
              className="mt-3 block break-all text-sm text-cream-dim hover:text-cream"
            >
              {firma.email}
            </a>
            <a
              href={firma.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line px-4 py-3 text-sm font-medium text-cream transition-colors hover:border-gold/50 hover:text-gold"
            >
              <IconMessenger className="size-4.5" />
              {sekcjaKontakt.kontaktBok.messenger}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
