import { starFillPercent } from "@/lib/rating";

const STAR = "M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z";

function Row({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 120 24" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={STAR}
          transform={`translate(${i * 24} 0)`}
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Cinque stelle riempite esattamente fino al voto (4,4 → 88%). */
export function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      <span className="stars-empty">
        <Row filled={false} />
      </span>
      <span className="stars-fill" data-qa="stars-fill" style={{ width: `${starFillPercent(rating)}%` }}>
        <Row filled />
      </span>
    </span>
  );
}
