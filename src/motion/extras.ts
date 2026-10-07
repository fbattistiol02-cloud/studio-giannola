/**
 * "Belli da avere" (Task 8): la lettera che si scrive, le icone delle cure
 * che si disegnano, il preventivo che si apre. Tutti spenti senza movimento.
 */
import { gsap, SplitText } from "@/lib/gsap";
import { motionAllowed } from "@/lib/motion";

const INK = "#0e3a5b";
const GREY = "#7f97aa";

/** Le parole della lettera passano da grigio a blu con lo scorrimento; poi si sottolinea la firma. */
export function letterWrite(letter: HTMLElement): () => void {
  if (!motionAllowed()) return () => undefined;
  const body = letter.querySelector<HTMLElement>(".letter-body");
  const underline = letter.querySelector<SVGPathElement>(".sign-underline");
  if (!body) return () => undefined;
  const split = SplitText.create(body.querySelectorAll("p"), { type: "words", wordsClass: "letter-word" });
  const words = gsap.fromTo(
    split.words,
    { color: GREY },
    {
      color: INK,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: body, start: "top 75%", end: "bottom 55%", scrub: 0.4 },
    },
  );
  const sign = underline
    ? gsap.fromTo(
        underline,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.9, ease: "power2.inOut", scrollTrigger: { trigger: underline, start: "top 85%" } },
      )
    : null;
  return () => {
    words.scrollTrigger?.kill();
    words.kill();
    sign?.scrollTrigger?.kill();
    sign?.kill();
    split.revert();
  };
}

/**
 * Le icone delle cure si disegnano quando entrano nello schermo (stagger tra le card
 * visibili insieme), poi 4 icone fanno un piccolo gesto, una volta sola.
 */
export function curesDraw(section: HTMLElement): () => void {
  if (!motionAllowed()) return () => undefined;
  const icons = [...section.querySelectorAll<SVGSVGElement>(".cure-icon")];
  gsap.set(icons.flatMap((i) => [...i.querySelectorAll("path")]), { drawSVG: "0%" });
  const gesture = (icon: SVGSVGElement) => {
    const part = (name: string) => icon.querySelector(`[data-part="${name}"]`);
    switch (icon.dataset.icon) {
      case "otturazioni":
        return gsap.from(part("fill"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5, ease: "back.out(1.6)" });
      case "impianti":
        return gsap.from(part("screw"), { y: -6, duration: 0.6, ease: "back.out(1.6)" });
      case "igiene":
        return gsap.from(part("sparkle"), { x: -4, opacity: 0, duration: 0.5, ease: "expo.out" });
      case "bambini":
        return gsap.fromTo(part("smile"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.out" });
      default:
        return null;
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          const icon = e.target as SVGSVGElement;
          io.unobserve(icon);
          const smile = icon.querySelector('[data-part="smile"]');
          const paths = [...icon.querySelectorAll("path")].filter((p) => p !== smile);
          gsap
            .timeline({ delay: i * 0.08 })
            .to(paths, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" })
            .add(() => {
              gesture(icon);
            }, 0.9);
        });
    },
    { threshold: 0.6 },
  );
  icons.forEach((icon) => io.observe(icon));
  return () => io.disconnect();
}

/** Il foglio del preventivo si apre (metà superiore che ruota) e le righe si compilano. */
export function estimateOpen(estimate: HTMLElement): () => void {
  if (!motionAllowed()) return () => undefined;
  const top = estimate.querySelector<HTMLElement>(".sheet-top");
  const lines = estimate.querySelectorAll<HTMLElement>(".sheet-line");
  if (!top) return () => undefined;
  gsap.set(top, { rotateX: -180 });
  gsap.set(lines, { scaleX: 0 });
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap
        .timeline()
        .to(top, { rotateX: 0, duration: 0.9, ease: "power3.inOut", clearProps: "transform" })
        .to(lines, { scaleX: 1, duration: 0.5, stagger: 0.15, ease: "expo.out", clearProps: "transform" }, 0.6);
    },
    { threshold: 0.5 },
  );
  io.observe(estimate);
  return () => io.disconnect();
}
