import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { motionAllowed } from "./motion";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
/** Gli easing del sistema (--ease-out, --ease-in-out) in forma GSAP. */
export const EASE_OUT = "expo.out";
export const EASE_IN_OUT = "power3.inOut";

declare global {
  interface Window {
    /** Lo script inline lo controlla: se JS non parte entro 3 s, toglie gli stati nascosti. */
    __sgMotion?: boolean;
  }
}

export { gsap, ScrollTrigger, SplitText };

/**
 * Avvia il motore delle animazioni: plugin GSAP e scorrimento morbido (Lenis).
 * Lenis solo se il movimento è permesso; sul telefono lo scorrimento resta nativo.
 */
export function initMotion(): { lenis: Lenis | null; destroy(): void } {
  window.__sgMotion = true;
  if (!motionAllowed()) return { lenis: null, destroy: () => undefined };

  const lenis = new Lenis({ syncTouch: false, anchors: { offset: -80 } });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return {
    lenis,
    destroy() {
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}
