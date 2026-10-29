import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { WorkGallery } from "@/features/work/components/work-gallery";
import { workProjects } from "@/lib/content/trust";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "My Work — Campaigns, Content & Business Analysis",
  "Explore the thinking, process and deliverables behind Zainab Abdullah’s client projects.",
  "/work",
  workProjects.length > 0,
);
export default function Work() {
  return (
    <PageShell>
      <PageIntro
        name="My work"
        eyebrow="THE THINKING BEHIND THE DELIVERABLE"
        title="My work."
        accent="With the story behind it."
        description="A home for campaign, content and business analysis project stories—with the challenge, the decisions and the deliverables kept in context."
      />
      <section className="container work-section">
        <WorkGallery />
      </section>
      <section className="container project-story-note">
        <span className="eyebrow">WHAT MAKES A USEFUL PROJECT STORY?</span>
        <div className="story-note-grid">
          {[
            [
              "01",
              "The challenge",
              "The business need and the questions that shaped the work.",
            ],
            [
              "02",
              "The approach",
              "The choices, the reasoning and the way the project moved forward.",
            ],
            [
              "03",
              "The deliverables",
              "The campaign, content, diagram or documentation created for the project.",
            ],
          ].map(([n, t, c]) => (
            <article key={n}>
              <span>{n}</span>
              <h2>{t}</h2>
              <p>{c}</p>
            </article>
          ))}
        </div>
      </section>
      <PageCTA
        title="Have a challenge of your own?"
        accent="Let’s map the next step."
      />
    </PageShell>
  );
}
