/** 1250 -> "1 250 zł" (separator tysięcy; stabilne między serwerem a klientem) */
export function zl(n: number): string {
  const s = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} zł`;
}

/** "2026-06-14" -> "14.06.2026" */
export function plDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

/** Dzisiejsza data LOKALNA jako "yyyy-mm-dd" (toISOString dałoby dzień w UTC). */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
