import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { ReviewList } from "@/features/reviews/components/review-list";
import { clientReviews } from "@/lib/content/trust";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Client Reviews & Feedback",
  "Client feedback on working with Zainab Abdullah, with source links where available.",
  "/reviews",
  clientReviews.length > 0,
);
export default function Reviews() {
  return (
    <PageShell>
      <PageIntro
        name="Client reviews"
        eyebrow="FEEDBACK THAT BELONGS TO THE CLIENT"
        title="Good relationships."
        accent="Honest feedback."
        description="A place for clients to describe the experience in their own words, with the original review source where available."
      />
      <section className="container reviews-section">
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
