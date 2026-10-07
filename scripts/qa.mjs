/**
 * Controlli nel browser sulla build (serve `npm run build` + `npm run preview` attivo).
 *   node scripts/qa.mjs                 → tutti i controlli
 *   node scripts/qa.mjs layout axe      → solo quelli nominati
 * Variabili: BASE (predefinito http://localhost:4173), CHROME (percorso del browser).
 */
import { chromium } from "playwright-core";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE || "http://localhost:4173";
const EXEC =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Gli agganci data-qa che la pagina deve avere (vincolo globale del piano). */
export const QA_HOOKS = [
  "header", "status", "hero", "hero-title", "hero-photo", "door", "door-leaf",
  "hero-points", "letter", "reviews", "rating-value", "stars-fill", "quote",
  "cures", "cure", "estimate", "fear", "breath", "breath-pause", "fear-step",
  "visit", "map", "map-pin", "vein", "phone-cta",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Apre una pagina e raccoglie errori di console e di pagina. */
async function open(browser, { width = 375, height = 900, reducedMotion = "reduce", js = true, init, route } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
    javaScriptEnabled: js,
  });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  if (route) await page.route(route.pattern, route.handler);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return { context, page, errors };
}

/** Scorre tutta la pagina a passi, per far partire le animazioni allo scorrimento. */
async function scrollThrough(page, step = 400, wait = 250) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(wait);
  }
}

const isVisible = (page, sel) =>
  page.$eval(sel, (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.visibility !== "hidden" && Number(s.opacity) > 0.99 && r.width > 0 && r.height > 0;
  });


/** Quanto è disegnato ogni segmento della vena (0–1), letto da stroke-dasharray. */
function drawnFractions() {
  const out = {};
  for (const p of document.querySelectorAll("[data-vein]")) {
    const len = p.getTotalLength();
    const dash = getComputedStyle(p).strokeDasharray;
    if (!dash || dash === "none") { out[p.dataset.vein] = 1; continue; }
    const [first] = dash.split(/[ ,]+/).map(parseFloat);
    // con vector-effect non-scaling-stroke DrawSVG misura in pixel di schermo
    const total = getComputedStyle(p).vectorEffect === "non-scaling-stroke" ? Math.max(len, first) : len;
    out[p.dataset.vein] = Math.min(1, first / total);
  }
  return out;
}

const CHECKS = {
  async layout(browser) {
    const problems = [];
    for (const width of [320, 375, 768, 1440]) {
      const { context, page, errors } = await open(browser, { width });
      await page.goto(BASE, { waitUntil: "networkidle" });
      const info = await page.evaluate((hooks) => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1: document.querySelectorAll("h1").length,
        missing: hooks.filter((h) => h !== "breath-pause" && !document.querySelector(`[data-qa="${h}"]`)),
        tel: document.querySelectorAll('a[href="tel:+39045567924"]').length,
      }), QA_HOOKS);
      if (info.overflow > 0) problems.push(`${width}px: scroll orizzontale di ${info.overflow}px`);
      if (info.h1 !== 1) problems.push(`${width}px: ${info.h1} h1 invece di 1`);
      if (info.missing.length) problems.push(`${width}px: mancano data-qa ${info.missing.join(", ")}`);
      if (info.tel < 2) problems.push(`${width}px: solo ${info.tel} link tel:`);
      if (errors.length) problems.push(`${width}px: errori in console: ${errors.join(" | ")}`);
      await context.close();
    }
    return problems;
  },

  async axe(browser) {
    const problems = [];
    for (const width of [375, 1440]) {
      const { context, page } = await open(browser, { width });
      await page.goto(BASE, { waitUntil: "networkidle" });
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      for (const v of res.violations.filter((v) => ["serious", "critical"].includes(v.impact)))
        problems.push(`${width}px axe ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" ; ")}`);
      await context.close();
    }
    return problems;
  },

  async "no-js"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { js: false });
    await page.goto(BASE, { waitUntil: "load" });
    const h1 = (await page.textContent("h1")) || "";
    if (!h1.includes("Santa Lucia")) problems.push(`h1 senza "Santa Lucia": ${h1}`);
    if (!(await isVisible(page, "h1"))) problems.push("h1 non visibile senza JS");
    if (!(await isVisible(page, '[data-qa="phone-cta"]'))) problems.push("telefono finale non visibile senza JS");
    const quotes = await page.$$('[data-qa="quote"]');
    if (quotes.length !== 3) problems.push(`${quotes.length} citazioni invece di 3`);
    for (const q of quotes) {
      const ok = await q.evaluate((el) => Number(getComputedStyle(el).opacity) > 0.99);
      if (!ok) problems.push("una citazione è nascosta senza JS");
    }
    await context.close();
    return problems;
  },

  async "big-text"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { width: 375 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    await sleep(300);
    const info = await page.evaluate(() => {
      const t = document.querySelector('[data-qa="hero-title"]');
      const box = t.getBoundingClientRect();
      const parent = t.parentElement.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clipped: box.bottom > parent.bottom + 1 || t.scrollWidth > t.clientWidth + 1,
      };
    });
    if (info.overflow > 0) problems.push(`testo al 200%: scroll orizzontale di ${info.overflow}px`);
    if (info.clipped) problems.push("testo al 200%: titolo dell'hero tagliato");
    await context.close();
    return problems;
  },
  async "motion-classes"(browser) {
    const problems = [];
    const classes = (page) => page.evaluate(() => document.documentElement.className);
    {
      const { context, page } = await open(browser, { reducedMotion: "reduce" });
      await page.goto(BASE, { waitUntil: "domcontentloaded" });
      const c = await classes(page);
      if (/\bmotion\b|\bintro\b/.test(c)) problems.push(`movimento ridotto: classi "${c}"`);
      await context.close();
    }
    {
      const { context, page } = await open(browser, { reducedMotion: "no-preference" });
      await page.goto(BASE, { waitUntil: "domcontentloaded" });
      const c1 = await classes(page);
      if (!/\bmotion\b/.test(c1) || !/\bintro\b/.test(c1)) problems.push(`prima visita: classi "${c1}" (attese motion + intro)`);
      // la seconda visita senza intro la verifica `intro-once` (Task 4: è l'apertura a segnarsi come vista)
      await context.close();
    }
    return problems;
  },

  async "reveals-settle"(browser) {
    const problems = [];
    const { context, page, errors } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await scrollThrough(page);
    await sleep(1500);
    const hidden = await page.$$eval("[data-reveal]", (els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99).map((el) => el.className || el.tagName),
    );
    if (hidden.length) problems.push(`${hidden.length} blocchi [data-reveal] ancora nascosti: ${hidden.slice(0, 4).join(", ")}`);
    const hasMotion = await page.evaluate(() => document.documentElement.classList.contains("motion"));
    if (!hasMotion) problems.push("manca la classe motion: i reveal non sono stati provati");
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    await context.close();
    return problems;
  },

  async "storage-blocked"(browser) {
    const problems = [];
    const { context, page, errors } = await open(browser, {
      reducedMotion: "no-preference",
      init: () => {
        Storage.prototype.getItem = () => {
          throw new DOMException("bloccato", "SecurityError");
        };
        Storage.prototype.setItem = () => {
          throw new DOMException("bloccato", "SecurityError");
        };
      },
    });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await sleep(2500);
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    if (!(await isVisible(page, "h1"))) problems.push("h1 non visibile con lo storage bloccato");
    await context.close();
    return problems;
  },
  async "intro-timing"(browser) {
    const problems = [];
    const { context, page, errors } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "commit" });
    await sleep(300);
    const at300 = await page.evaluate(() => {
      const leaf = document.querySelector('[data-qa="door-leaf"]');
      return leaf ? getComputedStyle(leaf).visibility : "assente";
    });
    if (at300 !== "visible") problems.push(`a 300 ms le ante non sono visibili (${at300})`);
    await sleep(1700);
    const at2000 = await page.evaluate(() => {
      const leaves = [...document.querySelectorAll('[data-qa="door-leaf"]')];
      const fig = document.querySelector('[data-qa="hero-photo"]').getBoundingClientRect();
      const out = leaves.every((l) => {
        const r = l.getBoundingClientRect();
        return getComputedStyle(l).visibility === "hidden" || r.right <= fig.left + 1 || r.left >= fig.right - 1;
      });
      return {
        intro: document.documentElement.classList.contains("intro"),
        leavesOut: out,
        h1: Number(getComputedStyle(document.querySelector("h1")).opacity),
        h1Vis: getComputedStyle(document.querySelector("h1")).visibility,
      };
    });
    if (at2000.intro) problems.push("a 2000 ms <html> ha ancora la classe intro");
    if (!at2000.leavesOut) problems.push("a 2000 ms le ante coprono ancora la foto");
    if (at2000.h1 < 0.99 || at2000.h1Vis !== "visible") problems.push(`a 2000 ms h1 non visibile (${at2000.h1}, ${at2000.h1Vis})`);
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    await context.close();
    return problems;
  },

  async "intro-skip"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "commit" });
    await sleep(300);
    await page.mouse.move(180, 400);
    await page.mouse.wheel(0, 600);
    await sleep(250);
    const r = await page.evaluate(() => ({
      intro: document.documentElement.classList.contains("intro"),
      y: window.scrollY,
    }));
    if (r.intro) problems.push("250 ms dopo lo scorrimento l'apertura non è finita");
    if (!(r.y > 0)) problems.push("lo scorrimento durante l'apertura è bloccato (scrollY = 0)");
    await context.close();
    return problems;
  },

  async "intro-once"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await sleep(2500);
    await page.goto(BASE, { waitUntil: "commit" });
    await sleep(100);
    const r = await page.evaluate(() => ({
      intro: document.documentElement.classList.contains("intro"),
      h1: document.querySelector("h1") ? Number(getComputedStyle(document.querySelector("h1")).opacity) : 0,
      vis: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).visibility : "assente",
    }));
    if (r.intro) problems.push("alla seconda visita parte di nuovo l'apertura");
    if (r.h1 < 0.99 || r.vis !== "visible") problems.push("alla seconda visita il titolo non è subito visibile");
    await context.close();
    return problems;
  },

  async "intro-js-fail"(browser) {
    const problems = [];
    const { context, page } = await open(browser, {
      reducedMotion: "no-preference",
      route: { pattern: "**/assets/*.js", handler: (r) => r.abort() },
    });
    await page.goto(BASE, { waitUntil: "commit" });
    await sleep(3200);
    const r = await page.evaluate(() => ({
      intro: document.documentElement.classList.contains("intro"),
      h1: Number(getComputedStyle(document.querySelector("h1")).opacity),
      vis: getComputedStyle(document.querySelector("h1")).visibility,
    }));
    if (r.intro) problems.push("senza JS dopo 3,2 s <html> ha ancora intro");
    if (r.h1 < 0.99 || r.vis !== "visible") problems.push("senza JS dopo 3,2 s il titolo non è visibile");
    await context.close();
    return problems;
  },

  async cls(browser) {
    const problems = [];
    const { context, page } = await open(browser, {
      reducedMotion: "no-preference",
      init: () => {
        window.__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      },
    });
    await page.goto(BASE, { waitUntil: "commit" });
    await sleep(3000);
    const cls = await page.evaluate(() => window.__cls);
    if (cls > 0) problems.push(`CLS = ${cls.toFixed(4)} (atteso 0)`);
    await context.close();
    return problems;
  },
  async "vein-draw"(browser) {
    const problems = [];
    const { context, page, errors } = await open(browser, { width: 1440, reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await sleep(2200);
    const before = await page.evaluate(drawnFractions);
    if (!(before.a < 0.05)) problems.push(`all'inizio il segmento A è già disegnato (${before.a.toFixed(2)})`);
    await scrollThrough(page, 500, 200);
    await page.evaluate(() => document.querySelector('[data-qa="visit"]').scrollIntoView());
    await sleep(1000);
    const after = await page.evaluate(drawnFractions);
    for (const [k, v] of Object.entries(after)) if (v < 0.98) problems.push(`segmento ${k} disegnato al ${(v * 100).toFixed(0)}%`);
    const reached = await page.$eval('[data-qa="map-pin"]', (el) => el.classList.contains("is-reached"));
    if (!reached) problems.push("il segnaposto non ha la classe is-reached");
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    await context.close();
    return problems;
  },

  async "vein-static"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { width: 1440, reducedMotion: "reduce" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const f = await page.evaluate(drawnFractions);
    for (const [k, v] of Object.entries(f)) if (v < 0.98) problems.push(`movimento ridotto: segmento ${k} al ${(v * 100).toFixed(0)}%`);
    await context.close();
    return problems;
  },
  async breath(browser) {
    const problems = [];
    const { context, page, errors } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await sleep(2200);
    await page.evaluate(() => document.querySelector('[data-qa="breath"]').scrollIntoView({ block: "center" }));
    const scale = () => page.$eval('[data-qa="breath"] .breath-core', (el) => new DOMMatrix(getComputedStyle(el).transform).a);
    const shownSteps = () => page.$$eval('[data-qa="fear-step"]', (els) => els.filter((e) => Number(getComputedStyle(e).opacity) > 0.99).length);
    await sleep(300);
    const s0 = await scale();
    await sleep(1000);
    const s1 = await scale();
    if (Math.abs(s1 - s0) < 0.01) problems.push(`il cerchio non respira (scala ${s0.toFixed(3)} → ${s1.toFixed(3)})`);
    await sleep(9700);
    const n = await shownSteps();
    if (n < 2) problems.push(`dopo 11 s solo ${n} passi visibili (attesi ≥ 2)`);
    await page.click('[data-qa="breath-pause"]');
    await sleep(1000);
    const p1 = await scale();
    await sleep(1000);
    const p2 = await scale();
    if (Math.abs(p2 - p1) > 0.002) problems.push("con Pausa il cerchio continua a muoversi");
    const pressed = await page.getAttribute('[data-qa="breath-pause"]', "aria-pressed");
    if (pressed !== "true") problems.push(`aria-pressed = ${pressed} dopo Pausa`);
    // in pausa: uscire e rientrare non deve farlo ripartire
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(600);
    await page.evaluate(() => document.querySelector('[data-qa="breath"]').scrollIntoView({ block: "center" }));
    await sleep(600);
    const q1 = await scale();
    await sleep(800);
    if (Math.abs((await scale()) - q1) > 0.002) problems.push("in pausa, rientrando nella sezione il cerchio riparte");
    // Riprendi, poi fuori schermo si ferma e al rientro riprende
    await page.click('[data-qa="breath-pause"]');
    await sleep(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(800);
    await page.evaluate(() => document.querySelector('[data-qa="breath"]').scrollIntoView({ block: "center" }));
    await sleep(300);
    const r1 = await scale();
    await sleep(900);
    if (Math.abs((await scale()) - r1) < 0.005) problems.push("dopo Riprendi il cerchio non riparte al rientro");
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    await context.close();
    return problems;
  },

  async "breath-static"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { reducedMotion: "reduce" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const n = await page.$$eval('[data-qa="fear-step"]', (els) => els.filter((e) => Number(getComputedStyle(e).opacity) > 0.99).length);
    if (n !== 3) problems.push(`movimento ridotto: ${n} passi visibili invece di 3`);
    const pauseVisible = await page.$eval('[data-qa="breath-pause"]', (el) => getComputedStyle(el).display !== "none").catch(() => false);
    if (pauseVisible) problems.push("movimento ridotto: il pulsante Pausa è visibile");
    await context.close();
    return problems;
  },
  async "small-moves"(browser) {
    const problems = [];
    // 1) stato "Aperto ora": orologio fissato a mer 7/10/2026 10:00 (Roma), a 1440px
    //    (sul telefono lo stato non c'è nell'intestazione: non ci sta)
    {
      const { context, page } = await open(browser, { width: 1440, reducedMotion: "no-preference" });
      await page.clock.setFixedTime(new Date("2026-10-07T08:00:00Z"));
      await page.goto(BASE, { waitUntil: "networkidle" });
      const status = await page.textContent('[data-qa="status"]');
      if (!/Aperto ora/.test(status)) problems.push(`stato: "${status?.trim()}" invece di "Aperto ora"`);
      await sleep(1000);
      const running = () => page.$eval('[data-qa="status"]', (el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length);
      if (!(await running())) problems.push('a 1 s il pallino "Aperto ora" non pulsa');
      await sleep(5000);
      if (await running()) problems.push("dopo 6 s il pallino pulsa ancora");
      await context.close();
    }
    // 2) il resto con l'orologio vero (GSAP misura il tempo con Date.now)
    const { context, page, errors } = await open(browser, { reducedMotion: "no-preference" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const pre = await page.evaluate(() => ({
      value: document.querySelector('[data-qa="rating-value"]').textContent.trim(),
      pin: Number(getComputedStyle(document.querySelector('[data-qa="map-pin"]')).opacity),
    }));
    if (pre.value === "4,4") problems.push("prima di arrivare alle recensioni il voto è già 4,4 (non conta)");
    if (pre.pin > 0.01) problems.push("prima di arrivare alla mappa il segnaposto è già visibile (non cade)");
    await page.evaluate(() => window.scrollTo(0, 200));
    await sleep(600);
    if (!(await page.$eval('[data-qa="header"]', (el) => el.classList.contains("is-pill")))) problems.push("scorrendo oltre 80px l'intestazione non diventa pillola");
    await page.evaluate(() => document.querySelector('[data-qa="reviews"]').scrollIntoView());
    await sleep(1500);
    const value = (await page.textContent('[data-qa="rating-value"]'))?.trim();
    if (value !== "4,4") problems.push(`voto mostrato "${value}" invece di "4,4"`);
    await page.evaluate(() => document.querySelector('[data-qa="map"]').scrollIntoView({ block: "center" }));
    await sleep(2500);
    const f = await page.$eval('[data-qa="map-pin"]', (el) => el.transform.baseVal.consolidate()?.matrix.f ?? 0);
    if (Math.abs(f - 228) > 0.5) problems.push(`segnaposto non a posto (y = ${f.toFixed(1)}, atteso 228)`);
    if (errors.length) problems.push(`errori in console: ${errors.join(" | ")}`);
    await context.close();
    return problems;
  },

  async "small-static"(browser) {
    const problems = [];
    const { context, page } = await open(browser, { reducedMotion: "reduce" });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const fill = document.querySelector('[data-qa="stars-fill"]');
      const pin = document.querySelector('[data-qa="map-pin"]');
      return {
        value: document.querySelector('[data-qa="rating-value"]').textContent.trim(),
        width: fill.getBoundingClientRect().width / fill.parentElement.getBoundingClientRect().width,
        clip: getComputedStyle(fill).clipPath,
        pinY: pin.transform.baseVal.consolidate()?.matrix.f ?? 0,
        pinOpacity: Number(getComputedStyle(pin).opacity),
        anims: document.getAnimations().filter((a) => a.playState === "running").length,
      };
    });
    if (r.value !== "4,4") problems.push(`voto "${r.value}"`);
    if (Math.abs(r.width - 0.88) > 0.01 || (r.clip && r.clip !== "none")) problems.push(`stelle: larghezza ${r.width.toFixed(2)}, clip ${r.clip}`);
    if (Math.abs(r.pinY - 228) > 0.5 || r.pinOpacity < 0.99) problems.push(`segnaposto y=${r.pinY} opacità ${r.pinOpacity}`);
    if (r.anims) problems.push(`${r.anims} animazioni attive con movimento ridotto`);
    await context.close();
    return problems;
  },
};

// ---- esecuzione --------------------------------------------------------------
const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(CHECKS);
const unknown = names.filter((n) => !CHECKS[n]);
if (unknown.length) {
  console.error(`Controlli sconosciuti: ${unknown.join(", ")}`);
  process.exit(2);
}
const browser = await chromium.launch({ executablePath: EXEC });
let failed = 0;
for (const name of names) {
  let problems;
  try {
    problems = await CHECKS[name](browser);
  } catch (e) {
    problems = [`eccezione: ${e.message.split("\n")[0]}`];
  }
  if (problems.length) {
    failed++;
    console.log(`✗ ${name}`);
    for (const p of problems) console.log(`    - ${p}`);
  } else console.log(`✓ ${name}`);
}
await browser.close();
console.log(failed ? `\n${failed}/${names.length} controlli falliti` : `\n${names.length}/${names.length} controlli superati`);
process.exit(failed ? 1 : 0);
