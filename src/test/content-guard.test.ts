import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { CONTENT } from "@/data/content";

const root = path.resolve(__dirname, "../..");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "test" ? [] : sourceFiles(p);
    return /\.(ts|tsx|css)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [p] : [];
  });
}

/** Ciò che non va mai scritto: residui di Provedel e dati non verificati. */
const FORBIDDEN =
  /Tezze|Pier\b|Provedel|0438|Gina Roma|Vazzola|Antonin?o\b|WhatsApp|Blue Assistance|€|\bdal (19|20)\d\d\b|laurea|specializzat/i;

/** Il registro è "Lei": queste forme del "tu" non devono comparire. */
const TU = /\b(tu|ti|tuo|tua|vieni|chiamaci|dicci)\b/i;

function strings(value: unknown, skip: unknown[] = []): string[] {
  if (skip.includes(value)) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v, skip));
  if (value && typeof value === "object") return Object.values(value).flatMap((v) => strings(v, skip));
  return [];
}

describe("regole sui contenuti", () => {
  const files = [...sourceFiles(path.join(root, "src")), path.join(root, "index.html")];

  it.each(files.map((f) => [path.relative(root, f), f]))("%s non contiene dati vietati", (_name, file) => {
    const text = fs.readFileSync(file as string, "utf8");
    expect(text.match(FORBIDDEN)?.[0] ?? null).toBeNull();
  });

  it("i testi usano il \"Lei\" (citazioni dei pazienti escluse)", () => {
    const offending = strings(CONTENT, [CONTENT.reviews.quotes]).filter((s) => TU.test(s));
    expect(offending).toEqual([]);
  });
});
