export const dynamicParams = false;
import { notFound } from "next/navigation";
import { PageShell, PageCTA } from "@/components/layout/page-shell";
import { workProjects } from "@/lib/content/trust";
import { pageMetadata } from "@/lib/seo/metadata";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return workProjects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = workProjects.find((p) => p.slug === slug);
  return p
    ? pageMetadata(p.title, p.summary, `/work/${p.slug}`)
    : { title: "Project not found", robots: { index: false, follow: true } };
}
export default async function WorkStory({ params }: Props) {
  const { slug } = await params;
  const p = workProjects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <PageShell>
      <article className="container project-story">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/work">My work</a>
          <span>/</span>
          <span>{p.title}</span>
        </nav>
        <span className="eyebrow">
          {p.category} / {p.service}
        </span>
        <h1>{p.title}</h1>
        <p className="story-summary">{p.summary}</p>
        {p.image && (
          <img
            className="story-image"
            src={p.image.src}
            alt={p.image.alt}
            width={p.image.width}
            height={p.image.height}
          />
        )}
        <section>
          <h2>The challenge</h2>
          <p>{p.challenge}</p>
        </section>
        <section>
          <h2>The approach</h2>
          <p>{p.approach}</p>
        </section>
        <section>
          <h2>The deliverables</h2>
          <ul>
            {p.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        {p.outcome && (
          <section>
            <h2>The outcome</h2>
            <p>{p.outcome}</p>
          </section>
        )}
        {p.permissionNote && <small>{p.permissionNote}</small>}
      </article>
      <PageCTA />
    </PageShell>
  );
}
