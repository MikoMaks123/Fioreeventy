"use client";

// NAV (§5.0): sticky glass — przezroczysty nad herem, po 80 px scrolla tło
// z blur + dolny hairline. Mobile: pełnoekranowe menu ze staggerem.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { firma, nawigacja } from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { IconArrow, IconPhone, IconX } from "@/components/icons";

function Wordmark() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-display text-2xl font-medium tracking-wide text-cream">FIORE</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold">Eventy</span>
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // pełnoekranowe menu mobilne: stagger pozycji, Escape zamyka, scroll lock
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    closeBtnRef.current?.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | undefined;
    if (!reduced && menuRef.current) {
      ctx = gsap.context(() => {
        gsap.from("[data-menu-item]", {
          opacity: 0,
          y: 28,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.07,
        });
      }, menuRef);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // prosty focus trap: Tab krąży wewnątrz pełnoekranowego menu
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>("a[href], button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
      ctx?.revert();
      hamburgerRef.current?.focus(); // fokus wraca na przycisk menu
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // po zamknięciu menu daj przeglądarce jedną klatkę na odblokowanie scrolla
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-b border-line bg-[rgba(18,16,14,0.72)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
          >
            <Wordmark />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Nawigacja główna">
            {nawigacja.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
                className="text-sm text-cream-dim transition-colors hover:text-cream"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <a
              href={firma.telefonHref}
              className="hidden text-sm text-cream-dim transition-colors hover:text-gold md:block"
            >
              {firma.telefon}
            </a>
            <button
              onClick={() => go("sprawdz-date")}
              className="group hidden items-center gap-2.5 rounded-full bg-gold py-2 pl-5 pr-2 text-sm font-medium text-ink transition-colors hover:bg-gold-soft md:flex"
            >
              Sprawdź datę
              <span className="grid size-7 place-items-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5">
                <IconArrow className="size-4" />
              </span>
            </button>
            <button
              ref={hamburgerRef}
              onClick={() => setOpen(true)}
              className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label="Otwórz menu"
              aria-expanded={open}
            >
              <span className="h-px w-6 bg-cream" />
              <span className="h-px w-6 bg-cream" />
              <span className="h-px w-4 self-end mr-2 bg-gold" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="noise fixed inset-0 z-[60] flex flex-col bg-ink"
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Wordmark />
            <button
              ref={closeBtnRef}
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-line text-cream"
              aria-label="Zamknij menu"
            >
              <IconX className="size-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Menu mobilne">
            {nawigacja.map((n) => (
              <a
                key={n.id}
                data-menu-item
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
                className="py-2 font-display text-4xl font-medium text-cream transition-colors hover:text-gold"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="px-5 pb-8" data-menu-item>
            <a
              href={firma.telefonHref}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gold px-6 py-4 text-lg font-medium text-ink"
            >
              <IconPhone className="size-5" />
              {firma.telefon}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
