"use client";

// Stan globalny „data + pakiet" — przenosi wybór z hera do kreatora i do
// formularza (§5.1, §5.4, §5.9). Prosty Context zamiast Zustand — zero zależności.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Booking = {
  /** data imprezy ISO yyyy-mm-dd ("" = nie wybrano) */
  date: string;
  setDate: (d: string) => void;
  /** id typu imprezy z content.ts (typyImprez) */
  typ: string;
  setTyp: (t: string) => void;
  /** id zaznaczonych atrakcji w kreatorze */
  wybrane: string[];
  toggleAtrakcja: (id: string) => void;
  setWybrane: (ids: string[]) => void;
  usunAtrakcje: (id: string) => void;
  /** id zaznaczonych dodatków */
  addons: string[];
  toggleAddon: (id: string) => void;
  /** czy panel w herze sprawdził dostępność dla `date` */
  sprawdzono: boolean;
  setSprawdzono: (v: boolean) => void;
};

const Ctx = createContext<Booking | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [date, setDateRaw] = useState("");
  const [typ, setTyp] = useState("wesele");
  const [wybrane, setWybrane] = useState<string[]>([]);
  const [addons, setAddons] = useState<string[]>([]);
  const [sprawdzono, setSprawdzono] = useState(false);

  const setDate = useCallback((d: string) => {
    setDateRaw(d);
    setSprawdzono(false); // zmiana daty unieważnia wynik sprawdzenia z hera
  }, []);

  const toggleAtrakcja = useCallback((id: string) => {
    setWybrane((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);
  const usunAtrakcje = useCallback((id: string) => {
    setWybrane((w) => w.filter((x) => x !== id));
  }, []);
  const toggleAddon = useCallback((id: string) => {
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  }, []);

  const value = useMemo<Booking>(
    () => ({
      date,
      setDate,
      typ,
      setTyp,
      wybrane,
      toggleAtrakcja,
      setWybrane,
      usunAtrakcje,
      addons,
      toggleAddon,
      sprawdzono,
      setSprawdzono,
    }),
    [date, setDate, typ, wybrane, toggleAtrakcja, usunAtrakcje, addons, toggleAddon, sprawdzono],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): Booking {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking musi być użyty wewnątrz <BookingProvider>");
  return ctx;
}
