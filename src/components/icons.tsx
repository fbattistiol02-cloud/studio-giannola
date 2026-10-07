/** Piccole icone a linea disegnate per questo sito (stesso tratto dei testi). */
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const PhoneIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);
export const PinIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const AccessIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M12 7v6h4.5l2 5M12 10h4M9 9.5a6 6 0 1 0 6.6 9" />
  </svg>
);
export const CalendarIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4" />
  </svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4.5 12.5l4.5 4.5 10.5-11" />
  </svg>
);
export const ArrowDownIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

/** Il marchio: il profilo dell'arco con la G in corsivo. */
export const BrandMark = ({ className }: P) => (
  <svg viewBox="0 0 36 44" className={className} aria-hidden="true" focusable="false">
    <path
      d="M2 43V18A16 16 0 0 1 34 18v25"
      fill="none"
      stroke="var(--verona)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <text
      x="18"
      y="34"
      textAnchor="middle"
      fontFamily="Fraunces Variable, Georgia, serif"
      fontStyle="italic"
      fontSize="22"
      fill="var(--ink)"
      style={{ fontVariationSettings: '"opsz" 72, "wght" 480, "SOFT" 100, "WONK" 1' }}
    >
      G
    </text>
  </svg>
);
