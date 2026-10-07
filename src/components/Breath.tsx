import { CONTENT } from "@/data/content";

/** Il cerchio del respiro (statico; l'animazione arriva nel Task 6). */
export function Breath() {
  const { fear } = CONTENT;
  return (
    <div className="breath" data-qa="breath">
      <span className="breath-ring" aria-hidden="true" />
      <span className="breath-ring r2" aria-hidden="true" />
      <span className="breath-core" aria-hidden="true" />
      <p className="breath-label">
        {fear.invite}
        <span className="breath-phase" />
      </p>
    </div>
  );
}
