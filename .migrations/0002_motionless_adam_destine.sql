CREATE TABLE `hospital` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`address` text NOT NULL,
	`__security_secret` text
);
