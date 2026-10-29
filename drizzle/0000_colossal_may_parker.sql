CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`services` text NOT NULL,
	`goal` text NOT NULL,
	`budget` text NOT NULL,
	`timeline` text NOT NULL,
	`business` text NOT NULL,
	`website` text NOT NULL,
	`country` text NOT NULL,
	`context` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`consent` integer NOT NULL,
	`consent_version` text NOT NULL,
	`source_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_source_created_idx` ON `leads` (`source_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);