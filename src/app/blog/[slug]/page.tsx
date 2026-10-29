import { JsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageShell, PageCTA } from "@/components/layout/page-shell";
import { MarkdownContent } from "@/features/blog/components/markdown-content";
import {
  getPublishedPost,
  publishedSlugs,
} from "@/features/blog/server/repository";
import { articleDate, readingMinutes } from "@/features/blog/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/content/site";
export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await publishedSlugs()).map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post)
    return {
      title: "Article not found",
      robots: { index: false, follow: true },
    };
  const meta = pageMetadata(
    post.metaTitle || post.title,
    post.metaDescription || post.excerpt,
    `/blog/${post.slug}`,
  );
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: new Date(post.publishedAt!).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: ["Zainab Abdullah"],
      ...(post.coverImage
        ? { images: [{ url: post.coverImage, alt: post.coverAlt }] }
        : {}),
    },
  };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.publishedAt!).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      "@id": SITE_URL + "/#zainab",
      name: post.author,
      url: SITE_URL + "/about",
    },
    publisher: { "@type": "Person", name: "Zainab Abdullah", url: SITE_URL },
    mainEntityOfPage: SITE_URL + "/blog/" + post.slug,
    articleSection: post.category,
    ...(post.coverImage
      ? { image: new URL(post.coverImage, SITE_URL).toString() }
      : {}),
  };
  return (
    <PageShell>
      <JsonLd data={schema} />
      <article className="container blog-article">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/blog">Blog</a>
          <span>/</span>
          <span aria-current="page">{post.category}</span>
        </nav>
        <span className="eyebrow">{post.category.toUpperCase()}</span>
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        <div className="article-byline">
          <span className="author-initials" aria-hidden="true">
            za
          </span>
          <div>
            <a href="/about">{post.author}</a>
            <span>
              <time dateTime={new Date(post.publishedAt!).toISOString()}>
                {articleDate(post.publishedAt!)}
              </time>{" "}
              · {readingMinutes(post.content)} min read
            </span>
          </div>
          <a href="/contact" className="article-byline-contact">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
        {post.coverImage && (
          <figure className="article-cover">
            <img src={post.coverImage} alt={post.coverAlt} decoding="async" />
          </figure>
        )}
        <MarkdownContent content={post.content} />
        <div className="article-end">
          <a href="/blog" className="text-link">
            <ArrowLeft size={16} />
            More perspectives
          </a>
          <a href="/contact" className="text-link">
            Discuss your project <ArrowUpRight size={16} />
          </a>
        </div>
      </article>
      <PageCTA
        title="Make the next idea practical."
        accent="Let’s talk about your business."
      />
    </PageShell>
  );
}
