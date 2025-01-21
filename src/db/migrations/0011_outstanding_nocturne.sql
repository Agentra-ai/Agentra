ALTER TABLE "documents" RENAME TO "app_documents";--> statement-breakpoint
ALTER TABLE "file" RENAME TO "app_file";--> statement-breakpoint
ALTER TABLE "app_file" DROP CONSTRAINT "file_documents_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "workspaceId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_configs" ADD COLUMN "embed_links" json NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_file" ADD CONSTRAINT "app_file_documents_id_app_documents_id_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."app_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
