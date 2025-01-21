ALTER TABLE "app_documents" ALTER COLUMN "app_ids" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "app_documents" ADD COLUMN "file_keys" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "workspace_vector_db" text NOT NULL;