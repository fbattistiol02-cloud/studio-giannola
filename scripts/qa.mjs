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
