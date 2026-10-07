import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const [w, h] of [[375, 812], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await p.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `qa-shots/full-${w}.png`, fullPage: true });
  await p.screenshot({ path: `qa-shots/top-${w}.png` });
}
await b.close();
