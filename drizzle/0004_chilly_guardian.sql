CREATE TABLE `criteria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`lastActionBy` int,
	`lastActionSignature` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `criteria_id` PRIMARY KEY(`id`),
	CONSTRAINT `criteria_name_unique` UNIQUE(`name`)
);
