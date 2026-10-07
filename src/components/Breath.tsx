import { useEffect, useRef, useState } from "react";
import { CONTENT } from "@/data/content";
import { gsap } from "@/lib/gsap";
import { motionAllowed } from "@/lib/motion";

const INHALE = 4;
const EXHALE = 6;

/**
 * Il cerchio del respiro: 4 s dentro, 6 s fuori, finché è sullo schermo.
 * Passo 1 visibile alla partenza, passo n+1 all'espirazione del respiro n.
 * Pulsante Pausa (WCAG 2.2.2). Senza movimento: cerchio fermo, passi già visibili.
 */
export function Breath() {
  const { fear } = CONTENT;
  const ref = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const visibleRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const core = el.querySelectorAll(".breath-core, .breath-ring");
    const steps = [...(el.closest("section")?.querySelectorAll<HTMLElement>('[data-qa="fear-step"]') ?? [])];
    let shown = 0;
    const showNext = () => {
      const step = steps[shown++];
      if (step) gsap.to(step, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", onComplete: () => step.classList.add("is-shown") });
    };
    const setPhase = (t: string) => {
      if (phaseRef.current) phaseRef.current.textContent = t;
    };

    gsap.set(core, { scale: 0.72 });
    const tl = gsap.timeline({ repeat: -1, paused: true });
    tl.call(() => setPhase(fear.inhale), [], 0)
      .to(core, { scale: 1, duration: INHALE, ease: "sine.inOut", stagger: 0.12 }, 0)
      .call(() => {
        setPhase(fear.exhale);
        showNext();
      }, [], INHALE)
      .to(core, { scale: 0.72, duration: EXHALE, ease: "sine.inOut", stagger: 0.12 }, INHALE);
    tlRef.current = tl;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (shown === 0) showNext();
          if (playingRef.current) tl.play();
        } else tl.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tl.kill();
      tlRef.current = null;
    };
  }, [fear.exhale, fear.inhale]);

  const toggle = () => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    const tl = tlRef.current;
    if (!tl) return;
    if (next && visibleRef.current) tl.play();
    else tl.pause();
  };

  return (
    <>
      <div className="breath" data-qa="breath" ref={ref}>
        <span className="breath-ring" aria-hidden="true" />
        <span className="breath-ring r2" aria-hidden="true" />
        <span className="breath-core" aria-hidden="true" />
        <p className="breath-label">
          {fear.invite}
          <span className="breath-phase" ref={phaseRef} />
        </p>
      </div>
      <button type="button" className="btn btn-secondary btn-small breath-pause" data-qa="breath-pause" aria-pressed={!playing} onClick={toggle}>
        {playing ? fear.pause : fear.resume}
      </button>
    </>
  );
}
