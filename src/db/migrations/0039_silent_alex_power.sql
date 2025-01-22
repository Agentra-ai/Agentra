CREATE TABLE IF NOT EXISTS "credential" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_user_id_name" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "execution_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_level" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"execution_phase_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "execution_phase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"status" text NOT NULL,
	"number" integer NOT NULL,
	"node" text NOT NULL,
	"name" text NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"inputs" text,
	"outputs" text,
	"credits_consumed" integer,
	"workflow_execution_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"definition" text NOT NULL,
	"execution_plan" text,
	"credits_cost" integer DEFAULT 0,
	"cron" text,
	"status" text NOT NULL,
	"last_run_at" timestamp,
	"last_run_id" text,
	"last_run_status" text,
	"next_run_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_name_workspace_id" UNIQUE("name","workspace_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflow_execution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"trigger" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	"definition" text DEFAULT '{}',
	"credits_consumed" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_balance" (
	"workspace_id" uuid PRIMARY KEY NOT NULL,
	"credits" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "execution_log" ADD CONSTRAINT "execution_log_execution_phase_id_execution_phase_id_fk" FOREIGN KEY ("execution_phase_id") REFERENCES "public"."execution_phase"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "execution_phase" ADD CONSTRAINT "execution_phase_workflow_execution_id_workflow_execution_id_fk" FOREIGN KEY ("workflow_execution_id") REFERENCES "public"."workflow_execution"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_execution_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
