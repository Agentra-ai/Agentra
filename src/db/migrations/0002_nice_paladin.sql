CREATE TABLE IF NOT EXISTS "ai_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mode" text DEFAULT 'CHAT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_configs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_input_form" text,
	"opening_statement" text,
	"followup" boolean DEFAULT false,
	"suggested_questions" json DEFAULT '[]'::json,
	"chat_prompt_config" json,
	"completion_prompt_config" json,
	"dataset_query_variable" text NOT NULL,
	"speech_to_text_enabled" boolean DEFAULT false,
	"text_to_speech_enabled" boolean DEFAULT false,
	"text_to_speech_voice" text NOT NULL,
	"text_to_speech_language" text NOT NULL,
	"retriever_resource_enabled" boolean DEFAULT false,
	"sensitive_word_avoidance_enabled" boolean DEFAULT false,
	"annotation_reply" json NOT NULL,
	"agent_mode_enabled" boolean DEFAULT false,
	"model_id" uuid NOT NULL,
	"dataset_configs_id" uuid NOT NULL,
	"file_upload" json NOT NULL,
	"files" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"description" text,
	"icon" text,
	"api_rph" integer,
	"api_rpm" integer,
	"enable_site" boolean,
	"enable_api" boolean,
	"tags" json,
	"name" text,
	"app_mode" text,
	"app_config_id" uuid NOT NULL,
	"customization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"plan" text DEFAULT 'FREE' NOT NULL,
	"quota" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "billings_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"opening_statement" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docs_vaults" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"company_id" uuid NOT NULL,
	"folder_id" uuid NOT NULL,
	"content" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"is_public" boolean DEFAULT false,
	"words" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "folders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"docs_vault_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "live_agents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"configuration" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"app_id" uuid NOT NULL,
	"live_agent_id" uuid NOT NULL,
	"content" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitoring" (
	"id" uuid PRIMARY KEY NOT NULL,
	"app_id" uuid NOT NULL,
	"live_agent_id" uuid NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"settings" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tools" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'ADMIN';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "companyId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
