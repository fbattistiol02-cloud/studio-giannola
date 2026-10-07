import { gsap } from "@/lib/gsap";
import { motionAllowed } from "@/lib/motion";

/** Dove si disegna ogni segmento: sezione di riferimento e finestra di scorrimento. */
const WINDOWS: Record<string, { section: string; start: string; end: string }> = {
  a: { section: '[data-qa="letter"]', start: "top 80%", end: "bottom 60%" },
  b: { section: '[data-qa="reviews"]', start: "top 80%", end: "bottom 60%" },
  c: { section: '[data-qa="map"]', start: "top 85%", end: "center 60%" },
};

/**
 * La vena di marmo si disegna con lo scorrimento (scrub). Alla fine del segmento C
 * il segnaposto della mappa riceve `is-reached` (fa partire la sua caduta).
 * Senza movimento i segmenti restano disegnati, come nell'HTML.
 */
export function drawVein(segments: SVGPathElement[]): () => void {
  if (!motionAllowed()) return () => undefined;
  const pin = document.querySelector('[data-qa="map-pin"]');
  const tweens = segments.map((path) => {
    const w = WINDOWS[path.dataset.vein ?? ""];
    const trigger = w && document.querySelector(w.section);
    if (!w || !trigger) return null;
    return gsap.fromTo(
      path,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger,
          start: w.start,
          end: w.end,
          scrub: 0.6,
          onUpdate: (self) => {
            if (path.dataset.vein === "c" && self.progress > 0.98) pin?.classList.add("is-reached");
          },
          onLeave: () => {
            if (path.dataset.vein === "c") pin?.classList.add("is-reached");
          },
        },
      },
    );
  });
  return () =>
    tweens.forEach((t) => {
      t?.scrollTrigger?.kill();
      t?.kill();
    });
}
