import { OptimizedImage } from "./optimized-image";
import { ArrowUpRight } from "lucide-react";
import { portraits } from "@/lib/content/trust";
export function Portrait({
  variant = "primary",
  priority = false,
  small = false,
  landscape = false,
}: {
  variant?: "primary" | "secondary";
  priority?: boolean;
  small?: boolean;
  landscape?: boolean;
}) {
  const asset = portraits[variant] || portraits.primary;
  return (
    <figure
      className={`portrait-frame ${landscape ? "portrait-landscape" : ""} ${small ? "portrait-small" : ""} ${asset ? "has-portrait" : ""} ${asset?.sample ? "sample-portrait" : ""}`}
    >
      {asset ? (
        <>
          <OptimizedImage
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            preload={priority}
            loading={priority ? undefined : "lazy"}
            sizes={
              small
                ? "112px"
                : "(max-width: 700px) calc(100vw - 40px), (max-width: 960px) 510px, 570px"
            }
            decoding="async"
            style={{ objectPosition: asset.objectPosition || "center 30%" }}
          />
          {asset.sample && (
            <span className="sample-photo-badge">SAMPLE PHOTO</span>
          )}
        </>
      ) : (
        <div className="portrait-placeholder">
          <span className="portrait-eyebrow">THE PERSON BEHIND THE PLAN</span>
          <div className="portrait-monogram" aria-hidden="true">
            za<span>✳</span>
          </div>
          <span className="portrait-pending">Portrait coming soon</span>
        </div>
      )}
      <figcaption>
        <div>
          <strong>
            {asset?.sample ? "Sample portrait" : "Zainab Abdullah"}
          </strong>
          <span>
            {asset?.sample
              ? "AI-generated · replace with your photo"
              : "Human insight. Business clarity."}
          </span>
        </div>
        <ArrowUpRight size={22} />
      </figcaption>
    </figure>
  );
}
