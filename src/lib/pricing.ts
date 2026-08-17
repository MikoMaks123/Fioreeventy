import { atrakcje, dodatki, regulyRabatow } from "@/data/content";

export type PozycjaWyceny = {
  id: string;
  nazwa: string;
  cena: number;
  typ: "atrakcja" | "dodatek";
};

export type Wycena = {
  pozycje: PozycjaWyceny[];
  sumaPrzedRabatem: number;
  rabat: { etykieta: string; procent: number; kwota: number } | null;
  suma: number;
};

/**
 * Wycena orientacyjna pakietu. Rabat pakietowy liczony od sumy atrakcji
 * (dodatki bez rabatu). Reguły rabatów siedzą w content.ts.
 * FAZA 2: reguły promocji z panelu admina — tu tylko odczyt tablicy.
 */
export function wycenPakiet(attrIds: string[], addonIds: string[], dateISO?: string): Wycena {
  const pozycje: PozycjaWyceny[] = [];
  let sumaAtrakcji = 0;
  let sumaDodatkow = 0;

  for (const a of atrakcje) {
    if (!attrIds.includes(a.id)) continue;
    pozycje.push({ id: a.id, nazwa: a.nazwa, cena: a.cenaOd, typ: "atrakcja" });
    sumaAtrakcji += a.cenaOd;
  }
  for (const d of dodatki) {
    if (!addonIds.includes(d.id)) continue;
    pozycje.push({ id: d.id, nazwa: d.nazwa, cena: d.cena, typ: "dodatek" });
    sumaDodatkow += d.cena;
  }

  const dzis = dateISO ?? null;
  const aktywne = regulyRabatow.filter((r) => {
    if (!dzis) return r.aktywnaOd === null && r.aktywnaDo === null;
    if (r.aktywnaOd && dzis < r.aktywnaOd) return false;
    if (r.aktywnaDo && dzis > r.aktywnaDo) return false;
    return true;
  });
  const regula =
    aktywne
      .filter((r) => attrIds.length >= r.minAtrakcji)
      .sort((a, b) => b.minAtrakcji - a.minAtrakcji)[0] ?? null;

  const kwota = regula ? Math.round(sumaAtrakcji * regula.rabat) : 0;
  const sumaPrzedRabatem = sumaAtrakcji + sumaDodatkow;

  return {
    pozycje,
    sumaPrzedRabatem,
    rabat: regula ? { etykieta: regula.etykieta, procent: regula.rabat, kwota } : null,
    suma: sumaPrzedRabatem - kwota,
  };
}
