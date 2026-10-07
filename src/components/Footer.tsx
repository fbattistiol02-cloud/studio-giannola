import { CONTENT } from "@/data/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{CONTENT.footer.line}</p>
        <p>{CONTENT.footer.credit} · Foto di esempio: Kari Bjorn / Unsplash</p>
      </div>
    </footer>
  );
}
