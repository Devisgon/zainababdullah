CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`cover_image` text,
	`cover_alt` text,
	`meta_title` text,
	`meta_description` text,
	`author` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`published_at` integer,
	`edited_by` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_status_published_idx` ON `blog_posts` (`status`,`published_at`);