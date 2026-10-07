/**
 * Mappa stilizzata (non cartografica) di Verona: l'Adige, l'Arena come riferimento,
 * lo studio a Santa Lucia (a sud-ovest del centro). La vena di marmo (segmento C)
 * entra dall'alto e finisce sul segnaposto.
 */
export const PIN = { x: 118, y: 228 } as const;

export function VeronaMap() {
  return (
    <svg
      className="map-svg"
      data-qa="map"
      viewBox="0 0 400 300"
      role="img"
      aria-label="Mappa stilizzata di Verona: lo studio è nel quartiere Santa Lucia, a sud-ovest dell'Arena."
    >
      <rect width="400" height="300" fill="var(--ice)" />
      {/* trama di strade, appena accennata */}
      <g fill="none" stroke="var(--line)" strokeWidth="1">
        <path d="M0 150C80 140 160 170 240 150S360 120 400 130" />
        <path d="M60 300C80 220 90 160 70 0" />
        <path d="M0 250C90 240 200 260 400 230" />
        <path d="M170 300C180 230 210 170 250 115" />
        <path d="M0 200C60 210 110 220 160 190" />
      </g>
      {/* l'Adige */}
      <path
        className="map-river-bed"
        d="M10 70C110 20 200 30 255 70S345 165 300 205S320 280 395 290"
        fill="none"
        stroke="var(--ice-2)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        className="map-river"
        d="M10 70C110 20 200 30 255 70S345 165 300 205S320 280 395 290"
        fill="none"
        stroke="var(--blue)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text x="322" y="150" className="map-label" fontSize="12" fill="var(--blue)" fontStyle="italic">
        Adige
      </text>
      {/* l'Arena */}
      <g className="map-arena">
        <ellipse cx="250" cy="115" rx="26" ry="19" fill="var(--white)" stroke="var(--ink)" strokeWidth="1.4" />
        <ellipse cx="250" cy="115" rx="17" ry="11" fill="none" stroke="var(--ink)" strokeWidth="1" />
        <text x="250" y="152" textAnchor="middle" fontSize="13" fill="var(--ink)" fontStyle="italic">
          Arena
        </text>
      </g>
      {/* vena di marmo, segmento C */}
      <path
        className="vein-path"
        data-qa="vein"
        data-vein="c"
        d="M0 0C40 60 20 130 70 170S112 205 118 220"
        fill="none"
      />
      {/* lo studio */}
      <g className="map-pin" data-qa="map-pin" transform={`translate(${PIN.x} ${PIN.y})`}>
        <circle className="map-pin-wave" r="10" fill="none" stroke="var(--verona)" strokeWidth="1.5" opacity="0" />
        <circle r="9" fill="var(--verona)" />
        <circle r="3.2" fill="var(--white)" />
        <text x="16" y="5" fontSize="14" fill="var(--ink)" fontWeight="600">
          Santa Lucia
        </text>
        <text x="16" y="21" fontSize="11.5" fill="var(--muted)">
          Studio Giannola
        </text>
      </g>
    </svg>
  );
}
