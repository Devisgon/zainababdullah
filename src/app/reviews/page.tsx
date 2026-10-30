import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { ReviewList } from "@/features/reviews/components/review-list";
import { clientReviews } from "@/lib/content/trust";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Client Reviews & Feedback",
  "Read eight 5-star Fiverr reviews of Zainab Abdullah’s business analysis, BPMN diagrams, system architecture, Figma wireframes and landing page design.",
  "/reviews",
  clientReviews.length > 0,
);
export default function Reviews() {
  return (
    <PageShell>
      <PageIntro
        name="Client reviews"
        eyebrow="CLIENT EXPERIENCES ON FIVERR"
        title="Good relationships."
        accent="Honest feedback."
        description="Client feedback on business analysis, process mapping, system architecture and Figma design, in their own words."
      />
      <section className="container reviews-section">
        <div className="review-summary" aria-label="Review highlights">
          <div>
            <strong>{clientReviews.length} reviews</strong>
            <span>Each rated 5.0 out of 5 on Fiverr</span>
          </div>
        </div>
        <ReviewList />
      </section>
      <section className="container review-context">
        <div>
          <span className="eyebrow">BEYOND A RATING</span>
          <h2>
            The experience
            <br />
            <span className="serif">matters, too.</span>
          </h2>
        </div>
        <p>
          Clear communication, an agreed scope and a shared understanding of the
          work are part of the engagement. If you’re considering a project,
          start with the services and the approach—or tell me what your business
          needs.
        </p>
      </section>
      <PageCTA
        title="Let’s start with your goals."
        accent="And a conversation that helps."
      />
    </PageShell>
  );
}
