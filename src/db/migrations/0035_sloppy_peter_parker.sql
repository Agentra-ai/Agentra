ALTER TABLE "app_documents" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN IF EXISTS "icon_link";