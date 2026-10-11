CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"exam_date" varchar(20) NOT NULL,
	"session" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"roll_no" varchar(30) NOT NULL,
	"course_code" varchar(20) NOT NULL,
	"department" varchar(100),
	"room_number" varchar(20) NOT NULL,
	"row_no" integer NOT NULL,
	"position" integer NOT NULL,
	"page_number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_files" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"filename" text NOT NULL,
	"file_data" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"room_number" varchar(20),
	"content" text NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"window_start" bigint NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "llm_usage" (
	"day" text PRIMARY KEY NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_files" ADD CONSTRAINT "plan_files_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_roll_no" ON "seats" USING btree ("roll_no");--> statement-breakpoint
CREATE INDEX "idx_plan_room" ON "seats" USING btree ("plan_id","room_number");