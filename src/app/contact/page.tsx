import { Check } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { LeadForm } from "@/features/leads/components/lead-form";
import { Portrait } from "@/components/media/portrait";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Contact — Let’s Talk About Your Project",
  "Discuss your paid advertising, content marketing or business analysis project with Zainab Abdullah. Share a brief with your email and WhatsApp number.",
  "/contact",
);
export default function Contact() {
  return (
    <PageShell>
      <section className="contact-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <div className="contact-grid">
            <div className="contact-copy">
              <span className="eyebrow">LET’S FIND YOUR NEXT CLEAR STEP</span>
              <h1>
                You bring the idea.
                <br />
                <span className="serif">
                  Let’s make
                  <br />a plan.
                </span>
              </h1>
              <p>
                A few thoughtful questions now can make our first conversation
                much more useful. Share what your business needs and how you’d
                like to grow.
              </p>
              <div className="project-promises">
                <span>
                  <Check size={16} />
                  Direct collaboration with Zainab
                </span>
                <span>
                  <Check size={16} />
                  Clear scope before a commitment
                </span>
                <span>
                  <Check size={16} />
                  Remote projects across markets
                </span>
              </div>
              <Portrait variant="secondary" small />
              <div className="contact-social">
                <span className="eyebrow">PREFER TO CONNECT FIRST?</span>
                <SocialLinks />
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
