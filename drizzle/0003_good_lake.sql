CREATE TABLE `site_cache_tags` (
	`namespace` text NOT NULL,
	`tag` text NOT NULL,
	`invalidated_at` integer NOT NULL,
	PRIMARY KEY(`namespace`, `tag`)
);
--> statement-breakpoint
CREATE TABLE `site_render_cache` (
	`namespace` text NOT NULL,
	`cache_key` text NOT NULL,
	`payload` text NOT NULL,
	`modified_at` integer NOT NULL,
	`revalidate_seconds` integer,
	`expire_seconds` integer,
	`tags` text NOT NULL,
	`cache_control` text,
	PRIMARY KEY(`namespace`, `cache_key`)
);
