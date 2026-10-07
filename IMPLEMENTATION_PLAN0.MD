# IMPLEMENTATION PLAN 0 — Landing demo "Studio Dentistico Giannola"

> **Per agenti:** SUB-SKILL RICHIESTA: usare superpowers:subagent-driven-development (consigliato) o superpowers:executing-plans per eseguire questo piano task per task. I passi usano le caselle (`- [ ]`) per tenere traccia dell'avanzamento; la **checklist riassuntiva è nella sezione 14**.

**Obiettivo:** una landing di una sola pagina per lo Studio Dentistico Giannola (Verona, Santa Lucia), con il design di Provedel, accento rosso Verona e animazioni "lusso calmo" il cui momento principale è la porta che si apre. La pubblichiamo su Vercel come demo da mandare al dottore.

**Architettura:** stesso stack di Provedel (Vite + React + TypeScript), ma con una sola pagina. In fase di build il contenuto viene pre-generato in `dist/index.html`, quindi è leggibile senza JavaScript. Le animazioni sono un livello aggiuntivo che parte solo se il movimento è permesso: GSAP con ScrollTrigger, SplitText e DrawSVG, più Lenis. Testi e dati stanno in due file (`src/data/site.ts`, `src/data/content.ts`); i componenti si limitano a mostrarli.

**Stack:** Node ≥ 20 · Vite 5 · React 18 · TypeScript 5 · `@fontsource-variable/fraunces` (`full.css` e `full-italic.css`, con gli assi opsz, wght, SOFT e WONK) · `@fontsource/ibm-plex-sans` · `gsap` ^3.13 (ScrollTrigger, SplitText e DrawSVGPlugin inclusi e gratuiti) · `lenis` ^1.3 · `vitest` (logica) · `playwright-core` + `@axe-core/playwright` (controlli nel browser, come in Provedel).

**Spec:** `docs/BRIEF.md` (dossier, brief, decisioni sulle animazioni). Riferimento di codice: `/Users/utente/Pier_Paolo_Provedel`. Da lì si copiano o adattano i file indicati, si legge e non si modifica.

**Cartella del progetto:** `/Users/utente/Studio_Giannola` · **Branch:** `main`, un commit per task.

---

## Vincoli globali

Valgono per ogni task.

**Contenuti**
- Registro **"Lei"** in tutti i testi. Il dottore si chiama sempre e solo **"Dott. Giannola"**: mai "Antonino" o "Antonio".
- **Vietato scrivere:** anno di apertura, laurea, specializzazioni, prezzi, nome del fondo o dell'assicurazione (es. "Blue Assistance"), collaboratori, WhatsApp, e qualsiasi residuo di Provedel ("Tezze", "Pier", "Provedel", "0438", "Gina Roma", "Vazzola"). Lo verifica il test `content-guard` (Task 1).
- I testi da far confermare al dottore hanno il commento `// DA CONFERMARE` in `content.ts`.
- È una demo: `<meta name="robots" content="noindex, nofollow">` e `public/robots.txt` con `Disallow: /`.

**Dati fissi dello studio**
- Telefono: `045 567924` · link `tel:+39045567924`
- Indirizzo: `Salita Santa Lucia, 2 — 37137 Verona` · coordinate `45.4227407, 10.9596648`
- Orari: lun–ven `09:00–12:00` e `15:00–19:00`; sabato e domenica chiuso; "Si riceve su appuntamento".
- Google: `4,4` su `27` recensioni.

**Design**
- Token copiati da Provedel (`--porcelain #f9f8f5`, `--ink #0e3a5b`, `--blue #174c74`, `--blue-hover #0e3a5b`, `--deep #0a2a42`, `--muted #3b4f60`, `--ice #eef5fa`, `--line #cfdce6`, `--radius 1.25rem`, `--radius-sm .75rem`, `--shadow`, `--ease-out cubic-bezier(.16,1,.3,1)`, `--ease-settle cubic-bezier(.34,1.3,.64,1)`, `--ease-in-out cubic-bezier(.65,0,.35,1)`).
- Token nuovi: `--verona #8f3f2b` (accento; contrasto 6,8:1 su porcelain), `--verona-soft #f4e6de` (sostituisce `--sand`).
- Font: Fraunces per i titoli, IBM Plex Sans per il testo. Testo base minimo `1.125rem`, in `rem` perché segua l'ingrandimento di sistema.
- Ogni titolo di sezione ha **una sola** parola in corsivo `--verona`.
- Sezioni numerate `01 —` … `05 —` con filetto sottile.

**Movimento**
- Classi su `<html>`, impostate dallo script inline nella `<head>` (Task 3):
  - `js` = JavaScript attivo;
  - `motion` = movimento permesso;
  - `intro` = deve partire l'apertura della porta.
- Gli stati iniziali nascosti esistono **solo** sotto `html.motion`. Senza JavaScript, o con "riduci movimento", tutto è visibile e già nello stato finale.
- Si animano solo `transform`, `opacity`, `clip-path` e `stroke-dashoffset`. **Unica eccezione:** `font-variation-settings` sulla parola "Santa Lucia.", una volta sola e con larghezza bloccata (Task 4).
- Budget: apertura della porta ≤ **1,9 s**; LCP mobile < **2,5 s**; CLS = **0**; JS totale ≤ **120 KB gzip**; 60 fps su un telefono medio.
- Effetti in loop: solo il respiro (fermo quando la sezione non è visibile, con pulsante Pausa) e il pallino "Aperto ora" (al massimo 3 pulsazioni). Il motivo è la regola WCAG 2.2.2: ciò che si muove per più di 5 s deve potersi fermare.
- **Esclusi:** shader del marmo, pulsante magnetico, cambio colore dello sfondo, caricamento lungo, cornetta che vibra.

**Agganci per i test** (attributi `data-qa`, usati da `scripts/qa.mjs`; nomi fissi):
`header`, `status`, `hero`, `hero-title`, `hero-photo`, `door`, `door-leaf`, `hero-points`, `letter`, `reviews`, `rating-value`, `stars-fill`, `quote`, `cures`, `cure`, `estimate`, `fear`, `breath`, `breath-pause`, `fear-step`, `visit`, `map`, `map-pin`, `vein`, `phone-cta`.

## Punti da sorvegliare in review

Cinque situazioni che nessun task copre da solo e che un utente vero incontrerà. Ognuna ha un controllo nel task indicato.

1. **Il dottore apre il link dal browser interno di Gmail sul telefono e il bundle JS è lento o fallisce.** L'apertura non deve lasciare la pagina vuota: dopo 3 s `intro` viene tolta comunque. Controllo `intro-js-fail` (Task 4).
2. **`localStorage` non disponibile** (navigazione privata, browser interno di un'app): nessun errore in console. L'apertura parte ogni volta, ma la pagina funziona. Controllo `storage-blocked` (Task 3).
3. **Testo ingrandito dal sistema** (utente anziano, carattere base 200%): nessuno scroll orizzontale e titolo dell'hero non tagliato dalle maschere. Controllo `big-text` (Task 2).
4. **Paziente con il telefono su un altro fuso o a cavallo del cambio d'ora:** "Aperto ora" usa l'ora di Roma. Test `hours` con date UTC estive e invernali (Task 1).
5. **Si scorre o si tocca subito durante l'apertura:** l'apertura si completa all'istante e lo scorrimento nativo non resta bloccato. Controllo `intro-skip` (Task 4).

---

## 1. Struttura dei file

```
Studio_Giannola/
├─ IMPLEMENTATION_PLAN0.MD · README.md · docs/BRIEF.md
├─ index.html                 # head con script inline delle classi, noindex, preload font
├─ package.json · vite.config.ts · tsconfig*.json · vercel.json · eslint.config.js · postcss.config.js
├─ public/
│  ├─ foto/studio.webp · studio-800.webp   # foto stock (sorgente in foto-sorgenti/)
│  ├─ favicon.svg · robots.txt
├─ foto-sorgenti/studio.jpg · CREDITS.md   # autore e licenza della foto stock
├─ scripts/
│  ├─ foto.mjs        # copiato da Provedel (WebP + -800)
│  ├─ prerender.mjs   # versione a pagina singola di quello di Provedel
│  ├─ serve.mjs       # copiato da Provedel (anteprima su :4173)
│  └─ qa.mjs          # controlli nel browser, uno per nome: `node scripts/qa.mjs <nome…>`
└─ src/
   ├─ main.tsx · entry-server.tsx · App.tsx · index.css
   ├─ data/site.ts        # CLINIC (dati fissi)
   ├─ data/content.ts     # tutti i testi della pagina
   ├─ lib/hours.ts        # copiato da Provedel, invariato nella logica
   ├─ lib/rating.ts       # stelle e formato "4,4"
   ├─ lib/motion.ts       # motionAllowed, gestione "apertura già vista"
   ├─ lib/gsap.ts         # registrazione plugin + Lenis (initMotion)
   ├─ motion/door.ts      # timeline dell'apertura della porta
   ├─ motion/vein.ts      # vena di marmo
   ├─ motion/small.ts     # stelle, evidenziatore, mappa, header, reveal
   ├─ components/  Header · Hero · Letter · Reviews · Stars · Cures · CureIcon · Estimate · Fear · Breath · Visit · VeronaMap · Vein · Footer
   └─ test/content-guard.test.ts · lib/*.test.ts
```

---

## 2. Task 0 — Base del progetto

**File:** creare la struttura qui sopra. Copiare da Provedel `scripts/serve.mjs`, `scripts/foto.mjs`, `eslint.config.js`, `postcss.config.js`, `tsconfig*.json`; adattare `vite.config.ts` (alias `@`, `__SITE_URL__` predefinito `https://studio-giannola.vercel.app`, blocco `test: { environment: "node" }`).

**Interfacce prodotte:**
- script `package.json`: `dev`, `build` (= `vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs`), `preview` (= `node scripts/serve.mjs`), `test` (= `vitest run`), `typecheck`, `lint`;
- `src/entry-server.tsx` esporta `render(): string`;
- `scripts/prerender.mjs` sostituisce `<!--app-html-->` in `dist/index.html` e precarica `fraunces-latin-full-normal-*.woff2` e `ibm-plex-sans-latin-400-normal-*.woff2`.

- [ ] **0.1** `git init` in `/Users/utente/Studio_Giannola`, `npm init` con le dipendenze dello stack (versioni come Provedel; in più `gsap@^3.13`, `lenis@^1.3`, `vitest`). Verificare che `node_modules/@fontsource-variable/fraunces/full.css` e `full-italic.css` esistano.
- [ ] **0.2** Scrivere un test segnaposto `src/test/smoke.test.ts`: si aspetta che `render()` contenga `<main`. Comando `npm test`: deve fallire perché `render` non esiste ancora.
- [ ] **0.3** `App.tsx` con un `<main>` vuoto, `entry-server.tsx`, `main.tsx` con `hydrateRoot`, e `prerender.mjs`. Comando `npm test`: deve passare.
- [ ] **0.4** Comando `npm run build && npm run preview`: `curl -s localhost:4173 | grep '<main'` deve trovare la riga.
- [ ] **0.5** Commit: `chore: base del progetto (Vite + React + prerender)`.

---

## 3. Task 1 — Dati, testi e regole sui contenuti

**File:** `src/data/site.ts`, `src/data/content.ts`, `src/lib/hours.ts` (copiato da Provedel), `src/lib/rating.ts`, test in `src/lib/hours.test.ts`, `src/lib/rating.test.ts`, `src/test/content-guard.test.ts`.

**Interfacce prodotte:**
- `CLINIC` con i campi `name`, `doctor` ("Dott. Giannola"), `area` ("Santa Lucia"), `city`, `street`, `postalCode`, `address`, `phoneDisplay`, `phoneHref`, `geo {lat,lng}`, `mapsHref`, `directionsHref`, `hours: {day,time,weekdays}[]`, `schedule: OpeningDay[]`, `accessibility: string[]`, `payments: string`, `google {rating: 4.4, count: 27}`, `photo {src,srcMobile,width,height,alt,stock: true}`.
- `getOpenStatus(date?, schedule?) → OpenStatus` e `romeWeekday(date?)`, come in Provedel.
- `starFillPercent(rating: number, max = 5) → number` e `formatRating(rating: number) → string` (es. "4,4").
- `CONTENT` con le chiavi `hero`, `letter`, `reviews`, `cures`, `estimate`, `fear`, `visit`, `footer` (testi qui sotto).

**Testi esatti** (in `content.ts`; dove c'è ⚠︎ va il commento `// DA CONFERMARE`):

| Chiave | Testo |
|---|---|
| `hero.title` | `Il dentista di famiglia di` + corsivo `Santa Lucia.` |
| `hero.lead` | Da più di vent'anni curiamo intere famiglie del quartiere: genitori, figli e ormai anche i nipoti. |
| `hero.ctaPrimary` / `ctaSecondary` | `Chiami 045 567924` / `Le cure` (link `#cure`) |
| `hero.points` | `Salita Santa Lucia 2` · `Studio accessibile` · `Si riceve su appuntamento` |
| `letter.kicker` / `title` | `01 — Lo studio` / `Due parole, prima di` + corsivo `cominciare.` |
| `letter.body` ⚠︎ | Gentile paziente, ‖ in questo studio di Santa Lucia ho visto crescere intere famiglie: genitori, figli, e ormai anche i nipoti. ‖ Il mio modo di lavorare è semplice da spiegare: le dico con chiarezza cosa serve, e solo quello. ‖ E se ha paura, me lo dica. Andiamo con calma, un passo alla volta. |
| `letter.sign` | `Dott. Giannola` (Fraunces corsivo + sottolineatura a mano libera in SVG; **non** una finta firma) |
| `reviews.kicker` / `title` | `02 — I pazienti` / `Lo dicono` + corsivo `loro.` |
| `reviews.summary` | `4,4 su 5 · 27 recensioni su Google` |
| `reviews.quotes` | le 3 citazioni esatte di `docs/BRIEF.md` §1, firmate `Roberto M.`, `Mihaela O.`, `Greta T.`; frase evidenziata rispettivamente: `da più di 20 anni`, `il mio dentista di fiducia`, `non ti fa lavori "tanto per farli"` |
| `cures.kicker` / `title` | `03 — Le cure` / `Tutto quello che serve, e` + corsivo `solo quello.` |
| `cures.items` | Igiene e pulizia — Pulizia professionale e controlli, per prevenire prima di dover curare. · Otturazioni — Si toglie la carie e si ripara il dente. · Devitalizzazioni — Quando il nervo è infiammato, per salvare il dente. · Estrazioni — Anche dei denti del giudizio, quando è davvero necessario. · Impianti — Per sostituire un dente che manca. · Protesi — Per tornare a masticare e sorridere con serenità. · Bambini — Con pazienza, fin dai primi dentini. |
| `estimate` ⚠︎ | Titolo: `Prima di cominciare: cosa serve e quanto` + corsivo `costa.` · Testo: Prima di iniziare una cura le spieghiamo cosa c'è da fare, perché, e quanto costa. Così decide con calma, senza sorprese. |
| `fear.kicker` / `title` | `04 — Senza paura` / `Ha paura del dentista?` + corsivo `Qui può dirlo.` · invito del cerchio: `Respiri con noi.` |
| `fear.steps` ⚠︎ | **Prima** — Ci racconti cosa la preoccupa. Può dircelo già al telefono: la prima volta ci sediamo e parliamo, senza fretta. · **Durante** — Un passo alla volta. Le spieghiamo cosa facciamo prima di farlo. Alza la mano e ci fermiamo. · **Dopo** — Torna a casa con le idee chiare. Le ripetiamo le indicazioni e sa sempre come chiamarci per un dubbio. |
| `visit.kicker` / `title` | `05 — Venga a trovarci` / `Salita Santa Lucia 2,` + corsivo `Verona.` |
| `visit.access` | Ingresso accessibile in sedia a rotelle · Bagno accessibile · Parcheggio accessibile · Si paga anche con carta e telefono |
| `visit.insurance` | Ha una polizza o un fondo sanitario? Lo chieda in segreteria. |
| `visit.appointment` | Si riceve su appuntamento. |
| `footer` | `Studio Dentistico Giannola · Salita Santa Lucia, 2 · 37137 Verona · 045 567924` + piccola nota `Anteprima realizzata da Filippo Battistiol` |

- [ ] **1.1** Scrivere `hours.test.ts` con lo schedule di `CLINIC`:
  - `"2026-10-07T08:00:00Z"` (mer 10:00 a Roma) → `{open:true, detail:"chiude alle 12:00"}`;
  - `"2026-10-07T10:30:00Z"` (12:30) → `{open:false, detail:"riapre oggi alle 15:00"}`;
  - `"2026-10-09T17:30:00Z"` (ven 19:30) → `detail:"riapre lunedì alle 9:00"`;
  - `"2026-10-11T18:00:00Z"` (dom 20:00) → `detail:"riapre domani alle 9:00"`;
  - inverno `"2026-12-02T08:30:00Z"` (mer 9:30 ora solare) → `open:true`.
- [ ] **1.2** Scrivere `rating.test.ts`: `starFillPercent(4.4) === 88`, `starFillPercent(5) === 100`, `starFillPercent(0) === 0`, `formatRating(4.4) === "4,4"`.
- [ ] **1.3** Scrivere `content-guard.test.ts`. Legge `src/**/*.{ts,tsx,css}` (esclusi i file `*.test.ts` e la cartella `src/test/`) e `index.html` e verifica:
  - nessuna corrispondenza per `/Tezze|Pier\b|Provedel|0438|Gina Roma|Vazzola|Antonin?o\b|WhatsApp|Blue Assistance|€|\bdal (19|20)\d\d\b|laurea|specializzat/i`;
  - `content.ts` usa "Lei": nessuna corrispondenza per `/\b(tu|ti|tuo|tua|vieni|chiamaci|dicci)\b/i` dentro le stringhe, **escluse** le citazioni dei pazienti (`reviews.quotes`), che restano testuali anche se usano il "tu".
- [ ] **1.4** Comando `npm test`: i tre file devono fallire (moduli mancanti).
- [ ] **1.5** Creare `site.ts`, `content.ts` (testi qui sopra), `hours.ts` (copia di Provedel, si cambia solo il commento "a Tezze" in "a Verona"), `rating.ts`.
- [ ] **1.6** Comando `npm test`: deve passare tutto.
- [ ] **1.7** Commit: `feat: dati dello studio, testi e regole sui contenuti`.

---

## 4. Task 2 — Pagina statica completa (design senza movimento)

È la base su cui sta tutto il resto. Deve essere già "da rivista" senza nessuna animazione.

**File:** `src/index.css`, tutti i componenti, `App.tsx`, `public/foto/*`, `foto-sorgenti/CREDITS.md`, `public/favicon.svg`, `public/robots.txt`, `index.html`, `scripts/qa.mjs`.

**Decisioni di design** (l'implementatore non deve inventarle):
- **Griglia:** 12 colonne, `--gutter: clamp(1rem, 4vw, 3rem)`, contenitore massimo `76rem`. Lettera e recensioni sono asimmetriche: testo nelle colonne 2–8, elemento laterale nelle 9–12. Su mobile, una sola colonna.
- **Titoli:**
  - H1 Fraunces `clamp(2.75rem, 9vw, 6.5rem)`, `line-height .95`, `font-variation-settings "opsz" 144, "wght" 380, "SOFT" 0, "WONK" 0`;
  - la parola in corsivo è nel colore `--verona` con lo stato finale `"wght" 560, "SOFT" 100, "WONK" 1`;
  - H2 `clamp(2rem, 5.5vw, 4rem)`.
- **Etichette di sezione** (`01 — …`): IBM Plex, `.875rem`, maiuscolo, `letter-spacing .12em`, `--verona`, sopra un filetto `1px var(--line)`.
- **Arco dell'hero:** forma `border-radius: 999px 999px var(--radius) var(--radius)`, proporzioni 4:5, larghezza `min(28rem, 42vw)` da desktop, `100%` su mobile, sotto il testo. La foto dentro è `object-fit: cover`. Le due ante (`data-qa="door-leaf"`, metà sinistra e metà destra, colore `--verona-soft`) esistono nel DOM ma sono visibili **solo** sotto `html.intro`. Il profilo dell'arco è un `<svg data-qa="door">` sovrapposto, tratto `--verona` di 1,5px.
- **Grana:** `body::after` fisso, `pointer-events:none`, immagine di fondo SVG `feTurbulence` in data-URI, `background-size:160px`, `opacity:.03`.
- **Stelle** (`Stars.tsx`): 5 stelle vuote in SVG con sopra un livello pieno (`data-qa="stars-fill"`) largo `starFillPercent(4.4)%`, già nello stato finale nell'HTML.
- **Mappa** (`VeronaMap.tsx`, `data-qa="map"`): SVG stilizzato, `viewBox="0 0 400 300"`, non cartografico, con tre elementi:
  - l'Adige: un tratto `--blue` di 2px, `M 10 70 C 110 20 200 30 255 70 S 345 165 300 205 S 320 280 395 290`;
  - l'Arena: un'ellisse a doppio contorno centrata in (250,115), raggi 26×19, con l'etichetta "Arena";
  - il segnaposto `data-qa="map-pin"` in (118,228), con l'etichetta "Santa Lucia".

  Sotto la mappa, il link "Apri in Google Maps" (`CLINIC.mapsHref`). Niente mappa di Google incorporata.
- **Vena** (`Vein.tsx`, `data-qa="vein"`): tre segmenti SVG decorativi, `aria-hidden`, tratto `--verona` di 1,25px con `vector-effect: non-scaling-stroke`:
  - **A** dal bordo inferiore dell'hero, lungo il margine sinistro della lettera, fino al titolo delle recensioni;
  - **B** intorno al blocco delle recensioni;
  - **C** dal titolo di "Venga a trovarci" fino al segnaposto.

  Ogni segmento è un `<svg>` posizionato in assoluto dentro la propria sezione. Nell'HTML statico sono già disegnati completi.
- **Icone delle cure** (`CureIcon.tsx`): 7 icone SVG disegnate a mano, `viewBox 0 0 48 48`, tratto `--verona` di 1,5px con terminazioni arrotondate, nessun riempimento. Non si usa `lucide-react`.
- **Respiro statico:** un cerchio `--verona-soft` di 14rem con al centro "Respiri con noi."; i 3 passi sono tutti visibili accanto.
- **Telefono finale:** numero in Fraunces `clamp(2.5rem, 8vw, 5rem)`, link `tel:`, `data-qa="phone-cta"`.
- **Foto stock:** cercare su Unsplash "dental clinic interior bright", **senza volti**, luce naturale e toni chiari. Scaricare in `foto-sorgenti/studio.jpg`, poi `node scripts/foto.mjs` (crea `studio.webp` + `studio-800.webp`). Autore, URL e licenza vanno in `foto-sorgenti/CREDITS.md`. Testo alternativo: "Uno studio dentistico luminoso (foto di esempio)".
- **Favicon:** `favicon.svg` con il profilo dell'arco in `--verona` e la "G" in Fraunces corsivo.

**Controlli QA da aggiungere in `scripts/qa.mjs`** (uno per nome; Chromium di playwright-core, `CHROME` come in Provedel, base `http://localhost:4173`):
- `layout`: a 320, 375, 768 e 1440 px, con `reducedMotion:"reduce"`:
  - `scrollWidth <= clientWidth`;
  - esattamente 1 `h1`;
  - zero errori in console;
  - tutti i 25 `data-qa` del vincolo globale presenti, tranne `breath-pause` (arriva nel Task 6);
  - almeno 2 link `a[href="tel:+39045567924"]`.
- `axe`: a 375 e 1440 px, nessuna violazione `serious` o `critical`.
- `no-js`: contesto con `javaScriptEnabled:false`, a 375 px. Il testo dell'`h1` contiene "Santa Lucia" ed è visibile; `[data-qa=phone-cta]` è visibile; tutte le citazioni sono visibili.
- `big-text`: a 375 px, `document.documentElement.style.fontSize="200%"`. Nessuno scroll orizzontale; il bordo inferiore di `[data-qa=hero-title]` non supera quello del suo contenitore.

- [ ] **2.1** Creare `scripts/qa.mjs` con i 4 controlli. Comando `npm run build && npm run preview` in un terminale, `node scripts/qa.mjs layout axe no-js big-text` nell'altro: deve fallire.
- [ ] **2.2** `index.css`: token, griglia, tipografia, grana, componenti base (pulsanti come in Provedel).
- [ ] **2.3** Componenti `Header` (con `getOpenStatus`, solo testo, nessun pallino animato), `Hero` (foto, arco, ante, punti di forza), `Letter`, `Footer`. Foto stock e favicon.
- [ ] **2.4** Componenti `Reviews` + `Stars`, `Cures` + `CureIcon`, `Estimate`.
- [ ] **2.5** Componenti `Fear` (+ `Breath` statico), `Visit` + `VeronaMap`, `Vein` (3 segmenti).
- [ ] **2.6** Aggiungere a `index.html` la meta `noindex`, `public/robots.txt`, il titolo `Studio Dentistico Giannola · Dentista a Santa Lucia, Verona` e una descrizione di 1 riga.
- [ ] **2.7** Comando `node scripts/qa.mjs layout axe no-js big-text`: deve passare. Poi controllo a vista (screenshot a 375 e 1440 px) contro il brief: una sola parola in corsivo rosso per titolo, sezioni numerate.
- [ ] **2.8** Commit: `feat: pagina statica completa con design editoriale`.

---

## 5. Task 3 — Fondamenta del movimento

**File:** `index.html` (script inline), `src/lib/motion.ts` + `motion.test.ts`, `src/lib/gsap.ts`, `src/motion/small.ts` (solo i reveal), `src/App.tsx`, `src/index.css`.

**Interfacce prodotte:**
- `INTRO_KEY = "sg-intro-v1"`.
- `motionAllowed() → boolean`: `false` in SSR o con `prefers-reduced-motion: reduce`.
- `shouldPlayIntro({motionOk, seen}) → boolean` (= `motionOk && !seen`).
- `readIntroSeen() → boolean` e `markIntroSeen() → void`: entrambe in `try/catch`; se lo storage non è disponibile, `false` e nessun errore.
- `initMotion() → { lenis: Lenis | null; destroy(): void }`. Registra ScrollTrigger, SplitText e DrawSVGPlugin. Crea Lenis solo se `motionAllowed()`, con `syncTouch:false`, cioè scorrimento nativo sul telefono. Collega `lenis.on("scroll", ScrollTrigger.update)` e `gsap.ticker`. I link `#ancora` usano `lenis.scrollTo`.
- `revealBlocks(root: HTMLElement) → () => void`: gli elementi `[data-reveal]` salgono di 18px con dissolvenza (`--ease-out`, 0,6 s, `stagger` 0,08 s), una volta sola, quando entrano nello schermo.

**Script inline nella `<head>`** (codice fisso, va prima di ogni CSS):
```html
<script>(function(){var d=document.documentElement;d.classList.add("js");
var rm=matchMedia("(prefers-reduced-motion: reduce)").matches,seen=false;
try{seen=localStorage.getItem("sg-intro-v1")==="1"}catch(e){}
if(!rm)d.classList.add("motion");
if(!rm&&!seen){d.classList.add("intro");setTimeout(function(){d.classList.remove("intro")},3000)}})();</script>
```

**Controlli QA:**
- `motion-classes`:
  - con `reducedMotion:"reduce"`, `<html>` non ha `motion` né `intro`;
  - con `"no-preference"` e storage vuoto ha `motion` e `intro`;
  - dopo il secondo caricamento, nello stesso contesto, ha `motion` ma non `intro`.
- `reveals-settle`: con `"no-preference"`, a 375 px, scorrere fino in fondo a passi di 400px (`waitForTimeout(250)`), poi attendere 1,5 s. Nessun `[data-reveal]` resta con opacità < 1.
- `storage-blocked`: `addInitScript` che fa lanciare un'eccezione a `Storage.prototype.getItem` e `setItem`. Zero errori in console e `h1` visibile dopo 2,5 s.

- [ ] **3.1** Scrivere `motion.test.ts`: `shouldPlayIntro` per le 4 combinazioni; `readIntroSeen()` restituisce `false` senza errori quando `globalThis.localStorage` lancia un'eccezione (stub).
- [ ] **3.2** Aggiungere i 3 controlli a `qa.mjs`. Comandi `npm test` e `node scripts/qa.mjs motion-classes reveals-settle storage-blocked`: devono fallire.
- [ ] **3.3** Implementare lo script inline, `motion.ts`, `gsap.ts` e `revealBlocks`. In `App.tsx`, `useEffect` chiama `initMotion()` e `revealBlocks()`, con pulizia. Il CSS degli stati iniziali esiste solo sotto `html.motion [data-reveal]`.
- [ ] **3.4** Rieseguire i comandi del passo 3.2: devono passare. Poi `node scripts/qa.mjs layout no-js`: deve passare ancora.
- [ ] **3.5** Commit: `feat: fondamenta del movimento (classi, GSAP, Lenis, reveal)`.

---

## 6. Task 4 — La porta che si apre (momento principale)

**File:** `src/motion/door.ts`, `src/components/Hero.tsx`, `src/index.css`.

**Interfacce:**
- Usa `motionAllowed`, `readIntroSeen`, `markIntroSeen` e `initMotion` (Task 3).
- Produce `playDoorIntro(hero: HTMLElement) → gsap.core.Timeline` e `heroParallax(hero: HTMLElement) → () => void`.

**Coreografia** (valori fissi; t in secondi dall'avvio, che avviene al primo `requestAnimationFrame` dopo l'idratazione):

| t | Elemento | Animazione |
|---|---|---|
| 0,00–0,90 | profilo dell'arco `[data-qa=door] path` | DrawSVG `0% → 100%`, `--ease-in-out` |
| 0,70–1,50 | ante `[data-qa=door-leaf]` | sinistra `xPercent 0 → -101`, destra `0 → 101`, `power3.inOut` |
| 0,70–1,60 | foto `[data-qa=hero-photo] img` | `scale 1.12 → 1`, `--ease-out` |
| 0,45–1,35 | righe di `[data-qa=hero-title]` | SplitText `type:"lines", mask:"lines"`, `yPercent 110 → 0`, stagger 0,12, `--ease-out` |
| 0,90–1,80 | parola in corsivo "Santa Lucia." | `font-variation-settings` da `"wght" 300, "SOFT" 0, "WONK" 0` a `"wght" 560, "SOFT" 100, "WONK" 1`, `power2.out`. **Prima** si misura la larghezza della parola nello stato finale e la si blocca con un `inline-block` di larghezza fissa; alla fine si sblocca. |
| 1,10–1,60 | lead e pulsanti | `y 16 → 0`, `opacity 0 → 1` |
| 1,30–1,90 | `[data-qa=hero-points] li` | `y 12 → 0`, `opacity 0 → 1`, stagger 0,1 |

- **Fine** (`onComplete`): `markIntroSeen()`, rimuovere `intro` da `<html>`, chiamare `SplitText.revert()`.
- **Salto:** il primo `pointerdown`, `keydown`, `wheel` o `touchstart` durante la timeline porta a `tl.progress(1)`. I listener `{ passive:true, once:true }` vanno rimossi alla fine.
- **Visite successive** (senza `intro`): niente timeline. Resta solo `heroParallax`: foto `yPercent 0 → 8` e `scale 1 → 1.04` con `scrub` mentre l'hero esce dallo schermo.

**Controlli QA** (tutti con `reducedMotion:"no-preference"`, a 375 px):
- `intro-timing`: storage vuoto. A 300 ms `[data-qa=door-leaf]` è visibile; a 2000 ms `<html>` non ha `intro`, le ante sono fuori dall'arco e l'opacità calcolata di `h1` è 1.
- `intro-skip`: a 300 ms `mouse.wheel(0, 600)`. Entro 250 ms `<html>` non ha `intro` e `scrollY > 0`.
- `intro-once`: dopo un secondo caricamento nello stesso contesto, a 100 ms l'`h1` è già visibile e `<html>` non ha `intro`.
- `intro-js-fail`: `page.route("**/assets/*.js", r => r.abort())`. Dopo 3200 ms `<html>` non ha `intro` e l'`h1` è visibile.
- `cls`: `PerformanceObserver` di `layout-shift` registrato con `addInitScript`. Dopo 3 s la somma vale `0`.

- [ ] **4.1** Aggiungere i 5 controlli. Comando `node scripts/qa.mjs intro-timing intro-skip intro-once intro-js-fail cls`: deve fallire.
- [ ] **4.2** Implementare `playDoorIntro` e `heroParallax` e collegarli in `Hero.tsx` (`useEffect`, solo se `html.intro`, altrimenti solo il parallasse). CSS: stati iniziali sotto `html.intro` (ante a posto, righe del titolo nascoste dalla maschera), così la pagina disegnata dal server è già nello stato giusto e non c'è lampo.
- [ ] **4.3** Rieseguire il comando del passo 4.1: deve passare. Poi `node scripts/qa.mjs layout big-text motion-classes`: deve passare ancora.
- [ ] **4.4** Controllo a vista: registrare l'apertura a 375 px (video Playwright o registrazione di DevTools) e verificare la fluidità. Se la parola "Santa Lucia." scatta, ridurre la durata a 0,7 s, non toccare gli altri tempi.
- [ ] **4.5** Commit: `feat: la porta che si apre (intro dell'hero)`.

---

## 7. Task 5 — La vena di marmo

**File:** `src/motion/vein.ts`, `src/components/Vein.tsx`.

**Interfacce:** produce `drawVein(segments: SVGPathElement[]) → () => void`.

- Ogni segmento parte da `drawSVG:"0%"` e si disegna con ScrollTrigger in `scrub: 0.6`:
  - **A**: `start "top 80%"`, `end "bottom 60%"`, sulla sezione della lettera;
  - **B**: stessi valori, sulla sezione delle recensioni;
  - **C**: `start "top 75%"`, `end "center 55%"`, su `visit`.
- Alla fine di C, il segnaposto riceve la classe `is-reached`, che fa partire la caduta del Task 7.
- Senza movimento: i segmenti restano disegnati, come nell'HTML statico.

**Controlli QA:**
- `vein-draw` (`"no-preference"`, 1440 px):
  - all'inizio la `stroke-dashoffset` calcolata del segmento A è maggiore di 0;
  - dopo aver portato `visit` in vista e atteso 1 s, tutti i segmenti hanno l'offset ≈ 0 (tolleranza 1) e `[data-qa=map-pin]` ha `is-reached`.
- `vein-static` (`"reduce"`): i segmenti hanno offset 0 senza bisogno di scorrere.

- [ ] **5.1** Aggiungere i 2 controlli. Comando `node scripts/qa.mjs vein-draw vein-static`: deve fallire.
- [ ] **5.2** Implementare `drawVein` e collegarlo in `App.tsx` dopo `initMotion`.
- [ ] **5.3** Rieseguire il comando del passo 5.1: deve passare. Poi `node scripts/qa.mjs layout`: deve passare.
- [ ] **5.4** Commit: `feat: vena di marmo disegnata allo scorrimento`.

---

## 8. Task 6 — Il respiro

**File:** `src/components/Breath.tsx`, `src/components/Fear.tsx`, `src/index.css`.

**Interfacce:** produce `<Breath steps={CONTENT.fear.steps} />`, con lo stato interno `playing: boolean`.

- **Ciclo:** cerchio `scale .72 → 1` in 4 s (`sine.inOut`), poi `1 → .72` in 6 s, ripetuto (timeline GSAP `repeat:-1`).
  - L'etichetta cambia con il ciclo: "Inspiri…" durante l'espansione, "Espiri…" durante la contrazione.
  - "Respiri con noi." resta come titolo sopra.
- **Visibilità:** con un `IntersectionObserver` (soglia 0,4), il ciclo va in pausa quando la sezione esce dallo schermo e riprende quando rientra.
- **Passi:** con il movimento, il passo *n* (`data-qa="fear-step"`) compare (`y 12 → 0`, `opacity 0 → 1`) all'inizio dell'espirazione del respiro *n*. Dopo il terzo respiro restano tutti visibili. Senza movimento sono tutti visibili da subito e il cerchio è fermo.
- **Pulsante** `data-qa="breath-pause"`: `<button aria-pressed>` con le etichette "Pausa" e "Riprendi". Ferma e riprende la timeline. Nascosto senza movimento.
- **Accessibilità:** il cerchio è `aria-hidden`. Le etichette "Inspiri…" ed "Espiri…" **non** stanno in una regione `aria-live`, perché non devono essere lette di continuo.

**Controlli QA:**
- `breath`: `"no-preference"`, 375 px, sezione in vista.
  - Dopo 1 s la scala del cerchio è cambiata rispetto a 0 s.
  - Dopo 11 s almeno 2 `fear-step` sono visibili.
  - Clic su Pausa: dopo 1 s la scala non cambia per 1 s e `aria-pressed="true"`.
  - Scorrendo via e tornando, il ciclo riprende solo se non è in pausa.
- `breath-static`: `"reduce"`. I 3 passi sono visibili subito e `breath-pause` non è visibile.

- [ ] **6.1** Aggiungere i 2 controlli. Comando `node scripts/qa.mjs breath breath-static`: deve fallire.
- [ ] **6.2** Implementare `Breath` e collegarlo in `Fear`.
- [ ] **6.3** Rieseguire il comando del passo 6.1: deve passare. Poi `node scripts/qa.mjs axe layout`: deve passare.
- [ ] **6.4** Commit: `feat: il respiro nella sezione "Ha paura?"`.

---

## 9. Task 7 — Piccoli movimenti sobri

**File:** `src/motion/small.ts`, `Header.tsx`, `Stars.tsx`, `Reviews.tsx`, `VeronaMap.tsx`, `src/index.css`.

**Interfacce prodotte** (in `small.ts`): `headerPill(header) → cleanup`, `countRating(el, value: 4.4) → cleanup`, `highlightQuotes(root) → cleanup`, `mapEntrance(map) → cleanup`.

- **Intestazione:** oltre 80px di scorrimento prende la classe `is-pill`. Il pseudo-elemento di sfondo passa all'opacità 1, insieme a `border-radius` e ombra. Si anima solo l'opacità dello sfondo e un `translateY` di 4px. Niente `backdrop-filter`.
- **Pallino "Aperto ora"** (`data-qa="status"`): solo quando lo studio è aperto, un anello che si espande (`scale 1 → 2.2`, `opacity .5 → 0`, 1,5 s) per **3 volte**, poi resta fermo. Quando è chiuso, pallino grigio fermo. Lo stato si ricalcola ogni 60 s.
- **Stelle:** all'ingresso in vista, il livello pieno passa da `clip-path: inset(0 100% 0 0)` a `inset(0 12% 0 0)` (= 88%) in 1,2 s con `--ease-out`. Insieme, `[data-qa=rating-value]` conta da `0,0` a `4,4` con `formatRating`. L'HTML statico mostra già "4,4" e l'88%.
- **Evidenziatore:** ogni frase chiave (`<mark>` nel testo della citazione) ha uno sfondo `--verona-soft` che si scopre da sinistra (`clip-path` o `scaleX` da 0 a 1 con `transform-origin:left`) in 0,8 s, quando la citazione è al 60% della vista. Una volta sola.
- **Mappa:** all'ingresso, l'Adige si disegna (DrawSVG `0 → 100%`, 1,4 s) e l'Arena compare (`opacity`, 0,4 s, ritardo 0,6 s). Quando il segnaposto riceve `is-reached` dal Task 5, oppure dopo 1,6 s se la vena non c'è, il segnaposto cade da `y:-40` a `0` con `--ease-settle` in 0,7 s, seguito da un'onda (`scale 0 → 1.8`, `opacity .4 → 0`, una volta).

**Controlli QA:**
- `small-moves` (`"no-preference"`, 375 px):
  - con lo studio aperto (orologio di Playwright fissato a mer 7/10/2026 10:00 Roma, `page.clock.setFixedTime`), lo status mostra "Aperto ora" e dopo 6 s le animazioni del pallino sono finite (`getAnimations()` vuoto);
  - dopo lo scorrimento fino alle recensioni e 1,5 s, `rating-value` è "4,4";
  - dopo lo scorrimento fino alla mappa e 2,5 s, il `transform` del segnaposto è a posto (y = 0);
  - scorrendo oltre 80px, `header` ha `is-pill`.
- `small-static` (`"reduce"`): "4,4" e stelle all'88% subito; segnaposto a posto; nessuna animazione attiva (`document.getAnimations().length === 0`).

- [ ] **7.1** Aggiungere i 2 controlli. Comando `node scripts/qa.mjs small-moves small-static`: deve fallire.
- [ ] **7.2** Implementare le 4 funzioni e collegarle.
- [ ] **7.3** Rieseguire il comando del passo 7.1: deve passare. Poi tutta la suite: `npm test && node scripts/qa.mjs` (senza nomi = tutti i controlli).
- [ ] **7.4** Commit: `feat: piccoli movimenti (header, stato, stelle, evidenziatore, mappa)`.

---

## 10. Task 8 — Belli da avere (solo se c'è tempo; ognuno ha il suo commit)

Ognuno rispetta gli stessi vincoli e ha un controllo `nome` + `nome-static` sul modello dei Task 6 e 7.

- [ ] **8.1 La lettera che si scrive scorrendo.** SplitText `type:"words"` sul corpo della lettera. Il colore passa da `--line-strong #7f97aa` a `--ink`, parola per parola, con ScrollTrigger in `scrub` (`start "top 75%"`, `end "bottom 55%"`). Si anima il colore, non la trasparenza, perché il testo deve restare leggibile: è l'unica eccezione, ammessa perché agisce su testo breve. Alla fine, la sottolineatura sotto "Dott. Giannola" si disegna (DrawSVG, 0,9 s). Controlli: `letter-write` (a fine scorrimento il colore di tutte le parole = `--ink`) e `letter-static`.
- [ ] **8.2 Le icone delle cure si disegnano.** Ogni `CureIcon` all'ingresso: DrawSVG `0 → 100%` in 1,2 s, con stagger 0,08 tra le card visibili. Più un gesto proprio per 4 icone (una volta sola):
  - otturazione: il riempimento sale (`scaleY` da 0);
  - impianto: la vite scende di 6px;
  - pulizia: un riflesso attraversa l'icona (`x`);
  - bambini: il sorriso si disegna per ultimo.

  Controlli: `cures-draw` e `cures-static`.
- [ ] **8.3 Il preventivo che si apre.** `Estimate` è un foglio con la piega: la metà superiore ruota `rotateX(-180deg → 0)` con `transform-origin: bottom` e `perspective: 900px`, in 0,9 s. Poi 3 righe finte (barre `--line`) si "compilano" da sinistra con `scaleX` e stagger 0,15. Il testo vero resta sempre leggibile accanto al foglio. Controlli: `estimate-open` ed `estimate-static`.

---

## 11. Task 9 — Prestazioni e verifica finale

**File:** `README.md` (comandi + registro delle misure), nessun codice nuovo salvo correzioni.

- [ ] **9.1** Peso: `npm run build`, poi la somma in gzip dei JS di `dist/assets/` (`gzip -c f | wc -c`) deve essere ≤ 120 KB. Se si sfora, prima si carica GSAP solo dopo l'idratazione (`import()` dinamico in `App.tsx`), poi si rivaluta Lenis.
- [ ] **9.2** Lighthouse mobile:
  ```bash
  npx lighthouse http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility --output=json --output-path=./lh.json
  ```
  Risultati attesi: LCP < 2500 ms, CLS = 0, accessibilità ≥ 95. Valori da annotare nel registro (sezione 13).
- [ ] **9.3** 60 fps: registrazione delle prestazioni in Chrome DevTools a 375 px con CPU 4× rallentata, durante l'apertura e uno scorrimento completo. Nessun frame lungo più di 50 ms dovuto a stile o layout. Se ce ne sono, eliminare la proprietà che li causa.
- [ ] **9.4** Tutta la suite verde: `npm test && npm run typecheck && npm run lint && node scripts/qa.mjs`.
- [ ] **9.5** Telefono vero (iPhone con Safari e Android con Chrome), aprendo il link **dall'app Gmail**:
  - apertura fluida;
  - salto al tocco;
  - respiro con Pausa;
  - pulsanti `tel:` che aprono la chiamata;
  - stessa prova con "Riduci movimento" attivo.
- [ ] **9.6** Ricerca dei residui: `grep -riE "tezze|pier|provedel|0438|gina roma|vazzola" src index.html public` deve restituire zero risultati, a conferma del `content-guard`.
- [ ] **9.7** Commit: `chore: verifica finale e registro misure`.

---

## 12. Task 10 — Pubblicazione e consegna

- [ ] **10.1** Nuovo progetto Vercel `studio-giannola`. `vercel.json` copiato da Provedel (`framework:null`, `outputDirectory:"dist"`, cache delle immagini e degli asset). Deploy di produzione e verifica: `curl -sI https://studio-giannola.vercel.app` deve restituire `200` e `x-robots-tag` oppure la meta `noindex` presente.
- [ ] **10.2** Controllo pre-consegna (dalla skill yes-flow, voci 1–10):
  - nome dello studio esatto;
  - colori;
  - testo dell'hero;
  - cure esistenti;
  - collegamento con la prima email ("conoscerla prima di chiamare");
  - link corretto e funzionante;
  - zero dati di Provedel;
  - zero promesse non verificate (le voci ⚠︎ sono formulate come proposta).
- [ ] **10.3** **Filippo:** in Gmail, correggere il nome mittente da "Filippo Batistiol" a "Filippo Battistiol".
- [ ] **10.4** **Filippo:** risposta immediata nel thread "Re: Posso mandarla?":
  > Perfetto, Dott. Giannola. Lo preparo sul suo studio e glielo mando qui entro domani.

  Claude non invia nulla.
- [ ] **10.5** **Filippo:** messaggio di consegna, con il link al posto di `[link]`:
  > Dott. Giannola, eccolo: [link]
  >
  > Lo apra dal telefono come farebbe un paziente nuovo: in quanti secondi arriva al numero per chiamarla?
- [ ] **10.6** Dopo la consegna: nessuna azione per 2 giorni. Poi un solo promemoria legato alla domanda (vedi skill yes-flow), quindi chiusura.

---

## 13. Registro delle misure (da compilare)

| Misura | Obiettivo | Valore | Data |
|---|---|---|---|
| JS gzip totale | ≤ 120 KB | | |
| LCP mobile (Lighthouse) | < 2500 ms | | |
| CLS | 0 | | |
| Accessibilità Lighthouse | ≥ 95 | | |
| Durata apertura porta | ≤ 1,9 s | | |
| Frame > 50 ms durante l'apertura (CPU 4×) | 0 | | |

---

## 14. Checklist di avanzamento

### Task 0 — Base del progetto
- [ ] 0.1 Repository, dipendenze, font Fraunces "full" verificati
- [ ] 0.2–0.3 `render()` + prerender, test di fumo verde
- [ ] 0.4 build + preview servono `<main>`
- [ ] 0.5 Commit

### Task 1 — Dati, testi e regole sui contenuti
- [ ] 1.1 Test `hours` (fuso di Roma, ora legale e solare)
- [ ] 1.2 Test `rating` (88%, "4,4")
- [ ] 1.3 Test `content-guard` (residui di Provedel, dati inventati, "Lei")
- [ ] 1.5 `site.ts`, `content.ts`, `hours.ts`, `rating.ts`
- [ ] 1.6–1.7 Test verdi + commit

### Task 2 — Pagina statica completa
- [ ] 2.1 Controlli `layout`, `axe`, `no-js`, `big-text`
- [ ] 2.2 CSS: token, griglia, tipografia, grana
- [ ] 2.3 Intestazione, hero (arco + ante + foto stock), lettera, footer, favicon
- [ ] 2.4 Recensioni + stelle, cure + icone, preventivo
- [ ] 2.5 "Ha paura?" (statico), "Venga a trovarci" + mappa SVG, vena (3 segmenti)
- [ ] 2.6 noindex, robots, titolo e descrizione
- [ ] 2.7–2.8 QA verde, controllo a vista, commit

### Task 3 — Fondamenta del movimento
- [ ] 3.1 Test `motion.ts`
- [ ] 3.2 Controlli `motion-classes`, `reveals-settle`, `storage-blocked`
- [ ] 3.3 Script inline, `motion.ts`, `gsap.ts` (Lenis), `revealBlocks`
- [ ] 3.4–3.5 QA verde + commit

### Task 4 — La porta che si apre ★
- [ ] 4.1 Controlli `intro-timing`, `intro-skip`, `intro-once`, `intro-js-fail`, `cls`
- [ ] 4.2 `playDoorIntro` + `heroParallax`, stati iniziali sotto `html.intro`
- [ ] 4.3 QA verde
- [ ] 4.4 Controllo a vista della fluidità
- [ ] 4.5 Commit

### Task 5 — La vena di marmo
- [ ] 5.1 Controlli `vein-draw`, `vein-static`
- [ ] 5.2 `drawVein` (segmenti A, B, C + `is-reached`)
- [ ] 5.3–5.4 QA verde + commit

### Task 6 — Il respiro
- [ ] 6.1 Controlli `breath`, `breath-static`
- [ ] 6.2 `Breath` (ciclo 4 s + 6 s, passi, Pausa, pausa fuori schermo)
- [ ] 6.3–6.4 QA verde + commit

### Task 7 — Piccoli movimenti
- [ ] 7.1 Controlli `small-moves`, `small-static`
- [ ] 7.2 Intestazione a pillola, pallino (3 pulsazioni), stelle 4,4, evidenziatore, mappa + segnaposto
- [ ] 7.3–7.4 Suite completa verde + commit

### Task 8 — Belli da avere (facoltativi)
- [ ] 8.1 Lettera che si scrive scorrendo + sottolineatura della firma
- [ ] 8.2 Icone delle cure che si disegnano
- [ ] 8.3 Preventivo che si apre

### Task 9 — Prestazioni e verifica finale
- [ ] 9.1 JS ≤ 120 KB gzip
- [ ] 9.2 Lighthouse: LCP < 2,5 s, CLS 0, accessibilità ≥ 95
- [ ] 9.3 60 fps (CPU 4×)
- [ ] 9.4 Suite completa verde
- [ ] 9.5 Prova su iPhone e Android dall'app Gmail, anche con "Riduci movimento"
- [ ] 9.6 Zero residui di Provedel
- [ ] 9.7 Commit

### Task 10 — Pubblicazione e consegna
- [ ] 10.1 Deploy Vercel `studio-giannola` + verifica noindex
- [ ] 10.2 Controllo pre-consegna (10 voci)
- [ ] 10.3 Filippo: nome mittente corretto in "Battistiol"
- [ ] 10.4 Filippo: risposta immediata inviata
- [ ] 10.5 Filippo: messaggio di consegna inviato
- [ ] 10.6 Attesa di 2 giorni → eventuale promemoria → chiusura
