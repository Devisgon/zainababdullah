import { JsonLd } from "@/components/seo/json-ld";
import { Brain, Workflow, Globe, ArrowUpRight, Check } from "lucide-react";
import { PageShell, PageCTA } from "@/components/layout/page-shell";
import { Portrait } from "@/components/media/portrait";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_URL, site } from "@/lib/content/site";
import content from "@/content/about.json";
export const metadata = pageMetadata(
  "About — CEO & Digital Marketer",
  "Meet Zainab Abdullah, CEO of Devisgon Private Limited. Discover her journey from psychology and business analysis to paid ads, social media and content marketing.",
  "/about",
);
export default function About() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: SITE_URL + "/about",
    name: "About Zainab Abdullah",
    mainEntity: {
      "@type": "Person",
      "@id": SITE_URL + "/#zainab",
      name: "Zainab Abdullah",
      sameAs: site.socialProfiles.flatMap((profile) =>
        profile.url ? [profile.url] : [],
      ),
      jobTitle: site.jobTitle,
      description: site.bio,
      worksFor: { "@type": "Organization", name: "Devisgon Private Limited" },
    },
  };
  return (
    <PageShell>
      <JsonLd data={schema} />
      <section className="container about-hero">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>About</span>
          </nav>
          <span className="eyebrow">A HUMAN PERSPECTIVE. A BUSINESS MIND.</span>
          <h1 className="about-career-headline">
            <span className="about-title-role">{content.role}</span>
            <span className="about-title-main">{content.headline}</span>
            <span className="about-title-specialisms">
              {content.specialisms}
            </span>
          </h1>
          <p>{content.intro}</p>
          <a href="/contact" className="button">
            Let’s talk about your business <ArrowUpRight size={18} />
          </a>
        </div>
        <Portrait priority />
      </section>
      <section className="container about-story">
        <span className="eyebrow">
          DIFFERENT EXPERIENCES. ONE CONNECTED APPROACH.
        </span>
        <div>
          <h2>{content.storyTitle}</h2>
          <div>
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="about-principles">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT YOU CAN EXPECT</span>
              <h2>
                Thoughtful questions.
                <br />
                <span className="serif">Practical next steps.</span>
              </h2>
            </div>
          </div>
          <div className="principles-grid">
            {[
              [
                <Brain key="b" />,
                "People before assumptions.",
                "Understand the customer, their context and the questions your business needs to answer.",
              ],
              [
                <Workflow key="w" />,
                "Clarity before complexity.",
                "Choose the channel, diagram or workflow around the problem—not around the tool.",
              ],
              [
                <Globe key="g" />,
                "A shared understanding.",
                "Agree on the scope, the goals and the way we’ll communicate before the work begins.",
              ],
            ].map(([icon, title, copy], i) => (
              <article key={i}>
                {icon}
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container about-connect">
        <div>
          <span className="eyebrow">LET’S STAY CONNECTED</span>
          <h2>
            A direct conversation.
            <br />
            <span className="serif">A better starting point.</span>
          </h2>
          <p>{content.invitation}</p>
          <SocialLinks />
        </div>
        <div className="about-facts">
          {content.facts.map((fact) => (
            <span key={fact}>
              <Check size={17} />
              {fact}
            </span>
          ))}
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}
