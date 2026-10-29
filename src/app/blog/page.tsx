import { ArrowRight, ArrowLeft, FileText, Search } from "lucide-react";
import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { BlogCard } from "@/features/blog/components/blog-card";
import { listBlogPosts } from "@/features/blog/server/repository";
import { blogCategories } from "@/features/blog/schema";
import { pageMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
type Props = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};
function options(params: { q?: string; category?: string; page?: string }) {
  return {
    query: (params.q || "").trim().slice(0, 150),
    category: blogCategories.includes(
      params.category as (typeof blogCategories)[number],
    )
      ? params.category || ""
      : "",
    page: Math.max(
      1,
      Math.min(10000, Number.parseInt(params.page || "1", 10) || 1),
    ),
  };
}
function pagePath(query: string, category: string, page: number) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  if (category) p.set("category", category);
  if (page > 1) p.set("page", String(page));
  return "/blog" + (p.size ? "?" + p.toString() : "");
}
export async function generateMetadata({ searchParams }: Props) {
  const o = options(await searchParams);
  const data = await listBlogPosts(o);
  return pageMetadata(
    o.page > 1
      ? `Blog — Page ${o.page}`
      : "Blog — Paid Ads, Content & Business Clarity",
    "Practical perspectives on Meta Ads, TikTok Ads, Google Ads, content marketing and business analysis from Zainab Abdullah.",
    pagePath(o.query, o.category, o.page),
    data.total > 0 && !o.query,
  );
}
export default async function Blog({ searchParams }: Props) {
  const o = options(await searchParams);
  const { posts, total } = await listBlogPosts(o);
  const totalPages = Math.max(1, Math.ceil(total / 9));
  return (
    <PageShell>
      <PageIntro
        name="Blog"
        eyebrow="IDEAS WORTH THINKING ABOUT"
        title="A fresh perspective."
        accent="A clearer next move."
        description="Thoughts on paid advertising, meaningful content and the business processes behind better decisions."
      />
      <section className="container blog-list-section">
        <form className="blog-search" action="/blog" method="get">
          <label className="blog-search-input">
            <Search size={17} />
            <input
              name="q"
              defaultValue={o.query}
              placeholder="Search articles"
              aria-label="Search articles"
              maxLength={150}
            />
          </label>
          <select
            name="category"
            defaultValue={o.category}
            aria-label="Article topic"
          >
            <option value="">All topics</option>
            {blogCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="button button-small" type="submit">
            Find articles <ArrowRight size={16} />
          </button>
        </form>
        {posts.length ? (
          <>
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="blog-pagination" aria-label="Article pages">
                {o.page > 1 ? (
                  <a href={pagePath(o.query, o.category, o.page - 1)}>
                    <ArrowLeft size={16} />
                    Previous
                  </a>
                ) : (
                  <span />
                )}
                <span>
                  Page {o.page} of {totalPages}
                </span>
                {o.page < totalPages ? (
                  <a href={pagePath(o.query, o.category, o.page + 1)}>
                    Next
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="blog-empty">
            <span className="blog-empty-icon">
              <FileText size={31} />
            </span>
            <span className="eyebrow">
              {o.query || o.category
                ? "A DIFFERENT SEARCH MIGHT HELP"
                : "A SPACE FOR FRESH IDEAS"}
            </span>
            <h2>
              {o.query || o.category
                ? "No articles match this search."
                : "The first articles are on their way."}
            </h2>
            <p>
              {o.query || o.category
                ? "Try another keyword or browse all topics."
                : "New perspectives on advertising, content and business clarity will appear here. In the meantime, explore the services or bring your own question to a conversation."}
            </p>
            <a
              className="text-link"
              href={o.query || o.category ? "/blog" : "/services"}
            >
              {o.query || o.category
                ? "See all articles"
                : "Explore the services"}
              <ArrowRight size={16} />
            </a>
          </div>
        )}
      </section>
      <PageCTA
        title="Have a question about your business?"
        accent="Let’s put it into context."
      />
    </PageShell>
  );
}
