/**
 * Dati fissi dello studio (verificati il 7/10/2026 su Google Maps e sugli elenchi).
 * Ciò che è marcato "DA CONFERMARE" va verificato con il dottore.
 * Vedi docs/BRIEF.md, §1.
 */

export const SITE_URL: string = __SITE_URL__;

export type OpeningRange = [string, string];
export type OpeningDay = {
  /** 0 = domenica … 6 = sabato */
  weekday: number;
  ranges: OpeningRange[];
};

const weekdayHours: OpeningRange[] = [
  ["09:00", "12:00"],
  ["15:00", "19:00"],
];

export const CLINIC = {
  name: "Studio Dentistico Giannola",
  doctor: "Dott. Giannola",
  area: "Santa Lucia",
  city: "Verona",
  street: "Salita Santa Lucia, 2",
  postalCode: "37137",
  address: "Salita Santa Lucia, 2 — 37137 Verona",
  phoneDisplay: "045 567924",
  phoneHref: "tel:+39045567924",
  geo: { lat: 45.4227407, lng: 10.9596648 },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Studio%20Dentistico%20Giannola%2C%20Salita%20Santa%20Lucia%202%2C%2037137%20Verona",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=Salita%20Santa%20Lucia%202%2C%2037137%20Verona",
  /** Orari leggibili (da Google Maps). DA CONFERMARE: altri elenchi riportano orari diversi. */
  hours: [
    { day: "Da lunedì a venerdì", time: "9:00 – 12:00 e 15:00 – 19:00", weekdays: [1, 2, 3, 4, 5] },
    { day: "Sabato e domenica", time: "Chiuso", weekdays: [6, 0] },
  ],
  /** Gli stessi orari in forma strutturata, per "Aperto ora". */
  schedule: [1, 2, 3, 4, 5].map((weekday) => ({ weekday, ranges: weekdayHours })) as OpeningDay[],
  accessibility: [
    "Ingresso accessibile in sedia a rotelle",
    "Bagno accessibile",
    "Parcheggio accessibile",
  ],
  payments: "Si paga anche con carta e telefono",
  google: { rating: 4.4, count: 27 },
  /** Foto stock di esempio: si sostituisce con le foto vere dello studio dopo il sì. */
  photo: {
    src: "/foto/studio.webp",
    srcMobile: "/foto/studio-800.webp",
    width: 1600,
    height: 1067,
    /** Inquadratura dentro l'arco: la poltrona al centro. */
    position: "58% 50%",
    alt: "Uno studio dentistico luminoso (foto di esempio)",
    stock: true,
  },
} as const;
