ALTER TABLE "plan" RENAME TO "pricing_plans";--> statement-breakpoint
ALTER TABLE "pricing_plans" DROP CONSTRAINT "plan_variantId_unique";--> statement-breakpoint
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_planId_plan_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_pricing_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."pricing_plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pricing_plans" ADD CONSTRAINT "pricing_plans_variantId_unique" UNIQUE("variantId");