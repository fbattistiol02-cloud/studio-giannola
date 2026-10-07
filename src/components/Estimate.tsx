import { CONTENT } from "@/data/content";

/** "Prima di cominciare": testo + foglio di preventivo (illustrazione decorativa). */
export function Estimate() {
  const { estimate } = CONTENT;
  return (
    <div className="estimate" data-qa="estimate" data-reveal>
      <div>
        <h3 className="h2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
          {estimate.title} <em className="accent">{estimate.accent}</em>
        </h3>
        <p>{estimate.text}</p>
      </div>
      <div className="sheet" aria-hidden="true">
        <div className="sheet-half sheet-top">
          <span className="sheet-line title" />
          <span className="sheet-line" />
          <span className="sheet-line short" />
        </div>
        <div className="sheet-half sheet-bottom">
          <span className="sheet-line" />
          <span className="sheet-line" />
          <span className="sheet-line short" />
        </div>
      </div>
    </div>
  );
}
