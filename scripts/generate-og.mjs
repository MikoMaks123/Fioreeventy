// OG image 1200x630 (§7): taśma fotobudkowa na ciemnym tle + wordmark.
// Składane z pobranych placeholderów — po podmianie zdjęć uruchom ponownie: npm run og
import sharp from "sharp";
import path from "node:path";

const IMG = path.join(import.meta.dirname, "..", "public", "img");
const OUT = path.join(import.meta.dirname, "..", "public", "og.jpg");

const W = 1200;
const H = 630;

const baseSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="30%" cy="35%" r="90%">
      <stop offset="0%" stop-color="#1C1916"/>
      <stop offset="100%" stop-color="#12100E"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E5A3B6"/>
      <stop offset="100%" stop-color="#F2C1CE"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none"
        stroke="rgba(229,163,182,0.3)" stroke-width="1.5"/>
  <text x="100" y="215" font-family="Georgia, 'Times New Roman', serif" font-size="120"
        font-weight="600" fill="#FFFFFF">FIORE</text>
  <text x="104" y="268" font-family="Arial, sans-serif" font-size="30" letter-spacing="18"
        fill="url(#gold)">EVENTY</text>
  <text x="102" y="380" font-family="Arial, sans-serif" font-size="30" fill="#FFFFFF"
        opacity="0.85">Fotobudka · Fotomagnesy · Dmuchańce</text>
  <text x="102" y="430" font-family="Arial, sans-serif" font-size="26" fill="#E5A3B6">
    Sprawdź dostępny termin online</text>
</svg>`;

async function frame(file, w, h, tilt) {
  const inner = await sharp(path.join(IMG, file))
    .resize(w, h, { fit: "cover" })
    .toBuffer();
  return sharp(inner)
    .extend({ top: 10, left: 10, right: 10, bottom: 34, background: "#FFFFFF" })
    .png()
    .toBuffer()
    .then((buf) =>
      sharp(buf)
        .rotate(tilt, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    );
}

const frames = await Promise.all([
  frame("strip-1.webp", 200, 240, -3),
  frame("strip-2.webp", 200, 240, 2),
  frame("strip-3.webp", 200, 240, -2),
]);

await sharp(Buffer.from(baseSvg))
  .composite([
    { input: frames[0], left: 880, top: 30 },
    { input: frames[1], left: 900, top: 235 },
    { input: frames[2], left: 875, top: 440 },
  ])
  .jpeg({ quality: 88 })
  .toFile(OUT);

console.log(`OK ${OUT}`);
