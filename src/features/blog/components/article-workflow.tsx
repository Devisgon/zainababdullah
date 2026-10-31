import {
  Compass,
  Users,
  PenLine,
  Megaphone,
  ChartNoAxesCombined,
  RefreshCw,
  LayoutGrid,
  Layers3,
  Route,
  Clapperboard,
  Lightbulb,
  SlidersHorizontal,
} from "lucide-react";

const icons = [
  Compass,
  Users,
  PenLine,
  Megaphone,
  ChartNoAxesCombined,
  RefreshCw,
];
const workflowIcons = {
  Goal: Compass,
  Audience: Users,
  Platforms: LayoutGrid,
  "Content Pillars": Layers3,
  "Customer Journey": Route,
  "Content Formats": Clapperboard,
  Measurement: ChartNoAxesCombined,
  Optimization: RefreshCw,
  Create: PenLine,
  Measure: ChartNoAxesCombined,
  Learn: Lightbulb,
  Improve: SlidersHorizontal,
  Repeat: RefreshCw,
};
export function ArticleWorkflow({ source }: { source: string }) {
  const steps = source
    .trim()
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()));
  return (
    <figure className="article-workflow" data-step-count={steps.length}>
      <figcaption>
        <span className="eyebrow">THE GROWTH SYSTEM</span>
        <h3>Give every stage a purpose.</h3>
        <p>
          {steps.length} connected decisions, from your first goal to your next
          improvement.
        </p>
      </figcaption>
      <ol>
        {steps.map(([title, description, output], index) => {
          const Icon =
            workflowIcons[title as keyof typeof workflowIcons] ||
            icons[index % icons.length];
          return (
            <li key={`${index}-${title}`}>
              <div className="workflow-step-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon size={22} aria-hidden="true" />
              </div>
              <h4>{title}</h4>
              <p>{description}</p>
              <div className="workflow-output">
                <span>TAKE FORWARD</span>
                {output}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="workflow-feedback">
        <RefreshCw size={17} aria-hidden="true" />
        Use what you learn to revisit the goal and improve the next cycle.
      </p>
    </figure>
  );
}
