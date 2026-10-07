import { useEffect, useState } from "react";
import { CLINIC } from "@/data/site";
import { CONTENT } from "@/data/content";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";
import { BrandMark, PhoneIcon } from "./icons";

/**
 * Intestazione. Lo stato "Aperto/Chiuso ora" si calcola solo nel browser
 * (l'HTML pre-generato non sa che ora è): prima mostra "Su appuntamento".
 */
export function Header() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="site-header" data-qa="header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label={`${CLINIC.name}, torna all'inizio`}>
          <BrandMark className="brand-mark" />
          <span>
            <span className="brand-name">{CLINIC.name}</span>
            <span className="brand-sub">
              {CLINIC.area} · {CLINIC.city}
            </span>
          </span>
        </a>
        <p className={`status${status?.open ? " is-open" : ""}`} data-qa="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {status ? (
            <span>
              <strong>{status.label}</strong>
              {status.detail && <span className="status-detail"> · {status.detail}</span>}
            </span>
          ) : (
            <span>{CONTENT.visit.appointment.replace(".", "")}</span>
          )}
        </p>
        <a className="btn btn-primary btn-small" href={CLINIC.phoneHref}>
          <PhoneIcon />
          <span className="header-call-label-long">{CONTENT.header.call}</span>
          <span className="header-call-label-short">Chiami</span>
        </a>
      </div>
    </header>
  );
}
