CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(40) NOT NULL,
	`entityId` int NOT NULL,
	`action` varchar(40) NOT NULL,
	`actorId` int NOT NULL,
	`signatureData` text,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspectionId` int NOT NULL,
	`equipmentId` int NOT NULL,
	`criterion` varchar(80) NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','in_progress','resolved') NOT NULL DEFAULT 'open',
	`responsibleId` int,
	`dueDate` timestamp,
	`resolution` text,
	`photoKey` varchar(255),
	`photoUrl` text,
	`createdBy` int NOT NULL,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminder_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`dayOfMonth` int NOT NULL DEFAULT 1,
	`hourUtc` int NOT NULL DEFAULT 8,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reminder_settings_id` PRIMARY KEY(`id`)
);
