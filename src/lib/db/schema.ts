import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    services: text("services").notNull(),
    goal: text("goal").notNull(),
    budget: text("budget").notNull(),
    timeline: text("timeline").notNull(),
    business: text("business").notNull(),
    website: text("website").notNull(),
    country: text("country").notNull(),
    context: text("context").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    whatsapp: text("whatsapp"),
    consent: integer("consent", { mode: "boolean" }).notNull(),
    consentVersion: text("consent_version").notNull(),
    sourceHash: text("source_hash").notNull(),
    createdAt: integer("created_at").notNull(),
    status: text("status").notNull().default("new"),
  },
  (table) => [
    index("leads_source_created_idx").on(table.sourceHash, table.createdAt),
    index("leads_created_idx").on(table.createdAt),
  ],
);
export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id").primaryKey(),
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
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    publishedAt: integer("published_at"),
    editedBy: text("edited_by").notNull(),
  },
  (table) => [
    index("blog_status_published_idx").on(table.status, table.publishedAt),
  ],
);

// Public rendered pages and invalidation tags. Private editor data and leads are never cached here.
export const siteRenderCache = sqliteTable(
  "site_render_cache",
  {
    namespace: text("namespace").notNull(),
    cacheKey: text("cache_key").notNull(),
    payload: text("payload").notNull(),
    modifiedAt: integer("modified_at").notNull(),
    revalidateSeconds: integer("revalidate_seconds"),
    expireSeconds: integer("expire_seconds"),
    tags: text("tags").notNull(),
    cacheControl: text("cache_control"),
  },
  (table) => [primaryKey({ columns: [table.namespace, table.cacheKey] })],
);
export const siteCacheTags = sqliteTable(
  "site_cache_tags",
  {
    namespace: text("namespace").notNull(),
    tag: text("tag").notNull(),
    invalidatedAt: integer("invalidated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.namespace, table.tag] })],
);
