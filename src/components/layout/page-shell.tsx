import { SectionBreadcrumb } from "@/components/seo/section-breadcrumb";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Header, Footer } from "./site-chrome";
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  name,
  path,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  name: string;
  path: string;
}) {
  return (
    <section className="container page-intro">
      <SectionBreadcrumb name={name} path={path} />
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title}
        <br />
        <span className="serif">{accent}</span>
      </h1>
      <p>{description}</p>
    </section>
  );
}
export function PageCTA({
  title = "Let’s make the next move",
  accent = "a meaningful one.",
}: {
  title?: string;
  accent?: string;
}) {
  return (
    <section className="detail-cta">
      <div className="container">
        <h2>
          {title}
          <br />
          <span className="serif">{accent}</span>
        </h2>
        <a href="/contact" className="button">
          Tell me about your project <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
