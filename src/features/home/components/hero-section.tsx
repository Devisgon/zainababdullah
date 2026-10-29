import { ArrowUpRight, ArrowDown, Check } from "lucide-react";
import { Portrait } from "@/components/media/portrait";
import { SocialLinks } from "@/components/layout/social-links";
import content from "@/content/home.json";
export function HeroSection() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow hero-eyebrow">
          <span className="status-dot" />
          {content.hero.eyebrow}
        </div>
        <h1>
          <span className="headline-first">{content.hero.headline[0]}</span>
          <br />
          {content.hero.headline[1]}{" "}
          <span className="serif">{content.hero.headline[2]}</span>
          <br />
          <span className="growth-word">
            {content.hero.headline[3]}
            <svg viewBox="0 0 330 20" aria-hidden="true">
              <path d="M4 13Q150 0 320 10M12 18Q180 8 327 16" />
            </svg>
          </span>
        </h1>
        <p>
          {content.hero.subheadline[0]}
          <br />
          {content.hero.subheadline[1]}
        </p>
        <p className="hero-detail">{content.hero.description}</p>
        <div className="hero-actions">
          <a className="button" href="#project">
            {content.hero.primaryCta} <ArrowUpRight size={19} />
          </a>
          <a className="hero-secondary" href="#services">
            {content.hero.secondaryCta} <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-social">
          <SocialLinks compact />
          <span>LET’S CONNECT</span>
        </div>
        <div className="hero-footnote">
          <span className="tiny-check">
            <Check size={11} />
          </span>
          {content.hero.footnote}
        </div>
      </div>
      <div className="hero-portrait">
        <Portrait priority />
      </div>
    </section>
  );
}
