// Minimalna podstrona polityki prywatności — cel: działający link z checkboxa
// RODO w formularzu. TODO: dane od klientki — administrator danych, adres, NIP.

import type { Metadata } from "next";
import Link from "next/link";
import { firma } from "@/data/content";

export const metadata: Metadata = {
  title: `Polityka prywatności | ${firma.nazwa}`,
  robots: { index: false },
};

export default function PolitykaPrywatnosci() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 md:px-8">
      <Link href="/" className="text-sm text-gold hover:text-gold-soft">
        ← Wróć na stronę główną
      </Link>
      <h1 className="mt-6 font-display text-4xl font-medium">Polityka prywatności</h1>
      <div className="mt-8 space-y-5 text-cream-dim">
        <p>
          Administratorem danych osobowych przekazanych przez formularz kontaktowy jest{" "}
          {firma.nazwa}
          {/* TODO: dane od klientki — pełna nazwa działalności, adres, NIP */}. Dane
          (imię, telefon, e-mail, informacje o planowanej imprezie) przetwarzamy wyłącznie
          w celu odpowiedzi na zapytanie i przygotowania oferty.
        </p>
        <p>
          Podanie danych jest dobrowolne, ale konieczne do otrzymania odpowiedzi. Dane nie
          są przekazywane podmiotom trzecim ani wykorzystywane do wysyłki marketingowej.
        </p>
        <p>
          W każdej chwili możesz poprosić o wgląd, poprawienie lub usunięcie swoich danych —
          wystarczy wiadomość na{" "}
          <a href={`mailto:${firma.email}`} className="text-gold hover:text-gold-soft">
            {firma.email}
          </a>
          .
        </p>
        <p className="text-sm text-cream-dim/70">
          Wersja robocza do demo. {/* TODO: dane od klientki — komplet zapisów po ustaleniu
          zakresu przetwarzania (np. wysyłka zdjęć po evencie, faktury). */}
        </p>
      </div>
    </main>
  );
}
