import { ArrowRight, ArrowUpRight, Workflow } from "lucide-react";

import content from "@/content/home.json";
export function AnalysisSection() {
  return (
    <section className="analysis-section container">
      <div className="analysis-copy">
        <span className="eyebrow">NEED CLARITY BEYOND THE CAMPAIGN?</span>
        <h2>
          Make the complex
          <br />
          <span className="serif">make sense.</span>
        </h2>
        <p>
          Sometimes growth starts with a better process. With 2+ years in
          business analysis, I help teams turn complicated ideas into clear
          diagrams, workflows and technical documentation.
        </p>
        <a className="text-link" href="/services/business-analysis">
          Explore business analysis <ArrowUpRight size={18} />
        </a>
      </div>
      <div
        className="analysis-diagram"
        aria-label="Examples of business analysis deliverables"
      >
        <div className="diagram-caption">
          <Workflow size={17} />
          CLARITY, MAPPED OUT
        </div>
        <div className="diagram-flow">
          <span>Understand</span>
          <ArrowRight size={16} />
          <span className="diagram-middle">Map it</span>
          <ArrowRight size={16} />
          <span>Move forward</span>
        </div>
        <div className="diagram-tags">
          {content.analysis.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
