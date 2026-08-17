// Pobiera placeholdery z Unsplash do /public/img jako WebP w docelowych proporcjach.
// Zdjęcia docelowe firma ma na Facebooku — podmiana przez mapę `obrazy` w src/data/content.ts.
// Uwaga: endpoint napi odrzuca Node fetch (401), więc sieć idzie przez curl.exe.
// Uruchomienie: npm run images
import { mkdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const OUT = path.join(import.meta.dirname, "..", "public", "img");

// slot -> { query, w, h, index (który wynik wyszukiwania), file, q (jakość) }
// Rozmiary dopasowane do realnie renderowanych wymiarów (budżet LCP/Lighthouse):
// tła są pod overlayem 72–85%, więc znoszą niższą jakość.
const SLOTS = [
  { file: "hero-bg.webp", query: "wedding party lights bokeh", w: 1600, h: 1067, index: 0, q: 70 },
  { file: "hero-bg-mobile.webp", query: "wedding party lights bokeh", w: 640, h: 928, index: 0, q: 60 },
  { file: "strip-1.webp", query: "photo booth props friends", w: 480, h: 600, index: 0 },
  { file: "strip-2.webp", query: "wedding guests laughing", w: 480, h: 600, index: 0 },
  { file: "strip-3.webp", query: "party confetti celebration", w: 480, h: 600, index: 0 },
  { file: "strip-4.webp", query: "couple dancing wedding", w: 480, h: 600, index: 0 },
  { file: "att-fotobudka.webp", query: "photo booth party", w: 800, h: 1000, index: 0 },
  { file: "att-fotomagnesy.webp", query: "polaroid photos memories", w: 800, h: 1000, index: 0 },
  { file: "att-dmuchance.webp", query: "bouncy castle kids", w: 800, h: 1000, index: 0 },
  { file: "gal-1.webp", query: "wedding dance floor", w: 560, h: 560, index: 0 },
  { file: "gal-2.webp", query: "children party fun", w: 560, h: 560, index: 0 },
  { file: "gal-3.webp", query: "wedding toast glasses", w: 560, h: 560, index: 1 },
  { file: "gal-4.webp", query: "party confetti celebration", w: 560, h: 560, index: 1 },
  { file: "gal-5.webp", query: "photo booth props friends", w: 560, h: 560, index: 1 },
  { file: "gal-6.webp", query: "kids inflatable slide", w: 560, h: 560, index: 0 },
  { file: "gal-7.webp", query: "wedding couple night", w: 560, h: 560, index: 0 },
  { file: "gal-8.webp", query: "birthday party balloons", w: 560, h: 560, index: 0 },
  { file: "gal-9.webp", query: "friends party smiling", w: 560, h: 560, index: 0 },
  { file: "gal-10.webp", query: "wedding reception table", w: 560, h: 560, index: 0 },
  { file: "firm.webp", query: "corporate event people", w: 800, h: 1000, index: 0 },
  { file: "cta-bg.webp", query: "dance floor dark lights", w: 1600, h: 1067, index: 0, q: 70 },
];

async function curlJson(url) {
  const { stdout } = await run("curl.exe", ["-s", "--max-time", "30", url], {
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

async function searchUnsplash(query) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`;
  const json = await curlJson(url);
  // tylko darmowe zdjęcia z images.unsplash.com (premium z plus.unsplash.com ma watermark)
  return (json.results || []).filter((r) => r.urls?.raw?.startsWith("https://images.unsplash.com/"));
}

async function download(slot, results) {
  const pick = results[Math.min(slot.index, results.length - 1)];
  if (!pick) throw new Error(`no results for "${slot.query}"`);
  const base = pick.urls.raw.split("?")[0];
  const url = `${base}?w=${slot.w}&h=${slot.h}&fit=crop&crop=faces,entropy&fm=webp&q=${slot.q ?? 78}`;
  const dest = path.join(OUT, slot.file);
  await run("curl.exe", ["-sL", "--max-time", "60", "-o", dest, url]);
  const { size } = await stat(dest);
  if (size < 10_000) throw new Error(`${slot.file}: too small (${size} B)`);
  return { file: slot.file, bytes: size, author: pick.user?.name ?? "?" };
}

await mkdir(OUT, { recursive: true });
const cache = new Map();
let failed = 0;
for (const slot of SLOTS) {
  try {
    if (!cache.has(slot.query)) cache.set(slot.query, await searchUnsplash(slot.query));
    const info = await download(slot, cache.get(slot.query));
    console.log(`OK  ${info.file}  ${(info.bytes / 1024).toFixed(0)} KB  (fot. ${info.author})`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${slot.file}: ${err.message}`);
  }
}
console.log(`\nDone: ${SLOTS.length - failed}/${SLOTS.length}`);
process.exit(failed > 0 ? 1 : 0);
