import { ArrowUpRight, MessageSquare, Quote } from "lucide-react";
import { clientReviews } from "@/lib/content/trust";
export function ReviewList({ limit }: { limit?: number }) {
  const items = limit ? clientReviews.slice(0, limit) : clientReviews;
  return items.length ? (
    <div className="reviews-grid">
      {items.map((review) => (
        <figure className="review-card" key={review.id}>
          <div className="review-top">
            <Quote size={23} />
            <span
              className={`market-badge market-${review.platform.toLowerCase()}`}
            >
              {review.platform}
            </span>
          </div>
          <blockquote>{review.quote}</blockquote>
          <figcaption>
            <strong>{review.clientName}</strong>
            {review.clientRole && <span>{review.clientRole}</span>}
            {review.service && <small>{review.service}</small>}
          </figcaption>
          {review.sourceUrl && (
            <a
              className="text-link"
              href={review.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the original review <ArrowUpRight size={14} />
            </a>
          )}
        </figure>
      ))}
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
