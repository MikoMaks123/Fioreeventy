// Mock kalendarza dostępności — deterministyczna funkcja daty (§2, §5.1).
// Ten sam wynik dla tej samej daty przy każdym odświeżeniu (prezentacja nie skacze).
// TODO: podmienić na odczyt z panelu admina (faza 2)
// FAZA 2: prawdziwy kalendarz dostępności zasilany z bazy — ta funkcja zostaje
// jedynym punktem styku UI z danymi, podmieniamy tylko jej wnętrze.

export type Dostepnosc = "wolne" | "ostatni" | "zajete";

export const dostepnoscLabel: Record<Dostepnosc, string> = {
  wolne: "Wolne",
  ostatni: "Został 1 termin",
  zajete: "Zajęte",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Dostępność jednej atrakcji w danym dniu. dateISO: "yyyy-mm-dd". */
export function getAvailability(dateISO: string, atrakcjaId: string): Dostepnosc {
  const d = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "wolne";
  const dzien = d.getDay(); // 0 = niedziela, 5 = piątek, 6 = sobota
  const miesiac = d.getMonth() + 1;
  const r = hash(`${dateISO}|${atrakcjaId}`) % 100;

  // realizm: soboty maj–wrzesień mocno oblegane
  if (dzien === 6 && miesiac >= 5 && miesiac <= 9) {
    if (r < 45) return "zajete";
    if (r < 72) return "ostatni";
    return "wolne";
  }
  // piątki i niedziele — głównie wolne
  if (dzien === 5 || dzien === 0) {
    if (r < 8) return "zajete";
    if (r < 20) return "ostatni";
    return "wolne";
  }
  if (r < 18) return "zajete";
  if (r < 34) return "ostatni";
  return "wolne";
}

/** Dostępność wszystkich atrakcji naraz. */
export function getAvailabilityMap(dateISO: string, ids: string[]): Record<string, Dostepnosc> {
  const out: Record<string, Dostepnosc> = {};
  for (const id of ids) out[id] = getAvailability(dateISO, id);
  return out;
}

/** "2026-06-14" -> "14.06" (etykieta „zajęte 14.06" w kreatorze) */
export function shortDate(dateISO: string): string {
  const [, m, d] = dateISO.split("-");
  return m && d ? `${d}.${m}` : dateISO;
}
