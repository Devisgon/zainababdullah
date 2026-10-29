"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Layers,
  MousePointer2,
  Workflow,
  FileText,
} from "lucide-react";
import { workProjects } from "@/lib/content/trust";
const categories = [
  "All work",
  "Paid media",
  "Content marketing",
  "Business analysis",
];
export function WorkGallery() {
  const [active, setActive] = useState("All work");
  const filtered = workProjects.filter(
    (p) => active === "All work" || p.category === active,
  );
  return (
    <>
      <div
        className="work-filters"
        role="group"
        aria-label="Filter work by service"
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="work-grid">
          {filtered.map((p) => (
            <article className="work-card" key={p.slug}>
              <a href={`/work/${p.slug}`} className="work-card-art">
                {p.image ? (
                  <img
                    src={p.image.src}
                    alt={p.image.alt}
                    width={p.image.width}
                    height={p.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Layers size={52} />
                )}
                <span>{p.category}</span>
                <ArrowUpRight size={23} />
              </a>
              <div className="work-card-copy">
                <span className="eyebrow">{p.service}</span>
                <h2>
                  <a href={`/work/${p.slug}`}>{p.title}</a>
                </h2>
                <p>{p.summary}</p>
                <a className="text-link" href={`/work/${p.slug}`}>
                  Read the project story <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="work-empty">
          <div className="work-empty-visual" aria-hidden="true">
            <span>
              <MousePointer2 size={30} />
            </span>
            <span>
              <FileText size={30} />
            </span>
            <span>
              <Workflow size={30} />
            </span>
          </div>
          <span className="eyebrow">REAL WORK DESERVES THE FULL STORY</span>
          <h2>
            {active === "All work"
              ? "Project stories are on their way."
              : `${active} stories are on their way.`}
          </h2>
          <p>
            Client-approved work will appear here with the challenge, the
            thinking and the deliverables. For now, explore the services or tell
            me about the project you have in mind.
          </p>
          <div className="empty-actions">
            <a href="/services" className="button">
              Explore the services <ArrowUpRight size={17} />
            </a>
            <a href="/contact" className="text-link">
              Talk about your project <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
