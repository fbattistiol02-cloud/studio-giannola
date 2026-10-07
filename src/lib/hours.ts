import { CLINIC, type OpeningDay } from "@/data/site";

const DAY_NAMES = [
  "domenica",
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const pretty = (hhmm: string) => hhmm.replace(/^0/, "");

/** Ora corrente a Verona, indipendentemente dal fuso del dispositivo. */
function romeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    get("weekday"),
  );
  return {
    weekday,
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

/** Giorno della settimana a Verona (0 = domenica), indipendentemente dal fuso del dispositivo. */
export const romeWeekday = (date = new Date()) => romeNow(date).weekday;

export type OpenStatus = { open: boolean; label: string; detail: string };

export function getOpenStatus(
  date = new Date(),
  schedule: OpeningDay[] = CLINIC.schedule,
): OpenStatus {
  const { weekday, minutes } = romeNow(date);
  const today = schedule.find((d) => d.weekday === weekday);
  for (const [start, end] of today?.ranges ?? []) {
    if (minutes >= toMinutes(start) && minutes < toMinutes(end)) {
      return {
        open: true,
        label: "Aperto ora",
        detail: `chiude alle ${pretty(end)}`,
      };
    }
  }
  // prossima apertura
  for (let offset = 0; offset < 8; offset++) {
    const wd = (weekday + offset) % 7;
    const day = schedule.find((d) => d.weekday === wd);
    const next = day?.ranges.find(
      ([start]) => offset > 0 || toMinutes(start) > minutes,
    );
    if (next) {
      const when =
        offset === 0 ? "oggi" : offset === 1 ? "domani" : DAY_NAMES[wd];
      return {
        open: false,
        label: "Chiuso ora",
        detail: `riapre ${when} alle ${pretty(next[0])}`,
      };
    }
  }
  return { open: false, label: "Chiuso ora", detail: "" };
}
