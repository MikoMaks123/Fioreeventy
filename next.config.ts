import type { NextConfig } from "next";

// Statyczny eksport: HTML w źródle strony (SEO dla lokalnego biznesu).
// Działa i na Vercel, i na GitHub Pages.
// NEXT_PUBLIC_BASE_PATH: GitHub Pages serwuje projekt w podkatalogu
// (/Fioreeventy) — ustawiane w .github/workflows/deploy.yml; lokalnie puste.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    // Przy statycznym eksporcie next/image nie ma serwera optymalizacji —
    // obrazy są pobierane z Unsplash już przycięte i skonwertowane do WebP
    // (scripts/fetch-images.mjs), więc optymalizacja w locie nie jest potrzebna.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
