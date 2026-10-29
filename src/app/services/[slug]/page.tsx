import { marketAreas } from "@/features/markets/content";
import { MarketLinks } from "@/features/markets/components/market-links";
import { JsonLd } from "@/components/seo/json-ld";
export const dynamicParams = false;
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Header, Footer } from "@/components/layout/site-chrome";
import { SITE_URL } from "@/lib/content/site";
import { services } from "@/features/services/content";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) return { title: "Service not found" };
  return {
    title: s.seoTitle,
    description: s.description,
    alternates: { canonical: `${SITE_URL}/services/${s.slug}` },
    openGraph: {
      title: s.seoTitle,
      description: s.description,
      url: `${SITE_URL}/services/${s.slug}`,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.description,
      images: ["/og-image.png"],
    },
  };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  const url = `${SITE_URL}/services/${s.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": url + "#service",
        name: s.name,
        description: s.description,
        url,
        serviceType: s.short,
        provider: {
          "@type": "Person",
          "@id": SITE_URL + "/#zainab",
          name: "Zainab Abdullah",
          url: SITE_URL,
        },
        areaServed: marketAreas,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: SITE_URL+"/services" },
          { "@type": "ListItem", position: 3, name: s.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.questions.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <JsonLd data={schema} />
        <section className="container service-page-hero">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/#services">Services</a>
            <span>/</span>
            <span aria-current="page">{s.name}</span>
          </nav>
          <div className="eyebrow">
            {s.name.toUpperCase()} · ZAINAB ABDULLAH
          </div>
          <h1>
            {s.title.split("\n")[0]}
            <br />
            <span className="serif">{s.title.split("\n")[1]}</span>
          </h1>
          <p>{s.intro}</p>
          <a href="/#project" className="button">
            Let’s talk about {s.name.toLowerCase()} <ArrowUpRight size={18} />
          </a>
        </section>
        <section className="container detail-section">
          <h2>
            Clear support.
            <br />
            <span className="serif">A scope that makes sense.</span>
          </h2>
          <div className="deliverable-grid">
            {s.deliverables.map(([title, copy], i) => (
              <article className="deliverable-card" key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <aside className="container detail-fit">
          <h2>
            Could this be
            <br />
            <span className="serif">your next step?</span>
          </h2>
          <p>
            {s.fit} The final deliverables, timing and fees are agreed after
            reviewing your brief.
          </p>
        </aside>
        <section className="container detail-faq">
          <h2>Before we get started.</h2>
          {s.questions.map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>
                <span>{q}</span>
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section className="container related-services">
          <h2>Explore the rest of the picture.</h2>
          <div className="related-links">
            {services
              .filter((x) => x.slug !== slug)
              .map((x) => (
                <a key={x.slug} href={`/services/${x.slug}`}>
                  {x.name}
                  <ArrowUpRight size={15} />
                </a>
              ))}
          </div>
        </section>
        <MarketLinks />
        <section className="detail-cta">
          <div className="container">
            <h2>
              A clearer starting point.
              <br />
              <span className="serif">A more useful conversation.</span>
            </h2>
            <a href="/#project" className="button">
              Share your project brief <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
