import { pgTable, text, uuid, jsonb, bigint, index } from "drizzle-orm/pg-core";
export const websiteLeads = pgTable(
  "website_leads",
  {
    id: uuid("id").primaryKey(),
    brief: jsonb("brief").notNull(),
    sourceHash: text("source_hash").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    status: text("status").notNull().default("new"),
  },
  (t) => [index("website_leads_source_created").on(t.sourceHash, t.createdAt)],
).enableRLS();
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(),
    status: text("status").notNull().default("draft"),
    coverImage: text("cover_image"),
    coverAlt: text("cover_alt"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    author: text("author").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    publishedAt: bigint("published_at", { mode: "number" }),
    editedBy: text("edited_by").notNull(),
  },
  (t) => [index("blog_status_published_idx").on(t.status, t.publishedAt)],
).enableRLS();
