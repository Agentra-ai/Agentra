CREATE TABLE IF NOT EXISTS "app_documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workspace_id" uuid,
	"user_id" uuid,
	"is_docshub" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text,
	"app_ids" json DEFAULT '[]'::json,
	"file_keys" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspace_id" uuid,
	"documents_id" uuid NOT NULL,
	"is_docshub" boolean DEFAULT false NOT NULL,
	"file_key" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"embedding_modal" text DEFAULT 'text-embedding-3-large' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"chunk_size" integer DEFAULT 0 NOT NULL,
	"chunk_overlap" integer DEFAULT 0 NOT NULL,
	"words" integer DEFAULT 0 NOT NULL,
	"file_size" text DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vectors_db_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"file_id" uuid NOT NULL,
	"vector_id" uuid NOT NULL,
	"charecter_length" integer,
	"content" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mode" text DEFAULT 'CHAT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_configs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"instructions" text,
	"opening_statement" text,
	"follow_up" boolean DEFAULT false NOT NULL,
	"suggested_questions" json DEFAULT '[]'::json,
	"speech_to_text_enabled" boolean DEFAULT false,
	"text_to_speech_enabled" boolean DEFAULT false,
	"text_to_speech_voice" text NOT NULL,
	"text_to_speech_language" text NOT NULL,
	"sensitive_word_avoidance_enabled" boolean DEFAULT false,
	"context_file_keys" text,
	"embed_links" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"app_id" uuid NOT NULL,
	"suggested_questions_enabled" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_customizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"bot_logo" text,
	"bot_name" text NOT NULL,
	"bg_color" text NOT NULL,
	"ai_chat_color" text NOT NULL,
	"user_chat_color" text NOT NULL,
	"bot_text_color" text NOT NULL,
	"user_text_color" text NOT NULL,
	"bot_font_size" integer NOT NULL,
	"bot_font_weight" integer NOT NULL,
	"bot_font_family" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"app_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"description" text,
	"icon" text,
	"api_rph" integer,
	"api_rpm" integer,
	"enable_site" boolean,
	"enable_api" boolean,
	"tags" json,
	"name" text,
	"app_mode" text,
	"app_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text,
	"type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"app_id" uuid NOT NULL,
	"file_keys" text,
	"name" text,
	"ai_modal" text DEFAULT 'gpt-4o-mini',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"app_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"live_agent_id" uuid NOT NULL,
	"content" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"conversation_id" uuid,
	"role" text DEFAULT 'user' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"total_used_token" text,
	"completion_token" text,
	"prompt_token" text,
	"timestamp" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitoring" (
	"id" uuid PRIMARY KEY NOT NULL,
	"app_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"live_agent_id" uuid NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"settings" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletterSubscriber" (
	"email" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"productName" text,
	"variantId" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" text NOT NULL,
	"isUsageBased" boolean DEFAULT false,
	"interval" text,
	"intervalCount" integer,
	"trialInterval" text,
	"trialIntervalCount" integer,
	"sort" integer,
	CONSTRAINT "pricing_plans_variantId_unique" UNIQUE("variantId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"lemonSqueezyId" text NOT NULL,
	"orderId" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"status" text NOT NULL,
	"statusFormatted" text NOT NULL,
	"renewsAt" text,
	"endsAt" text,
	"trialEndsAt" text,
	"price" text NOT NULL,
	"isUsageBased" boolean DEFAULT false,
	"isPaused" boolean DEFAULT false,
	"subscriptionItemId" serial NOT NULL,
	"userId" text NOT NULL,
	"planId" integer NOT NULL,
	CONSTRAINT "subscription_lemonSqueezyId_unique" UNIQUE("lemonSqueezyId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tools" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'ADMIN' NOT NULL,
	"name" text,
	"username" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"workspaceId" text,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_emailVerificationToken_unique" UNIQUE("emailVerificationToken"),
	CONSTRAINT "user_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhookEvent" (
	"id" integer PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"eventName" text NOT NULL,
	"processed" boolean DEFAULT false,
	"body" jsonb NOT NULL,
	"processingError" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_users" (
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "workspace_users_user_id_workspace_id_pk" PRIMARY KEY("user_id","workspace_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspace_vector_db" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_file" ADD CONSTRAINT "app_file_documents_id_app_documents_id_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."app_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vectors_db_data" ADD CONSTRAINT "vectors_db_data_file_id_app_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."app_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logs" ADD CONSTRAINT "logs_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitoring" ADD CONSTRAINT "monitoring_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_pricing_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."pricing_plans"("id") ON DELETE no action ON UPDATE no action;
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
