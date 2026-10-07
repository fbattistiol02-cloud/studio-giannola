import { useEffect, useRef } from "react";
import { CLINIC } from "@/data/site";
import { motionAllowed } from "@/lib/motion";
import { heroParallax, playDoorIntro } from "@/motion/door";
import { CONTENT } from "@/data/content";
import { AccessIcon, ArrowDownIcon, CalendarIcon, PhoneIcon, PinIcon } from "./icons";

const POINT_ICONS = [PinIcon, AccessIcon, CalendarIcon];
/** Il profilo dell'arco nello stesso viewBox 4:5 della foto. */
export const ARCH_PATH = "M0 500V200A200 200 0 0 1 400 200V500";

export function Hero() {
  const { hero } = CONTENT;
  const photo = CLINIC.photo;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero || !motionAllowed()) return;
    const intro = document.documentElement.classList.contains("intro") ? playDoorIntro(hero) : null;
    const stopParallax = heroParallax(hero);
    return () => {
      intro?.kill();
      stopParallax();
    };
  }, []);

  return (
    <section className="hero" id="top" data-qa="hero" aria-labelledby="hero-title" ref={ref}>
      <div className="container grid grid-12 hero-grid">
        <div className="hero-text">
          <p className="eyebrow">{hero.kicker}</p>
          <h1 className="h1 hero-title" id="hero-title" data-qa="hero-title">
            {hero.title} <em className="accent">{hero.accent}</em>
          </h1>
          <p className="lead hero-lead">{hero.lead}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={CLINIC.phoneHref}>
              <PhoneIcon />
              {hero.ctaPrimary}
            </a>
            <a className="btn btn-secondary" href="#cure">
              {hero.ctaSecondary}
              <ArrowDownIcon />
            </a>
          </div>
          <ul className="hero-points" data-qa="hero-points">
            {hero.points.map((p, i) => {
              const Icon = POINT_ICONS[i];
              return (
                <li key={p}>
                  <Icon />
                  {p}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hero-arch">
          <div className="arch-frame">
          <figure className="arch" data-qa="hero-photo">
            <picture>
              <source media="(max-width: 700px)" srcSet={photo.srcMobile} />
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                style={{ objectPosition: photo.position }}
                {...{ fetchpriority: "high" }}
                decoding="async"
              />
            </picture>
            <span className="door-leaf door-leaf-left" data-qa="door-leaf" aria-hidden="true" />
            <span className="door-leaf door-leaf-right" data-qa="door-leaf" aria-hidden="true" />
          </figure>
          <svg className="arch-outline" data-qa="door" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
            <path d={ARCH_PATH} />
          </svg>
          </div>
          {photo.stock && <p className="photo-note">Foto di esempio</p>}
        </div>
      </div>
    </section>
  );
}
