import { CONTENT } from "@/data/content";
import { CureIcon } from "./CureIcon";
import { Estimate } from "./Estimate";

export function Cures() {
  const { cures } = CONTENT;
  return (
    <section className="section cures" id="cure" data-qa="cures" aria-labelledby="cures-title">
      <div className="container">
        <div className="cures-head">
          <span className="kicker" data-reveal>{cures.kicker}</span>
          <h2 className="h2" id="cures-title" data-reveal>
            {cures.title} <em className="accent">{cures.accent}</em>
          </h2>
        </div>
        <ul className="cures-grid">
          {cures.items.map((c) => (
            <li className="cure" data-qa="cure" key={c.id} data-reveal>
              <CureIcon id={c.id} />
              <h3 className="h3">{c.name}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
        <Estimate />
      </div>
    </section>
  );
}
