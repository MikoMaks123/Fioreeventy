import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { firma, seo } from "@/data/content";

// §4 — typografia: Playfair Display (display 500/600) + DM Sans (UI 400/500),
// latin-ext dla polskich znaków. display:"optional" — fonty są preloadowane,
// więc na normalnym łączu zawsze wchodzą, a przy wolnym pierwszym wejściu
// tekst nie robi drugiego painta (font-swap zawyżałby LCP o ~2 s na 4G).
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-playfair",
  display: "optional",
});
const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-dm",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(firma.siteUrl),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: "/",
    siteName: firma.nazwa,
    locale: "pl_PL",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: firma.nazwa }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-ink font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
