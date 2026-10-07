/**
 * Movimento: un solo punto per decidere se animare.
 * Le classi su <html> (js, motion, intro) le mette lo script inline in index.html
 * prima del primo disegno; questo modulo le rilegge e gestisce "apertura già vista".
 */
export const INTRO_KEY = "sg-intro-v1";

/** false sul server e con "riduci movimento" attivo sul dispositivo. */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldPlayIntro({ motionOk, seen }: { motionOk: boolean; seen: boolean }): boolean {
  return motionOk && !seen;
}

/** Lo storage può non esserci (navigazione privata, browser interni): mai errori. */
export function readIntroSeen(): boolean {
  try {
    return globalThis.localStorage?.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    globalThis.localStorage?.setItem(INTRO_KEY, "1");
  } catch {
    /* storage non disponibile: l'apertura ripartirà alla prossima visita */
  }
}
