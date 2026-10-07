/**
 * Server statico per l'anteprima della build: si comporta come un hosting
 * vero (Netlify, Vercel, Apache): /pagina → /pagina/index.html, altrimenti 404.html,
 * con compressione gzip e cache lunga per i file con hash.
 * Uso: npm run preview  (porta 4173, oppure PORT=xxxx)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
);
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ics": "text/calendar",
  ".mp3": "audio/mpeg",
};
const compressible = new Set([".html", ".js", ".css", ".svg", ".xml", ".txt"]);

function resolve(urlPath) {
  const clean =
    decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const candidates = [
    path.join(dist, clean),
    path.join(dist, clean, "index.html"),
    path.join(dist, `${clean}.html`),
  ];
  return candidates.find(
    (file) =>
      file.startsWith(dist) &&
      fs.existsSync(file) &&
      fs.statSync(file).isFile(),
  );
}

http
  .createServer((req, res) => {
    // Gli script di Vercel Analytics/Speed Insights esistono solo su Vercel:
    // qui rispondiamo con uno script vuoto, come farebbe l'hosting vero.
    if ((req.url || "").startsWith("/_vercel/")) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end("");
      return;
    }
    const file = resolve(req.url || "/");
    const target = file ?? path.join(dist, "404.html");
    const ext = path.extname(target);
    const headers = {
      "Content-Type": types[ext] ?? "application/octet-stream",
      "Cache-Control": target.includes(`${path.sep}assets${path.sep}`)
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    };
    const gzip =
      compressible.has(ext) &&
      /gzip/.test(req.headers["accept-encoding"] || "");
    if (gzip) headers["Content-Encoding"] = "gzip";
    res.writeHead(file ? 200 : 404, headers);
    const stream = fs.createReadStream(target);
    (gzip ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
  })
  .listen(port, () => console.log(`Anteprima su http://localhost:${port}`));
