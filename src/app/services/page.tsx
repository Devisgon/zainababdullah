import { JsonLd } from "@/components/seo/json-ld";
import { ArrowUpRight, Check } from "lucide-react";
import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { SITE_URL } from "@/lib/content/site";
import { services } from "@/features/services/content";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Digital Marketing & Business Analysis Services",
  "Explore Meta Ads, TikTok Ads, Google Ads, content marketing and business analysis services from Zainab Abdullah.",
  "/services",
);
export default function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Zainab Abdullah’s services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/services/${s.slug}`,
    })),
  };
  return (
    <PageShell>
      <JsonLd data={schema} />
      <PageIntro
        name="Services"
        eyebrow="HOW I CAN HELP"
        title="The right support."
        accent="For your next chapter."
        description="Paid advertising is the main focus. Content marketing strengthens the message, while business analysis brings clarity to the processes behind your business."
      />
      <section className="container service-directory">
        {services.map((s, i) => (
          <article
            key={s.slug}
            className={`directory-card ${i === 4 ? "directory-secondary" : ""}`}
          >
            <div className="directory-card-top">
              <span>
                {s.number} /{" "}
                {i < 3
                  ? "PAID ADVERTISING"
                  : i === 3
                    ? "CONTENT & MESSAGING"
                    : "BUSINESS CLARITY"}
              </span>
              <ArrowUpRight size={24} />
            </div>
            <h2>
              <a href={`/services/${s.slug}`}>{s.name}</a>
            </h2>
            <p>{s.description}</p>
            <div className="directory-tags">
              {s.tags.map((t) => (
                <span key={t}>
                  <Check size={13} />
                  {t}
                </span>
              ))}
            </div>
            <a className="text-link" href={`/services/${s.slug}`}>
              Explore {s.name} <ArrowUpRight size={17} />
            </a>
          </article>
        ))}
      </section>
      <section className="container scope-note">
        <span className="eyebrow">A CLEAR SCOPE FROM THE START</span>
        <h2>
          Start with what makes sense.
          <br />
          <span className="serif">Build from there.</span>
        </h2>
        <p>
          You don’t need every channel at once. The starting point depends on
          your audience, offer, goals and available resources. Deliverables and
          service fees are agreed before work begins; platform advertising spend
          is separate.
        </p>
      </section>
      <PageCTA
        title="Not sure which direction to take?"
        accent="Let’s start with the right questions."
      />
    </PageShell>
  );
}
