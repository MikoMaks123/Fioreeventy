// ─────────────────────────────────────────────────────────────────────────────
// FIORE EVENTY — JEDYNE ŹRÓDŁO TREŚCI I DANYCH CAŁEJ STRONY (demo).
// Po rozmowie z klientką podmieniasz wartości TUTAJ — nigdzie indziej.
// Wszystko z komentarzem `TODO: dane od klientki` to wartości tymczasowe.
// Zasada honesty gate: wartość null => komponent, który ją pokazuje,
// nie renderuje się w ogóle.
// ─────────────────────────────────────────────────────────────────────────────

export const firma = {
  nazwa: "Fiore Eventy",
  miasto: "Warszawa", // TODO: dane od klientki
  promienKm: 100, // TODO: dane od klientki
  telefon: "+48 000 000 000", // TODO: dane od klientki
  telefonHref: "tel:+48000000000", // TODO: dane od klientki
  email: "kontakt@fioreeventy.pl", // TODO: dane od klientki
  facebook: "https://www.facebook.com/fiore.eventy/",
  instagram: null as string | null, // TODO: dane od klientki — null => ikona IG się nie renderuje
  liczbaImprez: null as number | null, // TODO: dane od klientki — null => pasek liczb się NIE renderuje
  rokZalozenia: null as number | null, // TODO: dane od klientki
  // TODO: docelowa domena; na GitHub Pages nadpisywane w workflow deployu
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiore-eventy.vercel.app",
};

// ── Typy imprez (hero, kreator, formularz) ───────────────────────────────────
export type TypImprezy = { id: string; label: string; short: string };
export const typyImprez: TypImprezy[] = [
  { id: "wesele", label: "Wesele", short: "Wesele" },
  { id: "urodziny", label: "Urodziny", short: "Urodziny" },
  { id: "dziecieca", label: "Impreza dziecięca", short: "Dziecięca" },
  { id: "komunia", label: "Komunia", short: "Komunia" },
  { id: "firmowa", label: "Event firmowy", short: "Firmowa" },
];

// ── Atrakcje (potwierdzone przez profil FB) ──────────────────────────────────
export type Atrakcja = {
  id: string;
  nazwa: string;
  haslo: string; // jedno zdanie korzyści na zdjęciu
  cenaOd: number; // TODO: dane od klientki — ceny orientacyjne do demo
  czas: string; // TODO: dane od klientki
  spec: string[]; // 4 wiersze rozwijanej specyfikacji
  img: string;
  imgAlt: string;
  confirmed: boolean;
};

export const atrakcje: Atrakcja[] = [
  {
    id: "fotobudka",
    nazwa: "Fotobudka",
    haslo: "Goście wchodzą we dwoje, wychodzą w ósemkę.",
    cenaOd: 800, // TODO: dane od klientki
    czas: "do 4 godzin", // TODO: dane od klientki
    spec: [
      "nielimitowane wydruki",
      "rekwizyty w cenie",
      "obsługa przez cały czas",
      "zdjęcia cyfrowe do pobrania po imprezie",
    ],
    img: "/img/att-fotobudka.webp",
    imgAlt: "Goście pozujący z rekwizytami w fotobudce podczas wesela",
    confirmed: true,
  },
  {
    id: "fotomagnesy",
    nazwa: "Fotomagnesy",
    haslo: "Jedyna pamiątka z wesela, która następnego dnia ląduje na lodówce.",
    cenaOd: 600, // TODO: dane od klientki
    czas: "do 3 godzin", // TODO: dane od klientki
    spec: [
      "magnes gotowy w 60 sekund",
      "dla każdego gościa",
      "personalizacja z datą i imionami",
      "praca na miejscu, bez dosyłania",
    ],
    img: "/img/att-fotomagnesy.webp",
    imgAlt: "Wydrukowane zdjęcia-magnesy z imprezy rozłożone na stole",
    confirmed: true,
  },
  {
    id: "dmuchance",
    nazwa: "Dmuchańce",
    haslo: "Dzieci zajęte. Rodzice wreszcie na parkiecie.",
    cenaOd: 500, // TODO: dane od klientki
    czas: "cały czas imprezy", // TODO: dane od klientki
    spec: [
      "montaż i demontaż po naszej stronie",
      "atest i ubezpieczenie",
      "wersje na salę i na zewnątrz",
      "dobór rozmiaru do miejsca",
    ],
    img: "/img/att-dmuchance.webp",
    imgAlt: "Dzieci bawiące się na kolorowym dmuchanym zamku",
    confirmed: true,
  },
];

// Pozycje z profilu FB opisane jako „itp." — NIEPOTWIERDZONE.
// Render w marquee tylko przy confirmed: true (po potwierdzeniu u klientki).
export const atrakcjeDoPotwierdzenia: { nazwa: string; confirmed: boolean }[] = [
  { nazwa: "Ciężki dym", confirmed: false }, // TODO: dane od klientki
  { nazwa: "Napis LOVE", confirmed: false }, // TODO: dane od klientki
  { nazwa: "Fotolustro", confirmed: false }, // TODO: dane od klientki
];

// ── Dodatki w kreatorze pakietu ──────────────────────────────────────────────
export type Dodatek = { id: string; nazwa: string; cena: number };
export const dodatki: Dodatek[] = [
  // TODO: dane od klientki — ceny dodatków orientacyjne do demo
  { id: "personalizacja", nazwa: "Personalizacja wydruków (data i imiona)", cena: 150 },
  { id: "godzina", nazwa: "Dodatkowa godzina", cena: 200 },
  { id: "album", nazwa: "Album na zdjęcia dla pary", cena: 250 },
  { id: "dojazd", nazwa: "Dojazd powyżej 50 km", cena: 150 },
];

// ── Reguły rabatu pakietowego ────────────────────────────────────────────────
// FAZA 2: system ofert promocyjnych z datami ważności i kodami rabatowymi —
// ta tablica to dokładnie ten kształt danych, który w fazie 2 będzie edytowany
// zwykłym formularzem w panelu admina (oferty czasowe przez aktywnaOd/aktywnaDo,
// np. „-20% na terminy zimowe", plus pole `kod` dla kodów rabatowych).
export type RegulaRabatu = {
  minAtrakcji: number;
  rabat: number; // ułamek, np. 0.08 = -8%
  etykieta: string;
  aktywnaOd: string | null; // ISO yyyy-mm-dd albo null = zawsze
  aktywnaDo: string | null;
};
export const regulyRabatow: RegulaRabatu[] = [
  { minAtrakcji: 2, rabat: 0.08, etykieta: "PAKIET DUO", aktywnaOd: null, aktywnaDo: null },
  { minAtrakcji: 3, rabat: 0.15, etykieta: "PAKIET PEŁNY WIECZÓR", aktywnaOd: null, aktywnaDo: null },
];

// ── Nawigacja ────────────────────────────────────────────────────────────────
export const nawigacja = [
  { id: "atrakcje", label: "Atrakcje" },
  { id: "pakiet", label: "Pakiety" },
  { id: "jak-to-dziala", label: "Jak to działa" },
  { id: "realizacje", label: "Realizacje" },
  { id: "kontakt", label: "Kontakt" },
];

// ── Hero ─────────────────────────────────────────────────────────────────────
export const hero = {
  h1Line1: "Atrakcja, którą goście",
  h1Line2: "pamiętają dłużej niż tort.",
  lead: "Fotobudka, fotomagnesy i dmuchańce — wszystko od jednej ekipy. Sprawdź, czy jesteśmy wolni w Twoją datę.",
  mikroZaufanie: [
    { icon: "clock", text: "Przyjeżdżamy godzinę wcześniej" },
    { icon: "people", text: "Obsługa przez cały czas" },
    { icon: "print", text: "Wydruki bez limitu" },
  ] as { icon: "clock" | "people" | "print"; text: string }[],
  panel: {
    naglowek: "Kiedy się bawimy?",
    labelData: "Data imprezy",
    labelTyp: "Typ imprezy",
    cta: "Sprawdź dostępność",
    ctaPakiet: "Zbuduj pakiet na ten termin",
    bladBrakDaty: "Wybierz najpierw datę — bez niej nie sprawdzimy kalendarza.",
  },
};

// ── Sekcja atrakcji ──────────────────────────────────────────────────────────
export const sekcjaAtrakcje = {
  eyebrow: "Co stawiamy na sali",
  h2: "Trzy rzeczy, przy których ustawia się kolejka.",
  lead: "Nie mamy wszystkiego. Mamy to, co naprawdę działa.",
  szczegolyLabel: "+ Szczegóły",
  cenaOdLabel: "od",
};

// ── Kreator pakietu ──────────────────────────────────────────────────────────
export const sekcjaKreator = {
  eyebrow: "Pakiet",
  h2: "Im więcej razem, tym taniej.",
  lead: "Jedna ekipa, jeden dojazd, jedna faktura. Złóż swój wieczór.",
  labelData: "Data imprezy",
  labelTyp: "Typ imprezy",
  labelAtrakcje: "Atrakcje",
  labelDodatki: "Dodatki",
  podsumowanie: "Twój pakiet",
  pustyPakiet: "Zaznacz atrakcje po lewej — wycena pojawi się tutaj.",
  rabatLinia: "Rabat pakietowy",
  sumaLabel: "Suma orientacyjna",
  zastrzezenie: "Wycena orientacyjna. Ostateczną cenę potwierdzamy po ustaleniu miejsca i godzin.",
  cta: "Wyślij zapytanie z tym pakietem",
  sprawdzonePrefix: "Sprawdzone:",
  sprawdzoneSuffix: "atrakcji wolne w tym terminie",
};

// ── Jak to działa ────────────────────────────────────────────────────────────
export const sekcjaKroki = {
  eyebrow: "Jak to działa",
  h2: "Od daty do gotowej sali w trzech krokach.",
  kroki: [
    {
      tytul: "Sprawdzasz termin",
      opis: "Wybierasz datę, widzisz co wolne. Bez czekania na odpowiedź.",
    },
    {
      tytul: "Rezerwujesz",
      opis: "Potwierdzamy w 24 h, rezerwacja od zaliczki. Umowa mailem.",
    },
    {
      tytul: "Zjawiamy się godzinę wcześniej",
      opis: "Rozstawiamy, testujemy, czekamy na pierwszych gości. Nie musisz nic pilnować.",
    },
  ],
};

// ── Realizacje ───────────────────────────────────────────────────────────────
export const sekcjaRealizacje = {
  eyebrow: "Realizacje",
  h2: "Wieczory, które już się wydarzyły.",
  badgePrzyklad: "Przykład",
};

// Opinie w demo są OZNACZONE jako przykładowe (badge) — do podmiany na
// prawdziwe od klientki. Celowo bez nazwisk. TODO: dane od klientki.
export type Opinia = { cytat: string; imie: string; typ: string; przyklad: boolean };
export const opinie: Opinia[] = [
  {
    cytat: "Kolejka do fotobudki była dłuższa niż do baru. Zdjęcia oglądamy do dziś.",
    imie: "Magda",
    typ: "wesele",
    przyklad: true,
  },
  {
    cytat: "Magnesy rozeszły się w godzinę. Goście do dziś pytają, skąd je mieliśmy.",
    imie: "Karolina",
    typ: "urodziny",
    przyklad: true,
  },
  {
    cytat: "Dmuchaniec uratował piknik — dzieci zajęte, dorośli wreszcie przy rozmowie.",
    imie: "Tomek",
    typ: "event firmowy",
    przyklad: true,
  },
];

// ── Dla firm ─────────────────────────────────────────────────────────────────
export const sekcjaFirmy = {
  eyebrow: "Pikniki i eventy firmowe",
  h3: "Wasze logo na każdym wydruku, który gość zabiera do domu.",
  punkty: [
    "personalizowana ramka wydruku i branding obudowy",
    "raport ze zdjęciami po evencie",
    "faktura VAT, umowa, terminy płatności",
  ],
  cta: "Zapytaj o ofertę dla firm",
};

// ── FAQ ──────────────────────────────────────────────────────────────────────
export type Faq = { q: string; a: string };
export const faq: Faq[] = [
  {
    q: "Ile miejsca potrzeba na fotobudkę?",
    a: "Dwa na dwa metry i gniazdko w zasięgu. Resztą zajmujemy się my.",
  },
  {
    q: "Czy obsługa jest przez cały czas?",
    a: "Tak, ktoś od nas jest przy sprzęcie od rozstawienia do końca.",
  },
  {
    q: "Jak daleko dojeżdżacie?",
    a: `${firma.miasto} i okolice do ${firma.promienKm} km. Dalej też — po ustaleniu dojazdu.`,
  },
  {
    q: "Co z dmuchańcami na sali?",
    a: "Dobieramy rozmiar do wysokości i podłogi. Przy niskich salach mamy niższe modele.",
  },
  {
    q: "Kiedy trzeba zarezerwować?",
    a: "Soboty w sezonie schodzą z kilkumiesięcznym wyprzedzeniem. Poza sezonem bywa termin z tygodnia na tydzień.",
  },
  {
    q: "Ile kosztuje rezerwacja?",
    a: "Zaliczka przy podpisaniu umowy, reszta w dniu imprezy.",
  },
];
export const sekcjaFaq = {
  eyebrow: "Pytania",
  h2: "Zanim zadzwonisz.",
};

// ── Finalne CTA + formularz ──────────────────────────────────────────────────
export const sekcjaKontakt = {
  h2: "Sprawdźmy, czy Twój termin jest jeszcze wolny.",
  sub: "Odpisujemy tego samego dnia.",
  form: {
    labelData: "Data imprezy",
    labelTyp: "Typ imprezy",
    labelMiejsce: "Miejscowość / nazwa sali",
    labelAtrakcje: "Wybrane atrakcje",
    labelImie: "Imię",
    labelTelefon: "Telefon",
    labelEmail: "E-mail",
    labelWiadomosc: "Wiadomość (opcjonalna)",
    placeholderWiadomosc: "Ile gości? O której zaczynacie?",
    rodo: "Zgadzam się na kontakt w sprawie mojego zapytania zgodnie z",
    rodoLink: "polityką prywatności",
    cta: "Wyślij zapytanie",
    // komunikaty walidacji — po ludzku (§9)
    bladImie: "Napisz, jak masz na imię — łatwiej się rozmawia.",
    bladTelefon: "Bez numeru nie oddzwonimy.",
    bladEmail: "Ten adres wygląda na niepełny — sprawdź literówkę.",
    bladRodo: "Bez tej zgody nie możemy się odezwać.",
    bladData: "Wybierz datę imprezy.",
    bladDataPrzeszla: "Ta data już minęła — wybierz przyszły termin.",
    sukcesTytul: "Mamy Twoje zapytanie.",
    sukcesTekst: "Odezwiemy się dziś.",
    sukcesAlt: "Wolisz porozmawiać od razu?",
  },
  kontaktBok: {
    naglowek: "Wolisz bezpośrednio?",
    messenger: "Napisz na Messengerze",
  },
};

// ── Stopka ───────────────────────────────────────────────────────────────────
export const stopka = {
  zdanie: "Atrakcje na wesela, urodziny i eventy firmowe.",
  kolumny: {
    nawigacja: "Nawigacja",
    atrakcje: "Atrakcje",
    kontakt: "Kontakt",
  },
  polityka: "Polityka prywatności",
  realizacja: "Realizacja: SiteForNow",
};

// ── Mapa obrazów ─────────────────────────────────────────────────────────────
// Placeholdery z Unsplash (firma ma materiał tylko na Facebooku).
// Podmiana docelowych zdjęć = edycja TYLKO tej mapy. TODO: dane od klientki.
export type Obraz = { src: string; alt: string; w: number; h: number };
export const obrazy = {
  heroTlo: {
    src: "/img/hero-bg.webp",
    alt: "Przyciemniona sala weselna ze światłami bokeh",
    w: 1600,
    h: 1067,
  },
  // pionowy kadr tego samego ujęcia dla ekranów < 768 px (art direction)
  heroTloMobile: {
    src: "/img/hero-bg-mobile.webp",
    alt: "Przyciemniona sala weselna ze światłami bokeh",
    w: 828,
    h: 1200,
  },
  // taśma fotobudkowa w herze (desktop 4 kadry, mobile 3)
  tasma: [
    { src: "/img/strip-1.webp", alt: "Goście z rekwizytami w fotobudce", w: 480, h: 600 },
    { src: "/img/strip-2.webp", alt: "Roześmiani goście weselni", w: 480, h: 600 },
    { src: "/img/strip-3.webp", alt: "Konfetti nad parkietem", w: 480, h: 600 },
    { src: "/img/strip-4.webp", alt: "Para tańcząca pierwszy taniec", w: 480, h: 600 },
  ],
  firmy: {
    src: "/img/firm.webp",
    alt: "Fotobudka z brandingiem firmowym podczas eventu",
    w: 800,
    h: 1000,
  },
  ctaTlo: {
    src: "/img/cta-bg.webp",
    alt: "Ciemny parkiet ze światłami podczas zabawy",
    w: 1600,
    h: 1067,
  },
  // ściana magnesów — realizacje
  galeria: [
    { src: "/img/gal-1.webp", alt: "Zabawa na parkiecie weselnym", w: 560, h: 560 },
    { src: "/img/gal-2.webp", alt: "Dzieci podczas zabawy na imprezie", w: 560, h: 560 },
    { src: "/img/gal-3.webp", alt: "Toast wzniesiony przez gości", w: 560, h: 560 },
    { src: "/img/gal-4.webp", alt: "Konfetti podczas zabawy", w: 560, h: 560 },
    { src: "/img/gal-5.webp", alt: "Przyjaciele z rekwizytami fotobudki", w: 560, h: 560 },
    { src: "/img/gal-6.webp", alt: "Dzieci na dmuchanej zjeżdżalni", w: 560, h: 560 },
    { src: "/img/gal-7.webp", alt: "Para młoda wieczorem", w: 560, h: 560 },
    { src: "/img/gal-8.webp", alt: "Urodzinowe balony na sali", w: 560, h: 560 },
    { src: "/img/gal-9.webp", alt: "Uśmiechnięci goście imprezy", w: 560, h: 560 },
    { src: "/img/gal-10.webp", alt: "Nakryty stół weselny", w: 560, h: 560 },
  ],
} satisfies Record<string, Obraz | Obraz[]>;

// GitHub Pages serwuje stronę w podkatalogu — ścieżki obrazów dostają prefiks.
// Lokalnie i na Vercelu BP jest puste, więc nic się nie zmienia.
const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
if (BP) {
  for (const v of Object.values(obrazy)) {
    const lista = Array.isArray(v) ? v : [v];
    for (const o of lista) {
      if (!o.src.startsWith(BP)) o.src = `${BP}${o.src}`;
    }
  }
  for (const a of atrakcje) {
    if (!a.img.startsWith(BP)) a.img = `${BP}${a.img}`;
  }
}

// Pozycje marquee — tylko potwierdzone atrakcje (§5.2)
export const marqueeItems: string[] = [
  ...atrakcje.filter((a) => a.confirmed).map((a) => a.nazwa),
  ...atrakcjeDoPotwierdzenia.filter((a) => a.confirmed).map((a) => a.nazwa),
];

// ── SEO / metadane ───────────────────────────────────────────────────────────
export const seo = {
  title: `Fotobudka, fotomagnesy i dmuchańce — ${firma.miasto} | Fiore Eventy`,
  // 150–158 znaków, z miastem i frazą „sprawdź dostępny termin"
  description: `Fotobudka, fotomagnesy i dmuchańce na wesela, urodziny i eventy firmowe. ${firma.miasto} i okolice do ${firma.promienKm} km. Sprawdź dostępny termin online i złóż swój pakiet.`,
};
