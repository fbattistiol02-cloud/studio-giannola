import { useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Letter } from "./components/Letter";
import { Reviews } from "./components/Reviews";
import { Cures } from "./components/Cures";
import { Fear } from "./components/Fear";
import { Visit } from "./components/Visit";
import { Footer } from "./components/Footer";
import { initMotion } from "./lib/gsap";
import { CLINIC } from "./data/site";
import { countRating, headerPill, highlightQuotes, mapEntrance, revealBlocks } from "./motion/small";
import { drawVein } from "./motion/vein";

export default function App() {
  useEffect(() => {
    const motion = initMotion();
    const stopReveal = revealBlocks(document.body);
    const stopVein = drawVein([...document.querySelectorAll<SVGPathElement>("[data-vein]")]);
    const q = <T extends Element>(sel: string) => document.querySelector<T>(sel)!;
    const stops = [
      headerPill(q<HTMLElement>('[data-qa="header"]')),
      countRating(q<HTMLElement>('[data-qa="rating-value"]'), CLINIC.google.rating),
      highlightQuotes(q<HTMLElement>('[data-qa="reviews"]')),
      mapEntrance(q<SVGSVGElement>('[data-qa="map"]')),
    ];
    return () => {
      stops.forEach((s) => s());
      stopVein();
      stopReveal();
      motion.destroy();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto">
        <Hero />
        <Letter />
        <Reviews />
        <Cures />
        <Fear />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
