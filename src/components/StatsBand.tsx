// Pasek liczb — HONESTY GATE (§1): renderuje się WYŁĄCZNIE, gdy klientka
// potwierdzi wartości (liczbaImprez / rokZalozenia w content.ts przestaną być null).
// Żadnych „500+ imprez" bez potwierdzenia.

import { firma } from "@/data/content";

export default function StatsBand() {
  const items: { wartosc: string; opis: string }[] = [];
  if (firma.liczbaImprez !== null) {
    items.push({ wartosc: `${firma.liczbaImprez}+`, opis: "zrealizowanych imprez" });
  }
  if (firma.rokZalozenia !== null) {
    items.push({ wartosc: `od ${firma.rokZalozenia}`, opis: "na salach i piknikach" });
  }
  if (items.length === 0) return null;

  return (
    <div className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-x-16 gap-y-6">
      {items.map((it) => (
        <div key={it.opis} className="text-center">
          <p className="font-display text-4xl tabular-nums text-gold">{it.wartosc}</p>
          <p className="mt-1 text-sm text-cream-dim">{it.opis}</p>
        </div>
      ))}
    </div>
  );
}
