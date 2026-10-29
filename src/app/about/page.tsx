import { JsonLd } from "@/components/seo/json-ld";
import { Brain, Workflow, Globe, ArrowUpRight, Check } from "lucide-react";
import { PageShell, PageCTA } from "@/components/layout/page-shell";
import { Portrait } from "@/components/media/portrait";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_URL, LINKEDIN_URL } from "@/lib/content/site";
export const metadata = pageMetadata(
  "About Zainab Abdullah — Digital Marketer & Business Analyst",
  "Meet Zainab Abdullah: digital marketer, psychologist and business analyst specialising in paid ads, content strategy, UML, BPMN and process mapping.",
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
      sameAs: [LINKEDIN_URL],
      jobTitle: "Digital Marketer & Business Analyst",
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
          <h1>
            Hi, I’m Zainab.
            <br />
            <span className="serif">
              Curious about people.
              <br />
              Clear about purpose.
            </span>
          </h1>
          <p>
            I’m a digital marketer, psychologist and business analyst. I bring
            those perspectives together to understand your audience, clarify
            your message and connect the work to your business goals.
          </p>
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
          <h2>
            There’s a person
            <br />
            <span className="serif">behind every decision.</span>
          </h2>
          <div>
            <p>
              My psychology background shapes the way I think about motivations,
              questions and the choices people make. In marketing, that
              perspective helps me ask better questions about the audience and
              the message.
            </p>
            <p>
              My digital marketing work began in July 2026. Today, my main focus
              is Meta ads, TikTok ads and Google Ads, with content marketing
              supporting the wider strategy.
            </p>
            <p>
              I also bring more than two years of business analysis experience.
              That work includes UML diagrams, BPMN, swimlanes, process mapping,
              workflows, architecture diagrams and technical documentation.
            </p>
            <p>
              I’ve worked with clients around the world through Upwork and
              Fiverr, and through connections on Instagram and LinkedIn. Whether
              we’re discussing an ad campaign or a complex workflow, the
              starting point is the same: understand the problem before choosing
              the solution.
            </p>
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
          <p>
            Find me online, or share a project brief to start a focused
            conversation about your business.
          </p>
          <SocialLinks />
        </div>
        <div className="about-facts">
          <span>
            <Check size={17} />
            Digital marketing since July 2026
          </span>
          <span>
            <Check size={17} />
            More than two years in business analysis
          </span>
          <span>
            <Check size={17} />
            Psychology background
          </span>
          <span>
            <Check size={17} />
            International, remote collaboration
          </span>
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}
