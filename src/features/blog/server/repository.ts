import { cache } from "react";
import { and, eq, ilike, or, inArray, desc, sql } from "drizzle-orm";
import seedPosts from "@/content/blog.json";
import { getDb } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import type { BlogPost, BlogSummary } from "../schema";
const seeds = seedPosts as BlogPost[];
const asPost = (row: typeof blogPosts.$inferSelect) => ({
  ...row,
  category: row.category as BlogPost["category"],
  status: row.status as BlogPost["status"],
  coverImage: row.coverImage || "",
  coverAlt: row.coverAlt || "",
  metaTitle: row.metaTitle || "",
  metaDescription: row.metaDescription || "",
});
async function sourceArticles() {
  const source = seeds.filter((p) => p.status === "published");
  const db = getDb();
  if (!db || !source.length) return source;
  const overrides = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(
      inArray(
        blogPosts.slug,
        source.map((p) => p.slug),
      ),
    );
  return source.filter((p) => !overrides.some((row) => row.slug === p.slug));
}
export type BlogQuery = {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
  editor?: boolean;
};
export async function listBlogPosts({
  query = "",
  category = "",
  page = 1,
  limit = 9,
  editor = false,
}: BlogQuery = {}) {
  const db = getDb();
  const source = editor
    ? []
    : (await sourceArticles()).filter(
        (p) =>
          (!category || p.category === category) &&
          (!query ||
            `${p.title} ${p.excerpt}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      );
  const where = and(
    editor ? undefined : eq(blogPosts.status, "published"),
    category ? eq(blogPosts.category, category) : undefined,
    query
      ? or(
          ilike(blogPosts.title, `%${query}%`),
          ilike(blogPosts.excerpt, `%${query}%`),
        )
      : undefined,
  );
  const total = db
    ? (
        await db
          .select({ total: sql<number>`count(*)::int` })
          .from(blogPosts)
          .where(where)
      )[0].total
    : 0;
  const rows = db
    ? await db
        .select()
        .from(blogPosts)
        .where(where)
        .orderBy(
          desc(editor ? blogPosts.updatedAt : blogPosts.publishedAt),
          blogPosts.slug,
        )
        .limit(source.length ? page * limit : limit)
        .offset(source.length ? 0 : (page - 1) * limit)
    : [];
  const sorted = [...rows.map(asPost), ...source].sort(
    (a, b) =>
      (editor
        ? b.updatedAt - a.updatedAt
        : (b.publishedAt || 0) - (a.publishedAt || 0)) ||
      a.slug.localeCompare(b.slug),
  );
  const posts = (
    source.length ? sorted.slice((page - 1) * limit, page * limit) : sorted
  ).map(({ content: _, ...summary }) => summary as BlogSummary);
  return { posts, total: total + source.length };
}
export const getPublishedPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const db = getDb();
    const row = db
      ? (
          await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.slug, slug))
            .limit(1)
        )[0]
      : null;
    return row
      ? row.status === "published"
        ? asPost(row)
        : null
      : seeds.find((p) => p.slug === slug && p.status === "published") || null;
  },
);
export async function getEditorPost(id: string) {
  const db = getDb();
  if (!db) return null;
  const row = (
    await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
  )[0];
  return row ? asPost(row) : null;
}
export async function publishedSlugs() {
  const db = getDb();
  const rows = db
    ? await db
        .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
    : [];
  return [
    ...rows,
    ...(await sourceArticles()).map((p) => ({
      slug: p.slug,
      updatedAt: p.updatedAt,
    })),
  ];
}
