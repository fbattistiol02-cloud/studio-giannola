/**
 * Pre-genera dist/index.html con il contenuto della pagina già scritto:
 * leggibile prima che parta JavaScript (e anche senza), più veloce da mostrare.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const file = path.join(dist, "index.html");
const template = fs.readFileSync(file, "utf8");
const { render } = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href
);

// Precarica i due font usati sopra la piega: titolo (Fraunces) e testo (Plex 400).
const assets = fs.readdirSync(path.join(dist, "assets"));
const preload = [
  /^fraunces-latin-full-normal-.*\.woff2$/,
  /^ibm-plex-sans-latin-400-normal-.*\.woff2$/,
]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

const html = template
  .replace("<!--app-head-->", preload)
  .replace("<!--app-html-->", render());
fs.writeFileSync(file, html);
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
