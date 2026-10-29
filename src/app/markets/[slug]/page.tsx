import { notFound } from "next/navigation";
import { markets } from "@/features/markets/content";
import { services } from "@/features/services/content";
import { PageShell, PageCTA } from "@/components/layout/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/content/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return markets.map((m) => ({ slug: m.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const m = markets.find((m) => m.slug === slug);
  return m
    ? pageMetadata(m.title, m.description, `/markets/${m.slug}`)
    : { title: "Market not found", robots: { index: false } };
}
export default async function Market({ params }: Props) {
  const { slug } = await params;
  const m = markets.find((m) => m.slug === slug);
  if (!m) notFound();
  const url = `${SITE_URL}/markets/${m.slug}`;
  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": url + "#service",
              url,
              name: m.title,
              description: m.description,
              serviceType: "Remote paid advertising management",
              areaServed: { "@type": "Country", name: m.name },
              provider: {
                "@type": "Person",
                "@id": SITE_URL + "/#zainab",
                name: "Zainab Abdullah",
                url: SITE_URL,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Markets",
                  item: SITE_URL + "/markets",
                },
                { "@type": "ListItem", position: 3, name: m.name, item: url },
              ],
            },
          ],
        }}
      />
      <section className="container page-intro">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/markets">Markets</a>
          <span>/</span>
          <span aria-current="page">{m.name}</span>
        </nav>
        <span className="eyebrow">REMOTE · {m.label.toUpperCase()}</span>
        <h1>{m.title}</h1>
        <p>{m.intro}</p>
        <a className="button" href="/contact">
          Discuss your campaign →
        </a>
      </section>
      <section className="container detail-section">
        <h2>A campaign brief built for {m.name}.</h2>
        <div className="market-copy">
          {m.sections.map(([heading, copy]) => (
            <article key={heading}>
              <h3>{heading}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p>
          Scope your budget in {m.currency}; scheduling reference: {m.timezone}.
          Services are remote, with deliverables and availability agreed after
          reviewing your brief.
        </p>
      </section>
      <section className="container related-services">
        <h2>Explore campaign services</h2>
        <div className="related-links">
          {services.map((s) => (
            <a href={`/services/${s.slug}`} key={s.slug}>
              {s.name} →
            </a>
          ))}
        </div>
      </section>
      <section className="container detail-faq">
        <h2>Questions from {m.name} businesses</h2>
        {m.questions.map(([q, a]) => (
          <details className="faq-item" key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="container detail-section">
        <h2>Other markets</h2>
        <div className="related-links">
          {markets
            .filter((x) => x.slug !== slug)
            .map((x) => (
              <a key={x.slug} href={`/markets/${x.slug}`}>
                {x.label} →
              </a>
            ))}
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}
