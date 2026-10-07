import { CLINIC } from "@/data/site";
import { CONTENT } from "@/data/content";
import { CheckIcon } from "./icons";
import { VeronaMap } from "./VeronaMap";

export function Visit() {
  const { visit } = CONTENT;
  return (
    <section className="section visit" id="contatti" data-qa="visit" aria-labelledby="visit-title">
      <div className="container">
        <div className="grid grid-12 visit-grid">
          <div className="visit-info">
            <div>
              <span className="kicker" data-reveal>{visit.kicker}</span>
              <h2 className="h2" id="visit-title" data-reveal>
                {visit.title} <em className="accent">{visit.accent}</em>
              </h2>
              <p className="lead" style={{ marginTop: "1.25rem" }} data-reveal>
                {CLINIC.address}
              </p>
            </div>
            <div className="info-block" data-reveal>
              <h3>{visit.hoursTitle}</h3>
              <dl className="hours">
                {CLINIC.hours.map((h) => (
                  <div key={h.day}>
                    <dt>{h.day}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="muted" style={{ marginTop: "0.75rem" }}>
                {visit.appointment}
              </p>
            </div>
            <div className="info-block" data-reveal>
              <h3>{visit.accessTitle}</h3>
              <ul className="checks">
                {visit.access.map((a) => (
                  <li key={a}>
                    <CheckIcon />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <p className="note" data-reveal>{visit.insurance}</p>
          </div>
          <div className="visit-map" data-reveal>
            <figure className="map-figure">
              <VeronaMap />
            </figure>
            <p className="map-links">
              <a href={CLINIC.mapsHref} target="_blank" rel="noopener noreferrer">
                {visit.mapLink}
              </a>
              <a href={CLINIC.directionsHref} target="_blank" rel="noopener noreferrer">
                {visit.directions}
              </a>
            </p>
          </div>
        </div>
        <div className="call-block" data-reveal>
          <p>{visit.callTitle}</p>
          <a className="phone-cta" data-qa="phone-cta" href={CLINIC.phoneHref}>
            {CLINIC.phoneDisplay}
          </a>
          <p>{visit.appointment}</p>
        </div>
      </div>
    </section>
  );
}
