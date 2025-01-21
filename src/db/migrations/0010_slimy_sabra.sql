CREATE TABLE IF NOT EXISTS "file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"documents_id" uuid NOT NULL,
	"file_key" text NOT NULL,
	"embedding_modal" text DEFAULT 'text-embedding-3-large' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"words" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "docs_vaults";--> statement-breakpoint
DROP TABLE "folders";--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "app_ids" json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file" ADD CONSTRAINT "file_documents_id_documents_id_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "folder_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "content";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "is_public";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "words";