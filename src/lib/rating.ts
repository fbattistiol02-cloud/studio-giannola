/** Percentuale di riempimento delle stelle: 4,4 su 5 → 88. */
export function starFillPercent(rating: number, max = 5): number {
  return Math.round((Math.min(Math.max(rating, 0), max) / max) * 100);
}

/** Voto all'italiana, con la virgola: 4.4 → "4,4". */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}
