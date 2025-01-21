ALTER TABLE "conversations" ADD COLUMN "ai_modal" text DEFAULT 'gpt-4o-mini';--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "used_token" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "timestamp" timestamp DEFAULT now();