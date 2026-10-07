import { motionAllowed } from "@/lib/motion";

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
