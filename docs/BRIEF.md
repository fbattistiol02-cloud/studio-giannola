# Brief — Landing demo Studio Dentistico Giannola

**Data:** 7 ottobre 2026 · **Lead:** studiogiannola@libero.it (thread Gmail "Posso mandarla?") · **Riferimento di design:** https://pier-paolo-provedel.vercel.app (codice in `/Users/utente/Pier_Paolo_Provedel`)

Questo file è la *spec*: l'implementation plan (`IMPLEMENTATION_PLAN0.MD`) la realizza. Se i due documenti divergono, vale questo.

---

## 1. Dossier del lead (fatti verificati il 7/10/2026)

| Dato | Valore | Fonte | Confidenza |
|---|---|---|---|
| Titolare | Dott. Giannola, odontoiatra (nome di battesimo incerto: "Antonino" negli elenchi, "Antonio" su Google e MioDottore) | elenchi telefonici, Google, MioDottore | nome PROBABILE |
| Indirizzo | Salita Santa Lucia, 2 — 37137 Verona (quartiere Santa Lucia) | Google Maps, elenchi | VERIFICATO |
| Coordinate | 45.4227407, 10.9596648 | Google Maps | VERIFICATO |
| Telefono | 045 567924 (fisso) | Google Maps, elenchi | VERIFICATO |
| Email | studiogiannola@libero.it | thread | VERIFICATO |
| Sito | nessuno | Google ("Aggiungi sito web") | VERIFICATO |
| Orari | lun–ven 9–12 e 15–19, sab–dom chiuso | Google Maps (altri elenchi discordanti) | DA CONFERMARE |
| Prenotazione | solo telefono | MioDottore, Google | VERIFICATO |
| Accessibilità | ingresso, bagno e parcheggio accessibili in sedia a rotelle | Google Maps | VERIFICATO |
| Pagamenti | carte di credito, debito, NFC | Google Maps | VERIFICATO |
| Convenzioni | contraddittorio (Blue Assistance su un elenco, "solo privati" su MioDottore) | — | NON USARE il nome |
| Recensioni | Google 4,4★, 27 recensioni | Google Maps | VERIFICATO |

**Temi dalle recensioni:** famiglie da generazioni (20+ anni, figli e nipoti), paura del dentista superata, onestà ("non ti fa lavori tanto per farli"), pazienza con i bambini, pulizia e puntualità.
**Cure citate dai pazienti:** pulizia, otturazioni, devitalizzazione, estrazioni (anche denti del giudizio), impianti, protesi/riabilitazione, cure per bambini.
**Critiche:** pulizia percepita come troppo breve; prezzo diverso da quello detto a voce.

### Citazioni reali utilizzabili (testo esatto da Google)
- **Roberto M.** — "Frequento lo studio Giannola da più di 20 anni, posso solo dire che è il top dei professionisti, lo stesso studio è frequentato anche dai miei figli e nipoti."
- **Mihaela O.** — "Ero terrorizzata, perché ho una vera e propria paura del dentista e del dolore. […] Oggi posso dire con il cuore che questo è diventato il mio dentista di fiducia."
- **Greta T.** — "È uno dei pochi che non ti fa lavori "tanto per farli" ma che ti dice obiettivamente cosa fare. Inoltre tutto molto pulito e ordinato."

---

## 2. Brief definitivo

Scelte: hero "Dentista di famiglia", foto stock neutra, testi a "Lei", palette Provedel con accento rosso Verona.

**Design.** Si parte dal sistema Provedel: Fraunces (titoli) e IBM Plex Sans (testo); sfondo porcelain `#f9f8f5`, testo `#0e3a5b`; stessi angoli arrotondati.
- Accento rosso Verona `#8f3f2b` per corsivi, icone e piccoli dettagli; fondo tenue `#f4e6de` al posto di `--sand`. Il blu resta per i pulsanti.
- Foto stock di studio luminoso dentro l'arco dell'hero, da sostituire con le sue foto dopo il sì.

**Sezioni:**
1. Intestazione: "Studio Dentistico Giannola · Santa Lucia, Verona", stato Aperto/Chiuso, pulsante "Chiami lo studio" → 045 567924.
2. Hero: titolo *Il dentista di famiglia di **Santa Lucia.*** · sotto: *Da più di vent'anni curiamo intere famiglie del quartiere: genitori, figli e ormai anche i nipoti.* · pulsanti [Chiami 045 567924] [Le cure] · punti di forza: Salita Santa Lucia 2 · Studio accessibile · Si riceve su appuntamento.
3. Lettera di benvenuto: breve, prima persona, firmata "Dott. Giannola", senza date/titoli/specializzazioni. Idea guida: "Le dico con chiarezza cosa serve, e solo quello."
4. "Cosa dicono i pazienti": 4,4★ su 27 recensioni Google + 3 citazioni (Roberto M., Mihaela O., Greta T.).
5. Le cure: igiene e pulizia, otturazioni, devitalizzazioni, estrazioni, impianti, protesi, cure per i bambini. In fondo il blocco "Prima di cominciare: cosa serve e quanto costa".
6. "Ha paura del dentista? Qui può dirlo.": modulo in 3 passi di Provedel, a "Lei".
7. "Venga a trovarci": mappa, indirizzo, accessibilità (ingresso, bagno, parcheggio accessibili; pagamento con carta), orari lun–ven 9–12 e 15–19 su appuntamento, nota "Ha una polizza o un fondo sanitario? Lo chieda in segreteria", telefono in grande.

**Non va inventato:** anno di apertura, laurea e specializzazioni, nome di battesimo (solo "Dott. Giannola"), prezzi, nome del fondo, collaboratori, WhatsApp.

**Prima di consegnare:** correggere il nome mittente "Batistiol" → "Battistiol"; aprire la demo dal telefono; nessun residuo di Provedel (Tezze, "Pier", 0438, Viale Gina Roma).

**Messaggi:**
- Ora: "Perfetto, Dott. Giannola. Lo preparo sul suo studio e glielo mando qui entro domani."
- Alla consegna: "Lo apra dal telefono come farebbe un paziente nuovo: in quanti secondi arriva al numero per chiamarla?"

**Prossimo passo commerciale:** nessuno finché non ha visto la demo; poi chiedere una foto dello studio o conferma degli orari, non una call.

---

## 3. Animazioni — direzione "lusso calmo", cuore = la porta che si apre

**Entra nella demo:**
1. **La porta che si apre** (momento principale): linea rosso Verona disegna l'arco; le ante si aprono sulla foto; il titolo sale riga per riga e "Santa Lucia." passa da sottile a pieno (assi variabili di Fraunces). Meno di 2 secondi, si salta con un tocco, solo alla prima visita.
2. **La vena di marmo:** linea sottile rosso Verona che si disegna scorrendo, solo tra hero, recensioni e mappa; finisce sul puntino della mappa.
3. **Il respiro** (sezione "Ha paura?"): cerchio che si espande e si contrae (≈4 s dentro, 6 s fuori), "Respiri con noi.", a ogni respiro compare uno dei 3 passi. Parte solo quando la sezione è visibile.
4. **Piccoli movimenti sobri:** pallino "Aperto ora"; stelle che si riempiono esattamente fino a 4,4 con il numero che sale; segnaposto che cade sulla mappa (con Adige e Arena che si disegnano); testi che compaiono a blocchi; intestazione che diventa pillola scorrendo; leggero zoom a parallasse della foto; evidenziatore sulle frasi chiave delle recensioni.

**Belli da avere (se c'è tempo):** lettera che si "scrive" scorrendo (parole da grigio a blu); illustrazioni a linea animate per le cure; preventivo che si apre come una lettera.

**Resta fuori:** shader del marmo, pulsante magnetico, cambio colore dello sfondo, schermata di caricamento lunga, cornetta che vibra.

**Dettagli di design:** impaginazione da rivista (titoli grandi, sezioni numerate "01 — …" con filetti, colonne asimmetriche, molto bianco, una sola parola in corsivo rosso per titolo); grana statica ~3% di opacità; icone disegnate su misura; easing morbidi di Provedel (`--ease-out`, `--ease-settle`).

**Strumenti:** GSAP (ScrollTrigger, SplitText, DrawSVG), Lenis, assi variabili di Fraunces.

**Regole:** fluido a 60 fps su un telefono medio; si anima solo posizione e trasparenza; pagina visibile in meno di 2,5 s; testi leggibili anche senza JavaScript; "riduci movimento" = versione statica; nessun effetto in loop tranne il pallino "Aperto" e il respiro (solo quando visibile).
