/**
 * Ottimizza le foto dello studio: da foto-sorgenti/*.jpg crea in public/foto/
 * <nome>.webp (lato lungo max 1600 px) e <nome>-800.webp (per i telefoni).
 *   node scripts/foto.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const srcDir = path.resolve("foto-sorgenti");
const outDir = path.resolve("public/foto");
fs.mkdirSync(outDir, { recursive: true });
const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage();
const mime = (f) =>
  /\.png$/i.test(f)
    ? "image/png"
    : /\.webp$/i.test(f)
      ? "image/webp"
      : "image/jpeg";
for (const file of files) {
  const b64 = fs.readFileSync(path.join(srcDir, file)).toString("base64");
  const out = await page.evaluate(
    async (data) => {
      const img = new Image();
      img.src = data;
      await img.decode();
      const encode = async (max) => {
        const k = Math.min(
          1,
          max / Math.max(img.naturalWidth, img.naturalHeight),
        );
        const w = Math.round(img.naturalWidth * k),
          h = Math.round(img.naturalHeight * k);
        const c = new OffscreenCanvas(w, h);
        const ctx = c.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        const buf = new Uint8Array(
          await (
            await c.convertToBlob({ type: "image/webp", quality: 0.82 })
          ).arrayBuffer(),
        );
        let s = "";
        for (const b of buf) s += String.fromCharCode(b);
        return { w, h, b64: btoa(s) };
      };
      return { big: await encode(1600), small: await encode(800) };
    },
    `data:${mime(file)};base64,${b64}`,
  );
  const name = file.replace(/\.[^.]+$/, "");
  fs.writeFileSync(
    path.join(outDir, `${name}.webp`),
    Buffer.from(out.big.b64, "base64"),
  );
  fs.writeFileSync(
    path.join(outDir, `${name}-800.webp`),
    Buffer.from(out.small.b64, "base64"),
  );
  console.log(`${name}: ${out.big.w}×${out.big.h}`);
}
await browser.close();
