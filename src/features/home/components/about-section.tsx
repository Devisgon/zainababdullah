import { ArrowUpRight, Brain, Workflow, Globe } from "lucide-react";
import { Portrait } from "@/components/media/portrait";
import { LINKEDIN_URL } from "@/lib/content/site";
import content from "@/content/home.json";
export function AboutSection() {
  return (
    <section className="difference-section" id="about">
      <div className="container difference-grid">
        <Portrait variant="secondary" landscape />
        <div className="difference-copy">
          <span className="eyebrow">
            <span className="section-number">02 /</span>THE PERSON BEHIND THE
            PLAN
          </span>
          <h2>
            Marketing is about
            <br />
            people.
            <br />
            <span className="serif">I start there.</span>
          </h2>
          <p>{content.about.paragraphs[0]}</p>
          <p>{content.about.paragraphs[1]}</p>
          <div className="difference-points">
            <div>
              <Brain size={19} />
              <span>
                <strong>{content.about.points[0].title}</strong>
                {content.about.points[0].description}
              </span>
            </div>
            <div>
              <Workflow size={19} />
              <span>
                <strong>{content.about.points[1].title}</strong>
                {content.about.points[1].description}
              </span>
            </div>
            <div>
              <Globe size={19} />
              <span>
                <strong>{content.about.points[2].title}</strong>
                {content.about.points[2].description}
              </span>
            </div>
          </div>
          <a
            className="text-link"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet me on LinkedIn <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
