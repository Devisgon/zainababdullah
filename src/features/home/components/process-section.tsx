import { ArrowUpRight } from "lucide-react";

import content from "@/content/home.json";
export function ProcessSection() {
  return (
    <section className="section container process-section" id="approach">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <span className="section-number">03 /</span>NO MYSTERY. JUST A
            METHOD.
          </span>
          <h2>
            A clear plan.
            <br />
            <span className="serif">Room to learn.</span>
          </h2>
        </div>
        <p>
          You should understand what’s happening, why it matters and what comes
          next. Here’s how we get there.
        </p>
      </div>
      <div className="process-grid">
        {content.process.map(([num, title, copy, tag]) => (
          <div className="process-step" key={num}>
            <div className="process-step-top">
              <span>{num}</span>
              <ArrowUpRight size={22} />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span className="process-label">{tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
