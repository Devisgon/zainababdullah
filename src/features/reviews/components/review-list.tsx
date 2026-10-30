import { ArrowUpRight, MessageSquare, Quote, Star } from "lucide-react";
import { clientReviews } from "@/lib/content/trust";
const projectValueFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export function ReviewList({ limit }: { limit?: number }) {
  const items = limit ? clientReviews.slice(0, limit) : clientReviews;
  return items.length ? (
    <div className="reviews-grid">
      {items.map((review) => {
        const isPreview = limit !== undefined;
        const firstParagraph = review.quote.split("\n\n")[0];
        const preview =
          firstParagraph.length > 280
            ? `${firstParagraph.slice(0, 280).replace(/\s+\S*$/, "")}…`
            : firstParagraph;
        const quote = isPreview ? preview : review.quote;
        return (
          <figure className="review-card" id={review.id} key={review.id}>
            <div className="review-top">
              {review.rating !== undefined ? (
                <div
                  className="review-rating"
                  aria-label={`${review.rating.toFixed(1)} out of 5 stars`}
                >
                  <span className="review-stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill={index < review.rating! ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                  <strong aria-hidden="true">{review.rating.toFixed(1)}</strong>
                </div>
              ) : (
                <Quote size={23} aria-hidden="true" />
              )}
              <span
                className={`market-badge market-${review.platform.toLowerCase()}`}
              >
                {review.platform}
              </span>
            </div>
            <blockquote>
              {quote.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption>
              <strong>{review.clientName}</strong>
              {review.clientRole && <span>{review.clientRole}</span>}
              {review.service && <small>{review.service}</small>}
              {review.projectValueUsd !== undefined && (
                <dl className="review-project-value">
                  <dt>Project size</dt>
                  <dd>
                    {projectValueFormatter.format(review.projectValueUsd)}{" "}
                    <span>USD</span>
                  </dd>
                </dl>
              )}
            </figcaption>
            {isPreview && quote !== review.quote ? (
              <a className="text-link" href={`/reviews#${review.id}`}>
                Read full review <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ) : review.sourceUrl ? (
              <a
                className="text-link"
                href={review.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the original review <ArrowUpRight size={14} />
              </a>
            ) : null}
          </figure>
        );
      })}
    </div>
  ) : (
    <div className="review-pending-grid">
      {["Upwork", "Fiverr"].map((platform) => (
        <div className="review-pending-card" key={platform}>
          <div className="review-top">
            <MessageSquare size={21} />
            <span className={`market-badge market-${platform.toLowerCase()}`}>
              {platform}
            </span>
          </div>
          <h3>
            Client feedback,
            <br />
            <span className="serif">in their own words.</span>
          </h3>
          <p>
            Reviews are being prepared for publication. Original feedback and
            source links will appear here.
          </p>
          <span className="pending-pill">Reviews coming soon</span>
        </div>
      ))}
    </div>
  );
}
