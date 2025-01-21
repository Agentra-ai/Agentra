CREATE TABLE IF NOT EXISTS "vectors_db_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"file_id" uuid NOT NULL,
	"vector_id" uuid NOT NULL,
	"charecter_length" integer,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vectors_db_data" ADD CONSTRAINT "vectors_db_data_file_id_app_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."app_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
