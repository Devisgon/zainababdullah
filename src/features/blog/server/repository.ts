import { cache } from "react";
import seedPosts from "@/content/blog.json";
import { getDatabase } from "@/lib/server/runtime";
import type { BlogPost, BlogSummary, BlogCategory } from "../schema";

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: BlogCategory;
  status: "draft" | "published";
  cover_image: string | null;
  cover_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  author: string;
  created_at: number;
  updated_at: number;
  published_at: number | null;
};
export function toPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content || "",
    category: row.category,
    status: row.status,
    coverImage: row.cover_image || "",
    coverAlt: row.cover_alt || "",
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    author: row.author,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}
const summaryColumns =
  "id,slug,title,excerpt,category,status,cover_image,cover_alt,meta_title,meta_description,author,created_at,updated_at,published_at";
const seeds = seedPosts as BlogPost[];
export type BlogQuery = {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
  editor?: boolean;
};

/** Seeded JSON articles and daily CMS posts share one public list. CMS rows take precedence. */
async function availableSourceArticles(db?: D1Database) {
  const source = seeds.filter((post) => post.status === "published");
  if (!db || !source.length) return source;
  const matches = await db
    .prepare(
      `SELECT slug FROM blog_posts WHERE slug IN (${source.map(() => "?").join(",")})`,
    )
    .bind(...source.map((post) => post.slug))
    .all<{ slug: string }>();
  const overrides = new Set(matches.results.map((post) => post.slug));
  return source.filter((post) => !overrides.has(post.slug));
}
function summaries(posts: BlogPost[]): BlogSummary[] {
  return posts.map(({ content: _, ...summary }) => summary);
}
export async function listBlogPosts({
  query = "",
  category = "",
  page = 1,
  limit = 9,
  editor = false,
}: BlogQuery = {}) {
  const db = getDatabase();
  const source = editor
    ? []
    : (await availableSourceArticles(db)).filter(
        (post) =>
          (!category || post.category === category) &&
          (!query ||
            `${post.title} ${post.excerpt}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      );
  const sort = (a: BlogSummary, b: BlogSummary) =>
    (editor
      ? b.updatedAt - a.updatedAt
      : (b.publishedAt || 0) - (a.publishedAt || 0)) ||
    a.slug.localeCompare(b.slug);
  if (!db)
    return {
      posts: summaries(source)
        .sort(sort)
        .slice((page - 1) * limit, page * limit),
      total: source.length,
    };
  const clauses: string[] = [],
    bindings: (string | number)[] = [];
  if (!editor) clauses.push("status = 'published'");
  if (query) {
    clauses.push("(title LIKE ? OR excerpt LIKE ?)");
    bindings.push(`%${query}%`, `%${query}%`);
  }
  if (category) {
    clauses.push("category = ?");
    bindings.push(category);
  }
  const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
  const count = await db
    .prepare(`SELECT COUNT(*) AS total FROM blog_posts${where}`)
    .bind(...bindings)
    .first<{ total: number }>();
  const result = await db
    .prepare(
      `SELECT ${summaryColumns} FROM blog_posts${where} ORDER BY ${editor ? "updated_at" : "published_at"} DESC,slug ASC LIMIT ? OFFSET ?`,
    )
    .bind(
      ...bindings,
      source.length ? page * limit : limit,
      source.length ? 0 : (page - 1) * limit,
    )
    .all<BlogRow>();
  const live = result.results.map((row) => {
    const { content: _, ...summary } = toPost(row);
    return summary;
  });
  return {
    posts: source.length
      ? [...live, ...summaries(source)]
          .sort(sort)
          .slice((page - 1) * limit, page * limit)
      : live,
    total: (count?.total || 0) + source.length,
  };
}
// React request memoization prevents metadata and the article view from issuing duplicate reads.
export const getPublishedPost = cache(async (slug: string) => {
  const db = getDatabase();
  if (!db)
    return (
      seeds.find((post) => post.slug === slug && post.status === "published") ||
      null
    );
  const row = await db
    .prepare("SELECT * FROM blog_posts WHERE slug = ?")
    .bind(slug)
    .first<BlogRow>();
  return row
    ? row.status === "published"
      ? toPost(row)
      : null
    : seeds.find((post) => post.slug === slug && post.status === "published") ||
        null;
});
export async function getEditorPost(id: string) {
  const db = getDatabase();
  if (!db) return null;
  const row = await db
    .prepare("SELECT * FROM blog_posts WHERE id = ?")
    .bind(id)
    .first<BlogRow>();
  return row ? toPost(row) : null;
}
export async function publishedSlugs() {
  const db = getDatabase();
  if (!db)
    return seeds
      .filter((post) => post.status === "published")
      .map((post) => ({ slug: post.slug, updatedAt: post.updatedAt }));
  const { results } = await db
    .prepare(
      "SELECT slug,updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC",
    )
    .all<{ slug: string; updated_at: number }>();
  return [
    ...results.map((post) => ({ slug: post.slug, updatedAt: post.updated_at })),
    ...(await availableSourceArticles(db)).map((post) => ({
      slug: post.slug,
      updatedAt: post.updatedAt,
    })),
  ];
}
