import { renderToString } from "react-dom/server";
import App from "./App";

/** HTML della pagina, pre-generato in fase di build (scripts/prerender.mjs). */
export function render(): string {
  return renderToString(<App />);
}
