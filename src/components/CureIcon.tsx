import type { CureId } from "@/data/content";

/** Il dente di base, disegnato a mano (viewBox 48×48). */
const TOOTH =
  "M14 10C9 10 7 15 8 20C9 25 11 28 12 34C13 40 15 42 17 42C19 42 20 38 21 34C22 31 26 31 27 34C28 38 29 42 31 42C33 42 35 40 36 34C37 28 39 25 40 20C41 15 39 10 34 10C30 10 28 12 24 12C20 12 18 10 14 10Z";
const CROWN =
  "M14 6C9 6 8 12 10 17C12 20 36 20 38 17C40 12 39 6 34 6C30 6 28 8 24 8C20 8 18 6 14 6Z";

/** Ogni icona: tratti (path) + parti con un piccolo gesto proprio (data-part). */
const ICONS: Record<CureId, JSX.Element> = {
  igiene: (
    <>
      <path d={TOOTH} />
      <path data-part="sparkle" d="M39 3v7M35.5 6.5h7M44 14v4M42 16h4" />
    </>
  ),
  otturazioni: (
    <>
      <path d={TOOTH} />
      <path data-part="fill" className="is-fill" d="M18.5 18C21 14.5 27 14.5 29.5 18C27 21.5 21 21.5 18.5 18Z" />
    </>
  ),
  devitalizzazioni: (
    <>
      <path d={TOOTH} />
      <path d="M20.5 22L18.5 37M27.5 22L29.5 37" />
    </>
  ),
  estrazioni: (
    <>
      <path d={TOOTH} transform="rotate(-8 24 26) translate(0 -2)" />
      <path d="M9 6l3 3M39 6l-3 3M24 2v4" />
    </>
  ),
  impianti: (
    <>
      <path d={CROWN} />
      <path data-part="screw" d="M20 21h8v4h-8zM20.5 28h7M20.5 31.5h7M21 35h6M21.5 38.5h5M23 41.5l1 3 1-3" />
    </>
  ),
  protesi: (
    <>
      <path d="M7 21C7 12 41 12 41 21" />
      <path d="M12 21v5M18 21v6M24 21v6M30 21v6M36 21v5" />
      <path d="M7 26C13 35 35 35 41 26" />
    </>
  ),
  bambini: (
    <>
      <path d={TOOTH} transform="translate(4.8 6) scale(.8)" />
      <path d="M19.5 17.5h.01M28.5 17.5h.01" strokeWidth="2.6" />
      <path data-part="smile" d="M19.5 24c2.5 3 6.5 3 9 0" />
    </>
  ),
};

export function CureIcon({ id }: { id: CureId }) {
  return (
    <svg className="cure-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" data-icon={id}>
      {ICONS[id]}
    </svg>
  );
}
