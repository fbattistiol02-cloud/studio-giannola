import { motionAllowed } from "@/lib/motion";
import { gsap } from "@/lib/gsap";
import { formatRating } from "@/lib/rating";

/**
 * I blocchi [data-reveal] salgono di 18px con dissolvenza quando entrano nello schermo,
 * una volta sola. Transizione CSS (classe is-in); quelli che entrano insieme
 * arrivano uno dopo l'altro (80 ms).
 */
export function revealBlocks(root: HTMLElement): () => void {
  const els = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
  if (!motionAllowed() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return () => undefined;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.setProperty("--delay", `${i * 80}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
        });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}


/** Chiama `cb` una volta quando `el` entra nello schermo (soglia `threshold`). */
function onceInView(el: Element, cb: () => void, threshold = 0.3): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { threshold },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Oltre 80px di scorrimento l'intestazione diventa una pillola (classe is-pill). */
export function headerPill(header: HTMLElement): () => void {
  const update = () => header.classList.toggle("is-pill", window.scrollY > 80);
  update();
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}

/** Il voto conta da 0,0 a 4,4 e le stelle si riempiono, quando entrano nello schermo. */
export function countRating(el: HTMLElement, value: number): () => void {
  if (!motionAllowed()) return () => undefined;
  const fill = el.closest("section")?.querySelector<HTMLElement>('[data-qa="stars-fill"]');
  el.textContent = formatRating(0);
  return onceInView(el, () => {
    const n = { v: 0 };
    gsap.to(n, {
      v: value,
      duration: 1.2,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = formatRating(Math.round(n.v * 10) / 10);
      },
    });
    if (fill)
      gsap.fromTo(
        fill,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "expo.out", onComplete: () => fill.classList.add("is-done") },
      );
  });
}

/** L'evidenziatore passa sulle frasi chiave quando la citazione è al 60% della vista. */
export function highlightQuotes(root: HTMLElement): () => void {
  const quotes = [...root.querySelectorAll<HTMLElement>('[data-qa="quote"]')];
  if (!motionAllowed()) return () => undefined;
  const stops = quotes.map((q) => onceInView(q, () => q.classList.add("is-lit"), 0.6));
  return () => stops.forEach((s) => s());
}

/** La mappa: l'Adige si disegna, compare l'Arena, poi cade il segnaposto. */
export function mapEntrance(map: SVGSVGElement): () => void {
  if (!motionAllowed()) return () => undefined;
  const river = map.querySelector(".map-river");
  const arena = map.querySelector(".map-arena");
  const pin = map.querySelector<SVGGElement>('[data-qa="map-pin"]');
  const wave = map.querySelector(".map-pin-wave");
  const dropGroup = map.querySelector(".map-pin-drop");
  if (!pin) return () => undefined;
  let dropped = false;
  let fallback = 0;
  const drop = () => {
    if (dropped) return;
    dropped = true;
    gsap
      .timeline()
      .set(pin, { opacity: 1 })
      .fromTo(dropGroup, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 0)
      .fromTo(wave, { scale: 0, opacity: 0.4, transformOrigin: "50% 50%" }, { scale: 1.8, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.45);
  };
  const mo = new MutationObserver(() => pin.classList.contains("is-reached") && drop());
  mo.observe(pin, { attributes: true, attributeFilter: ["class"] });
  const stop = onceInView(map, () => {
    if (river) gsap.fromTo(river, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" });
    if (arena) gsap.to(arena, { opacity: 1, duration: 0.4, delay: 0.6 });
    if (pin.classList.contains("is-reached")) drop();
    else fallback = window.setTimeout(drop, 1600);
  });
  return () => {
    stop();
    mo.disconnect();
    window.clearTimeout(fallback);
  };
}
