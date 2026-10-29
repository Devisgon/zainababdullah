CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"cover_image" text,
	"cover_alt" text,
	"meta_title" text,
	"meta_description" text,
	"author" text NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL,
	"published_at" bigint,
	"edited_by" text NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "website_leads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"brief" jsonb NOT NULL,
	"source_hash" text NOT NULL,
	"created_at" bigint NOT NULL,
	"status" text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "website_leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_status_published_idx" ON "blog_posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "website_leads_source_created" ON "website_leads" USING btree ("source_hash","created_at");