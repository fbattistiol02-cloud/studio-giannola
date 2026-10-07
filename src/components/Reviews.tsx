import { CLINIC } from "@/data/site";
import { CONTENT, type Quote } from "@/data/content";
import { formatRating } from "@/lib/rating";
import { Stars } from "./Stars";
import { Vein } from "./Vein";

/** Il testo della citazione con la frase chiave in <mark>. */
function QuoteText({ q }: { q: Quote }) {
  const i = q.text.indexOf(q.highlight);
  if (i < 0) return <>{q.text}</>;
  return (
    <>
      {q.text.slice(0, i)}
      <mark>{q.highlight}</mark>
      {q.text.slice(i + q.highlight.length)}
    </>
  );
}

export function Reviews() {
  const { reviews } = CONTENT;
  const value = formatRating(CLINIC.google.rating);
  return (
    <section className="section reviews" data-qa="reviews" aria-labelledby="reviews-title">
      <Vein segment="b" />
      <div className="container">
        <div className="grid grid-12 reviews-head">
          <div className="reviews-title">
            <span className="kicker" data-reveal>{reviews.kicker}</span>
            <h2 className="h2" id="reviews-title" data-reveal>
              {reviews.title} <em className="accent">{reviews.accent}</em>
            </h2>
          </div>
          <div className="rating" data-reveal>
            <span className="rating-value" data-qa="rating-value" aria-hidden="true">
              {value}
            </span>
            <Stars rating={CLINIC.google.rating} label={`${value} stelle su 5`} />
            <p className="muted">
              <span className="visually-hidden">{value} </span>
              {reviews.summary}
            </p>
          </div>
        </div>
        <div className="quotes">
          {reviews.quotes.map((q) => (
            <figure className="quote" data-qa="quote" key={q.author} data-reveal>
              <blockquote>
                <p>
                  <QuoteText q={q} />
                </p>
              </blockquote>
              <figcaption>
                <strong>{q.author}</strong> · recensione su Google
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
