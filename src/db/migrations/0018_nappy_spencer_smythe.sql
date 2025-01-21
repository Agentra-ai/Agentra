ALTER TABLE "messages" RENAME COLUMN "sender_role" TO "role";--> statement-breakpoint
ALTER TABLE "app_documents" ALTER COLUMN "file_keys" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app_configs" ALTER COLUMN "context_file_keys" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app_configs" ALTER COLUMN "context_file_keys" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "file_keys" SET DATA TYPE text;