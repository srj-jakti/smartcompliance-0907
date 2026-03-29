CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`date` text NOT NULL,
	`check_in` text,
	`check_out` text,
	`status` text DEFAULT 'present',
	`work_hours` real,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`sender_name` text NOT NULL,
	`sender_role` text NOT NULL,
	`receiver_id` text NOT NULL,
	`receiver_name` text NOT NULL,
	`receiver_role` text NOT NULL,
	`content` text NOT NULL,
	`message_type` text DEFAULT 'text',
	`is_read` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text NOT NULL,
	`pan` text,
	`gstin` text,
	`client_type` text DEFAULT 'individual' NOT NULL,
	`address` text,
	`city` text,
	`state` text,
	`pincode` text,
	`assigned_employee_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `compliance_dates` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text,
	`title` text NOT NULL,
	`description` text,
	`due_date` integer NOT NULL,
	`category` text NOT NULL,
	`applicable_to` text,
	`penalty_amount` text,
	`is_active` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `demo_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`firm_name` text,
	`team_size` text,
	`message` text,
	`status` text DEFAULT 'pending',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`client_id` text,
	`task_id` text,
	`name` text NOT NULL,
	`file_url` text,
	`file_type` text,
	`file_size` integer,
	`category` text DEFAULT 'general',
	`uploaded_by` text,
	`uploaded_by_role` text,
	`is_client_visible` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `dsc_records` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`client_id` text NOT NULL,
	`holder_name` text NOT NULL,
	`dsc_class` text NOT NULL,
	`issuer` text,
	`serial_no` text,
	`expiry_date` integer NOT NULL,
	`token_no` text,
	`status` text DEFAULT 'active',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`role` text DEFAULT 'staff' NOT NULL,
	`specialization` text,
	`active_task_count` integer DEFAULT 0,
	`status` text DEFAULT 'active',
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_email_unique` ON `employees` (`email`);--> statement-breakpoint
CREATE TABLE `firms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owner_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`gstin` text,
	`address` text,
	`city` text,
	`ai_auto_assign` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `firms_email_unique` ON `firms` (`email`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`invoice_no` text NOT NULL,
	`client_id` text NOT NULL,
	`task_id` text,
	`amount` real NOT NULL,
	`gst_amount` real DEFAULT 0,
	`total_amount` real NOT NULL,
	`status` text DEFAULT 'unpaid' NOT NULL,
	`due_date` integer,
	`paid_at` integer,
	`description` text,
	`billing_entity` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`user_id` text NOT NULL,
	`user_role` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'info',
	`is_read` integer DEFAULT false,
	`link` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`client_id` text,
	`assigned_employee_id` text,
	`category` text DEFAULT 'general' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`due_date` integer,
	`completed_at` integer,
	`recurring` text DEFAULT 'none',
	`billing_amount` real,
	`notes` text,
	`auto_assigned` integer DEFAULT false,
	`created_at` integer
);
