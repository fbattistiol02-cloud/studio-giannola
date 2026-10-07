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
