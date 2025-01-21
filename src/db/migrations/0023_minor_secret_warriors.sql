ALTER TABLE "messages" RENAME COLUMN "used_token" TO "total_used_token";--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "completion_token" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "prompt_token" text;