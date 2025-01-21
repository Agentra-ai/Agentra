ALTER TABLE "app_configs" RENAME COLUMN "user_input_form" TO "instructions";--> statement-breakpoint
ALTER TABLE "app_configs" RENAME COLUMN "followup" TO "follow_up";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "sender" TO "sender_role";--> statement-breakpoint
ALTER TABLE "app_documents" ALTER COLUMN "file_keys" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "app_configs" ALTER COLUMN "embed_links" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "file_keys" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "file_keys" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "file_keys" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app_configs" ADD COLUMN "context_file_keys" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "app_configs" ADD COLUMN "suggested_questions_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "chat_prompt_config";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "completion_prompt_config";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "dataset_query_variable";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "retriever_resource_enabled";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "annotation_reply";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "agent_mode_enabled";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "model_id";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "dataset_configs_id";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "file_upload";--> statement-breakpoint
ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "files";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN IF EXISTS "session_id";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN IF EXISTS "docs_url";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN IF EXISTS "start_time";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN IF EXISTS "end_time";