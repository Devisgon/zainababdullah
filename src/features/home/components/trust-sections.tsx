import { ArrowUpRight, Layers } from "lucide-react";
import { ReviewList } from "@/features/reviews/components/review-list";
import { workProjects } from "@/lib/content/trust";
export function TrustSections() {
  return (
    <section className="section container trust-section">
      <div className="trust-work-callout">
        <div>
          <span className="eyebrow">THE THINKING. THE PROCESS. THE WORK.</span>
          <h2>
            Good work has
            <br />
            <span className="serif">a story behind it.</span>
          </h2>
          <p>
            A place for the business challenge, the choices and the deliverables
            that made a project come together.
          </p>
          <a className="text-link" href="/work">
            Explore my work <ArrowUpRight size={17} />
          </a>
        </div>
        <a href="/work" className="work-teaser">
          <Layers size={34} />
          <span>
            {workProjects.length
              ? "EXPLORE SELECTED PROJECTS"
              : "PROJECT STORIES, COMING SOON"}
          </span>
          <strong>
            From the first question
            <br />
            to the next clear step.
          </strong>
          <ArrowUpRight size={26} />
        </a>
      </div>
      <div className="section-heading reviews-heading">
        <div>
          <span className="eyebrow">RELATIONSHIPS MATTER</span>
          <h2>
            Let the experience
            <br />
            <span className="serif">speak for itself.</span>
          </h2>
        </div>
        <a className="text-link" href="/reviews">
          Client reviews <ArrowUpRight size={17} />
        </a>
      </div>
      <ReviewList limit={2} />
    </section>
  );
}
