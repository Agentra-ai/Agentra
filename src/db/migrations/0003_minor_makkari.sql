CREATE TABLE IF NOT EXISTS "workspace_users" (
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "workspace_users_user_id_workspace_id_pk" PRIMARY KEY("user_id","workspace_id")
);
--> statement-breakpoint
ALTER TABLE "companies" RENAME TO "workspaces";--> statement-breakpoint
ALTER TABLE "apps" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "billings" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "boards" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "docs_vaults" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "folders" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "live_agents" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "tools" RENAME COLUMN "company_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "surname" TO "workspaceId";--> statement-breakpoint
ALTER TABLE "billings" DROP CONSTRAINT "billings_company_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_companyId_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "logs" ADD COLUMN "workspace_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "monitoring" ADD COLUMN "workspace_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspace_users" ADD CONSTRAINT "workspace_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspace_users" ADD CONSTRAINT "workspace_users_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_workspaceId_workspaces_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "companyId";--> statement-breakpoint
ALTER TABLE "billings" ADD CONSTRAINT "billings_workspace_id_unique" UNIQUE("workspace_id");