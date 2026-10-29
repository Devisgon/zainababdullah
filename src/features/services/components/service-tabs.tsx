"use client";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  MousePointer2,
  Search,
  Play,
  FileText,
} from "lucide-react";
import type { Service } from "@/features/services/content";
export type ServicePreview = Pick<
  Service,
  | "slug"
  | "number"
  | "name"
  | "short"
  | "title"
  | "description"
  | "tags"
  | "fit"
>;
export function ServiceTabs({ services }: { services: ServicePreview[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const icons = [
    <span className="meta-symbol" key="m">
      ∞
    </span>,
    <Play key="t" />,
    <Search key="g" />,
    <FileText key="c" />,
  ];
  return (
    <div className="service-explorer">
      <div
        className="service-tabs"
        role="tablist"
        aria-label="Explore marketing services"
      >
        {services.slice(0, 4).map((s, i) => (
          <button
            key={s.slug}
            role="tab"
            id={`tab-${s.slug}`}
            aria-controls={`panel-${s.slug}`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            ref={(e) => {
              refs.current[i] = e;
            }}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % 4;
              else if (e.key === "ArrowLeft") next = (i + 3) % 4;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 3;
              else return;
              e.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
          >
            <span>{s.number}</span>
            {s.name}
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      {services.slice(0, 4).map((s, i) => (
        <div
          key={s.slug}
          id={`panel-${s.slug}`}
          role="tabpanel"
          aria-labelledby={`tab-${s.slug}`}
          hidden={active !== i}
          tabIndex={0}
          className={`service-panel service-color-${i}`}
        >
          <div className="service-panel-copy">
            <div className="eyebrow">{s.short}</div>
            <h3>
              {s.title.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <p>{s.description}</p>
            <div className="service-tags">
              {s.tags.map((tag) => (
                <span key={tag}>
                  <Check size={14} />
                  {tag}
                </span>
              ))}
            </div>
            <a className="text-link" href={`/services/${s.slug}`}>
              Explore {s.name} <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="service-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="service-art-icon">{icons[i]}</div>
            <div className="creative-stamp">
              YOUR BRAND.
              <br />
              THEIR NEXT
              <br />
              <em>favorite.</em>
              <span>
                <MousePointer2 size={20} /> Make the connection
              </span>
            </div>
            <div className="service-fit">
              <span>A GOOD FIT FOR</span>
              {s.fit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
