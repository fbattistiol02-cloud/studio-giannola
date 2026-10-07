import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/** Indirizzo pubblico della demo (variabile SITE_URL > indirizzo di produzione Vercel > predefinito). */
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://studio-giannola.vercel.app")
).replace(/\/+$/, "");

export default defineConfig({
  plugins: [react()],
  define: { __SITE_URL__: JSON.stringify(siteUrl) },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
