ALTER TABLE "customizations" RENAME TO "app_customizations";--> statement-breakpoint
ALTER TABLE "apps" DROP CONSTRAINT "apps_app_config_id_app_configs_id_fk";
--> statement-breakpoint
ALTER TABLE "apps" DROP CONSTRAINT "apps_customization_id_customizations_id_fk";
--> statement-breakpoint
ALTER TABLE "app_configs" ADD COLUMN "app_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "app_customizations" ADD COLUMN "app_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_configs" ADD CONSTRAINT "app_configs_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_customizations" ADD CONSTRAINT "app_customizations_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN IF EXISTS "app_config_id";--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN IF EXISTS "customization_id";