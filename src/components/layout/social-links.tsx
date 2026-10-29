import { ArrowUpRight } from "lucide-react";
import { socialProfiles } from "@/lib/content/trust";
function SocialIcon({ name }: { name: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "LinkedIn" ? (
        <>
          <rect x="3" y="8" width="4" height="13" rx=".5" />
          <circle cx="5" cy="4" r="2" />
          <path d="M11 21V8h4v2c1-2 6-3 6 3v8h-4v-7c0-3-2-3-2 0v7Z" />
        </>
      ) : name === "Facebook" ? (
        <path d="M14 22v-9h3l.5-4H14V6.5c0-1 .4-1.5 1.7-1.5H18V1.5A25 25 0 0 0 14.5 1C11 1 9 3 9 6v3H6v4h3v9" />
      ) : name === "Instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r=".7" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d="M4 3h4.5L20 21h-4.5L4 3Zm.5 18 6.3-7.8M13.2 10.8 19.5 3" />
      )}
    </svg>
  );
}
export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`social-links ${compact ? "social-compact" : ""}`}
      aria-label="Social profiles"
    >
      {socialProfiles.map((profile) =>
        profile.url ? (
          <a
            key={profile.name}
            className="social-button"
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Connect with Zainab on ${profile.name}`}
            title={`Connect on ${profile.name}`}
          >
            <SocialIcon name={profile.name} />
            {!compact && (
              <>
                <span>{profile.name}</span>
                <ArrowUpRight size={14} />
              </>
            )}
          </a>
        ) : (
          <span
            key={profile.name}
            className="social-button social-pending"
            role="link"
            aria-disabled="true"
            aria-label={`${profile.name} profile link coming soon`}
            title={`${profile.name} profile link coming soon`}
            tabIndex={0}
          >
            <SocialIcon name={profile.name} />
            {!compact && (
              <>
                <span>{profile.name}</span>
                <small>Soon</small>
              </>
            )}
          </span>
        ),
      )}
    </div>
  );
}
