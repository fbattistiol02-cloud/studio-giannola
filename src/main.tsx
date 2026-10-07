import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Pagina pre-generata: la "risvegliamo". In sviluppo la disegniamo da zero.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
