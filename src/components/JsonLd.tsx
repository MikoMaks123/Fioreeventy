// §7 — dane strukturalne: LocalBusiness + FAQPage + Service (3 atrakcje).
// Wszystko z content.ts — zmiana danych klientki propaguje się tu automatycznie.

import { atrakcje, faq, firma } from "@/data/content";

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: firma.nazwa,
    url: firma.siteUrl,
    telephone: firma.telefon,
    email: firma.email,
    image: `${firma.siteUrl}/og.jpg`,
    sameAs: [firma.facebook, ...(firma.instagram ? [firma.instagram] : [])],
    areaServed: `${firma.miasto} i okolice do ${firma.promienKm} km`,
    priceRange: "$$",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const services = atrakcje.map((a) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${a.nazwa} — wynajem na imprezy`,
    serviceType: "Wynajem atrakcji eventowych",
    provider: { "@type": "LocalBusiness", name: firma.nazwa, url: firma.siteUrl },
    areaServed: `${firma.miasto} i okolice do ${firma.promienKm} km`,
    offers: {
      "@type": "Offer",
      price: a.cenaOd,
      priceCurrency: "PLN",
      description: `Cena od — ${a.czas}`,
    },
  }));

  return (
    <>
      {[localBusiness, faqPage, ...services].map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
