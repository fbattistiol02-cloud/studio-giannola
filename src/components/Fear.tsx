import { CONTENT } from "@/data/content";
import { Breath } from "./Breath";

export function Fear() {
  const { fear } = CONTENT;
  return (
    <section className="section fear" data-qa="fear" aria-labelledby="fear-title">
      <div className="container">
        <div className="fear-band grid grid-12 fear-grid">
          <div className="fear-text">
            <span className="kicker" data-reveal>{fear.kicker}</span>
            <h2 className="h2" id="fear-title" data-reveal>
              {fear.title} <em className="accent">{fear.accent}</em>
            </h2>
            <ol className="steps">
              {fear.steps.map((s, i) => (
                <li className="step" data-qa="fear-step" key={s.label}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <span className="step-label">{s.label}</span>
                  <div>
                    <h3 className="h3">{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="fear-breath">
            <Breath />
          </div>
        </div>
      </div>
    </section>
  );
}
