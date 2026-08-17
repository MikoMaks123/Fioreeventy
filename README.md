# Fiore Eventy — demo landing page

Demo sprzedażowe strony dla firmy Fiore Eventy (wynajem atrakcji eventowych:
fotobudka, fotomagnesy, dmuchańce). Jedna strona, statyczny eksport.

**Podgląd:** https://mikomaks123.github.io/Fioreeventy/

## Stack

- Next.js 15 (App Router, `output: "export"`) + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger, Lenis (smooth scroll)

## Uruchomienie lokalne

```bash
npm install
npm run dev          # dev server
npm run build        # statyczny eksport do out/
npx serve out        # podgląd builda
```

## Struktura danych

Wszystkie treści i dane demo siedzą w **`src/data/content.ts`** — podmiana
danych klientki (ceny, telefon, miasto, zdjęcia) to edycja tego jednego pliku.
Wartości oznaczone `// TODO: dane od klientki` są tymczasowe.

- `npm run images` — pobiera placeholdery zdjęć z Unsplash do `public/img`
- `npm run og` — generuje grafikę OG (1200×630) z aktualnych zdjęć

Mock kalendarza dostępności: `src/lib/availability.ts` (deterministyczny,
bez backendu). Miejsca do rozbudowy w fazie 2 oznaczone komentarzem `// FAZA 2:`.

Deploy: push na `main` → GitHub Actions buduje i publikuje na GitHub Pages
(`.github/workflows/deploy.yml`).
