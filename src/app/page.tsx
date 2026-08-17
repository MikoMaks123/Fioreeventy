// Landing page Fiore Eventy — jedna strona, kolejność sekcji wiążąca (§5).

import { BookingProvider } from "@/context/BookingContext";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MarqueeBar from "@/components/MarqueeBar";
import Attractions from "@/components/Attractions";
import PackageBuilder from "@/components/PackageBuilder";
import HowItWorks from "@/components/HowItWorks";
import Realizations from "@/components/Realizations";
import ForCompanies from "@/components/ForCompanies";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <BookingProvider>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <MarqueeBar />
        <Attractions />
        <PackageBuilder />
        <HowItWorks />
        <Realizations />
        <ForCompanies />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <JsonLd />
    </BookingProvider>
  );
}
