// §5.10 — STOPKA: wordmark + zdanie, trzy kolumny, social (IG tylko gdy podane),
// dolny pasek z © i „Realizacja: SiteForNow". Nad stopką złoty hairline.

import { atrakcje, firma, nawigacja, stopka } from "@/data/content";
import { IconFacebook, IconInstagram } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-gold/25 bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-medium tracking-wide text-cream">
                FIORE
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold">
                Eventy
              </span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-cream-dim">{stopka.zdanie}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={firma.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fiore Eventy na Facebooku"
                className="grid size-10 place-items-center rounded-full border border-line text-cream-dim transition-colors hover:border-gold/50 hover:text-gold"
              >
                <IconFacebook className="size-4.5" />
              </a>
              {firma.instagram !== null && (
                <a
                  href={firma.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fiore Eventy na Instagramie"
                  className="grid size-10 place-items-center rounded-full border border-line text-cream-dim transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <IconInstagram className="size-4.5" />
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Stopka — nawigacja">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim">
              {stopka.kolumny.nawigacja}
            </p>
            <ul className="mt-4 space-y-2.5">
              {nawigacja.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="text-sm text-cream-dim transition-colors hover:text-cream"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim">
              {stopka.kolumny.atrakcje}
            </p>
            <ul className="mt-4 space-y-2.5">
              {atrakcje.map((a) => (
                <li key={a.id}>
                  <a
                    href="#atrakcje"
                    className="text-sm text-cream-dim transition-colors hover:text-cream"
                  >
                    {a.nazwa}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-dim">
              {stopka.kolumny.kontakt}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-dim">
              <li>
                <a href={firma.telefonHref} className="transition-colors hover:text-cream">
                  {firma.telefon}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${firma.email}`}
                  className="break-all transition-colors hover:text-cream"
                >
                  {firma.email}
                </a>
              </li>
              <li>
                {firma.miasto} i okolice · do {firma.promienKm} km
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-cream-dim sm:flex-row sm:items-center">
          <p>
            © 2026 {firma.nazwa} ·{" "}
            <a href="/polityka-prywatnosci/" className="transition-colors hover:text-cream">
              {stopka.polityka}
            </a>
          </p>
          <p className="text-cream-dim">{stopka.realizacja}</p>
        </div>
      </div>
    </footer>
  );
}
