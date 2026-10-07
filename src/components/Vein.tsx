/** Segmenti della vena di marmo (decorativi). Il segmento C vive dentro la mappa. */
const PATHS = {
  a: { viewBox: "0 0 40 1000", d: "M20 0C6 140 34 300 20 460S6 760 22 1000" },
  b: {
    viewBox: "0 0 1000 1000",
    d: "M20 0C18 250 12 600 40 820S260 975 520 975S930 960 975 760S985 420 990 300",
  },
} as const;

export function Vein({ segment }: { segment: keyof typeof PATHS }) {
  const p = PATHS[segment];
  return (
    <svg
      className={`vein vein-${segment}`}
      viewBox={p.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={p.d} data-qa="vein" data-vein={segment} />
    </svg>
  );
}
