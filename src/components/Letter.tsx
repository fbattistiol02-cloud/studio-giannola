import { CONTENT } from "@/data/content";
import { Vein } from "./Vein";

export function Letter() {
  const { letter } = CONTENT;
  return (
    <section className="section letter" data-qa="letter" aria-labelledby="letter-title">
      <Vein segment="a" />
      <div className="container grid grid-12">
        <div className="letter-main">
          <span className="kicker" data-reveal>{letter.kicker}</span>
          <h2 className="h2" id="letter-title" data-reveal>
            {letter.title} <em className="accent">{letter.accent}</em>
          </h2>
          <div className="letter-card" data-reveal>
            <p className="letter-greeting">{letter.greeting}</p>
            <div className="letter-body">
              {letter.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="letter-sign">
              <span className="letter-sign-name">{letter.sign}</span>
              <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path className="sign-underline" d="M2 9C40 3 80 12 120 7S180 4 198 8" />
              </svg>
            </div>
          </div>
        </div>
        <aside className="letter-aside" data-reveal>
          <p className="pull-quote">{letter.pull}</p>
        </aside>
      </div>
    </section>
  );
}
