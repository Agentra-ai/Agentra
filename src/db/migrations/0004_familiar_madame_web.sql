ALTER TABLE "customizations" RENAME COLUMN "opening_statement" TO "bot_name";--> statement-breakpoint
ALTER TABLE "customizations" ALTER COLUMN "bot_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bot_logo" text;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bg_color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "ai_chat_color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "user_chat_color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bot_text_color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bot_font_size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bot_font_weight" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "bot_font_family" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "customizations" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;