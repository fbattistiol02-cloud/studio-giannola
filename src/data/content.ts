/**
 * Tutti i testi della pagina, con il "Lei".
 * Regole (docs/BRIEF.md): niente anni, titoli, prezzi, fondi, collaboratori.
 * Le righe "DA CONFERMARE" sono promesse a nome del dottore: vanno validate con lui.
 */
import { CLINIC } from "./site";

export type Quote = { author: string; text: string; highlight: string };
export type Cure = { id: CureId; name: string; text: string };
export type CureId = "igiene" | "otturazioni" | "devitalizzazioni" | "estrazioni" | "impianti" | "protesi" | "bambini";
export type FearStep = { label: string; title: string; text: string };

export const CONTENT = {
  hero: {
    kicker: `Studio dentistico · ${CLINIC.area}, ${CLINIC.city}`,
    title: "Il dentista di famiglia di",
    accent: "Santa Lucia.",
    lead: "Da più di vent'anni curiamo intere famiglie del quartiere: genitori, figli e ormai anche i nipoti.",
    ctaPrimary: `Chiami ${CLINIC.phoneDisplay}`,
    ctaSecondary: "Le cure",
    points: ["Salita Santa Lucia 2", "Studio accessibile", "Si riceve su appuntamento"],
  },
  header: {
    call: "Chiami lo studio",
  },
  letter: {
    kicker: "01 — Lo studio",
    title: "Due parole, prima di",
    accent: "cominciare.",
    // DA CONFERMARE: lettera scritta a nome del dottore, da validare con lui.
    greeting: "Gentile paziente,",
    body: [
      "in questo studio di Santa Lucia ho visto crescere intere famiglie: genitori, figli, e ormai anche i nipoti.",
      "Il mio modo di lavorare è semplice da spiegare: le dico con chiarezza cosa serve, e solo quello.",
      "E se ha paura, me lo dica. Andiamo con calma, un passo alla volta.",
    ],
    pull: "Le dico con chiarezza cosa serve, e solo quello.",
    sign: CLINIC.doctor,
  },
  reviews: {
    kicker: "02 — I pazienti",
    title: "Lo dicono",
    accent: "loro.",
    summary: `su 5 · ${CLINIC.google.count} recensioni su Google`,
    // Citazioni testuali da Google Maps (7/10/2026): non si modificano.
    quotes: [
      {
        author: "Roberto M.",
        text: "Frequento lo studio Giannola da più di 20 anni, posso solo dire che è il top dei professionisti, lo stesso studio è frequentato anche dai miei figli e nipoti.",
        highlight: "da più di 20 anni",
      },
      {
        author: "Mihaela O.",
        text: "Ero terrorizzata, perché ho una vera e propria paura del dentista e del dolore. […] Oggi posso dire con il cuore che questo è diventato il mio dentista di fiducia.",
        highlight: "il mio dentista di fiducia",
      },
      {
        author: "Greta T.",
        text: "È uno dei pochi che non ti fa lavori “tanto per farli” ma che ti dice obiettivamente cosa fare. Inoltre tutto molto pulito e ordinato.",
        highlight: "non ti fa lavori “tanto per farli”",
      },
    ] as Quote[],
  },
  cures: {
    kicker: "03 — Le cure",
    title: "Tutto quello che serve, e",
    accent: "solo quello.",
    items: [
      { id: "igiene", name: "Igiene e pulizia", text: "Pulizia professionale e controlli, per prevenire prima di dover curare." },
      { id: "otturazioni", name: "Otturazioni", text: "Si toglie la carie e si ripara il dente." },
      { id: "devitalizzazioni", name: "Devitalizzazioni", text: "Quando il nervo è infiammato, per salvare il dente." },
      { id: "estrazioni", name: "Estrazioni", text: "Anche dei denti del giudizio, quando è davvero necessario." },
      { id: "impianti", name: "Impianti", text: "Per sostituire un dente che manca." },
      { id: "protesi", name: "Protesi", text: "Per tornare a masticare e sorridere con serenità." },
      { id: "bambini", name: "Bambini", text: "Con pazienza, fin dai primi dentini." },
    ] as Cure[],
  },
  estimate: {
    title: "Prima di cominciare: cosa serve e quanto",
    accent: "costa.",
    // DA CONFERMARE: promessa a nome del dottore.
    text: "Prima di iniziare una cura le spieghiamo cosa c'è da fare, perché, e quanto costa. Così decide con calma, senza sorprese.",
  },
  fear: {
    kicker: "04 — Senza paura",
    title: "Ha paura del dentista?",
    accent: "Qui può dirlo.",
    invite: "Respiri con noi.",
    inhale: "Inspiri…",
    exhale: "Espiri…",
    pause: "Pausa",
    resume: "Riprendi",
    // DA CONFERMARE: modo di lavorare da validare con il dottore.
    steps: [
      { label: "Prima", title: "Ci racconti cosa la preoccupa.", text: "Può dircelo già al telefono: la prima volta ci sediamo e parliamo, senza fretta." },
      { label: "Durante", title: "Un passo alla volta.", text: "Le spieghiamo cosa facciamo prima di farlo. Alza la mano e ci fermiamo." },
      { label: "Dopo", title: "Torna a casa con le idee chiare.", text: "Le ripetiamo le indicazioni e sa sempre come chiamarci per un dubbio." },
    ] as FearStep[],
  },
  visit: {
    kicker: "05 — Venga a trovarci",
    title: "Salita Santa Lucia 2,",
    accent: "Verona.",
    access: [...CLINIC.accessibility, CLINIC.payments],
    insurance: "Ha una polizza o un fondo sanitario? Lo chieda in segreteria.",
    appointment: "Si riceve su appuntamento.",
    hoursTitle: "Orari",
    accessTitle: "Accessibilità",
    mapLink: "Apri in Google Maps",
    directions: "Indicazioni stradali",
    callTitle: "Per un appuntamento",
  },
  footer: {
    line: `${CLINIC.name} · ${CLINIC.street} · ${CLINIC.postalCode} ${CLINIC.city} · ${CLINIC.phoneDisplay}`,
    credit: "Anteprima realizzata da Filippo Battistiol",
  },
} as const;
