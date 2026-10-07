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
  /^fraunces-latin-opsz-normal-.*\.woff2$/,
  /^ibm-plex-sans-latin-400-normal-.*\.woff2$/,
]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

// CSS in linea: niente richiesta bloccante prima del primo disegno.
const cssFile = assets.find((f) => /^index-.*\.css$/.test(f));
const css = fs.readFileSync(path.join(dist, "assets", cssFile), "utf8");
const html = template
  .replace(new RegExp(`<link rel="stylesheet"[^>]*${cssFile}"[^>]*>`), `<style>${css}</style>`)
  .replace("<!--app-head-->", preload)
  .replace("<!--app-html-->", render());
fs.writeFileSync(file, html);
// Pagina unica: anche gli indirizzi sbagliati mostrano la landing (e serve.mjs non si blocca).
fs.writeFileSync(path.join(dist, "404.html"), html);
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
