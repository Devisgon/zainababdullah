import { ArrowUpRight, Check } from "lucide-react";
import { LeadForm } from "@/features/leads/components/lead-form";
import { LINKEDIN_URL } from "@/lib/content/site";
export function ProjectSection() {
  return (
    <section className="project-section" id="project">
      <div className="container project-grid">
        <div className="project-copy">
          <span className="eyebrow">
            <span className="section-number">04 /</span>LET’S MAKE YOUR NEXT
            MOVE COUNT
          </span>
          <h2>
            You bring
            <br />
            the ambition.
            <br />
            <span className="serif">
              I’ll bring
              <br />
              the questions.
            </span>
          </h2>
          <p>
            Tell me a little about your business and what you’d like to change.
            We’ll start with a conversation about what makes sense for you.
          </p>
          <div className="project-promises">
            <span>
              <Check size={16} />A brief shaped around your needs
            </span>
            <span>
              <Check size={16} />
              Clear scope before any commitment
            </span>
            <span>
              <Check size={16} />
              Direct collaboration with Zainab
            </span>
          </div>
          <div className="linkedin-alternative">
            <span>Prefer a direct hello?</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              Let’s connect on LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
