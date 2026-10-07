import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const w = Number(process.argv[2] || 375), h = w > 800 ? 900 : 812;
const c = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
const p = await c.newPage();
await p.goto("http://localhost:4173", { waitUntil: "commit" });
const t0 = Date.now();
for (const t of [350, 750, 1150, 1550, 2100]) {
  await new Promise(r => setTimeout(r, t - (Date.now() - t0)));
  await p.screenshot({ path: `qa-shots/intro-${w}-${t}.png` });
}
await b.close();
