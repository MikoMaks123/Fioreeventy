// Tnie pełnostronicowy zrzut z Lighthouse na fragmenty do przeglądu.
import sharp from "sharp";
import path from "node:path";

const src = path.join(process.env.TEMP, "fiore-mobile.jpg");
const meta = await sharp(src).metadata();
const SLICES = 6;
const h = Math.floor(meta.height / SLICES);
for (let i = 0; i < SLICES; i++) {
  await sharp(src)
    .extract({ left: 0, top: i * h, width: meta.width, height: Math.min(h, meta.height - i * h) })
    .resize({ width: 340 })
    .jpeg({ quality: 80 })
    .toFile(path.join(process.env.TEMP, `fiore-slice-${i}.jpg`));
}
console.log(`OK ${SLICES} slices, ${meta.width}x${meta.height} -> h=${h}`);
