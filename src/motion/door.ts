import { gsap, ScrollTrigger, SplitText, EASE_IN_OUT, EASE_OUT } from "@/lib/gsap";
import { markIntroSeen } from "@/lib/motion";

/** Stato finale della parola in corsivo (uguale al CSS di .accent). */
const ACCENT_FINAL = { "--wght": 560, "--soft": 100, "--wonk": 1 };
const ACCENT_START = { "--wght": 300, "--soft": 0, "--wonk": 0 };
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/** Aspetta i font (le righe del titolo dipendono da loro), al massimo 400 ms. */
const fontsReady = () =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 400))]);

/**
 * La porta che si apre: l'arco si disegna, le ante si aprono sulla foto,
 * il titolo sale riga per riga e "Santa Lucia." passa da sottile a pieno.
 * ≤ 1,9 s; si salta con un tocco; alla fine si segna come vista.
 */
export function playDoorIntro(hero: HTMLElement): { ready: Promise<void>; kill(): void } {
  const root = document.documentElement;
  const q = <T extends Element>(sel: string) => hero.querySelector<T>(sel)!;
  const outline = q<SVGPathElement>('[data-qa="door"] path');
  const leaves = hero.querySelectorAll<HTMLElement>('[data-qa="door-leaf"]');
  const img = q<HTMLImageElement>('[data-qa="hero-photo"] img');
  const title = q<HTMLElement>('[data-qa="hero-title"]');
  const accent = title.querySelector<HTMLElement>(".accent")!;
  const lead = q<HTMLElement>(".hero-lead");
  const actions = q<HTMLElement>(".hero-actions");
  const points = hero.querySelectorAll<HTMLElement>('[data-qa="hero-points"] li');

  let tl: gsap.core.Timeline | null = null;
  let split: SplitText | null = null;
  let killed = false;
  const skip = () => tl?.progress(1);
  const removeSkip = () => SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));

  const finish = () => {
    removeSkip();
    markIntroSeen();
    root.classList.remove("intro");
    split?.revert();
    split = null;
    accent.style.width = "";
    gsap.set([outline.closest("svg"), img, title, lead, actions, ...points, accent], { clearProps: "all" });
    gsap.set(leaves, { clearProps: "transform" });
  };

  const ready = fontsReady().then(() => {
    if (killed) return;
    (window as unknown as { __sgIntroStart?: number }).__sgIntroStart = performance.now();
    // la parola in corsivo: larghezza bloccata sullo stato finale, così non sposta nulla
    // "Santa Lucia." resta un blocco unico (non va spezzata su due righe)
    split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "hero-line", ignore: ".accent" });
    accent.style.width = `${accent.getBoundingClientRect().width}px`;

    tl = gsap.timeline({ onComplete: finish });
    tl.set(outline.closest("svg"), { visibility: "visible" }, 0)
      .set(title, { visibility: "visible" }, 0)
      .fromTo(outline, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: EASE_IN_OUT }, 0)
      .fromTo(leaves[0], { xPercent: 0 }, { xPercent: -101, duration: 0.8, ease: "power3.inOut" }, 0.7)
      .fromTo(leaves[1], { xPercent: 0 }, { xPercent: 101, duration: 0.8, ease: "power3.inOut" }, 0.7)
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 0.9, ease: EASE_OUT }, 0.7)
      .fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12, ease: EASE_OUT }, 0.45)
      .fromTo(accent, ACCENT_START, { ...ACCENT_FINAL, duration: 0.9, ease: "power2.out" }, 0.9)
      .fromTo([lead, actions], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: EASE_OUT }, 1.05)
      .fromTo(points, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: EASE_OUT }, 1.2);
    SKIP_EVENTS.forEach((ev) => window.addEventListener(ev, skip, { passive: true, once: true }));
  });

  return {
    ready,
    kill() {
      killed = true;
      removeSkip();
      tl?.kill();
      split?.revert();
    },
  };
}

/** Visite successive (e dopo l'apertura): la foto scende appena mentre l'hero esce. */
export function heroParallax(hero: HTMLElement): () => void {
  const picture = hero.querySelector('[data-qa="hero-photo"] picture');
  if (!picture) return () => undefined;
  const tween = gsap.to(picture, {
    yPercent: 8,
    scale: 1.04,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export { ScrollTrigger };
