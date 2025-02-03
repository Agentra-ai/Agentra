import { pgTable, unique, text, boolean, foreignKey, timestamp, uuid, json, integer, serial, jsonb, primaryKey } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	email: text("email").notNull(),
	username: text("username").notNull(),
	hashed_password: text("hashed_password"),
	email_verified: boolean("email_verified").default(false).notNull(),
	two_factor_secret: text("two_factor_secret"),
},
(table) => {
	return {
		user_email_unique: unique("user_email_unique").on(table.email),
	}
});

export const session = pgTable("session", {
	id: text("id").notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const email_verification_code = pgTable("email_verification_code", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	code: text("code").notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	email: text("email").notNull(),
	expires_at: timestamp("expires_at", { mode: 'string' }).notNull(),
});

export const password_reset_token = pgTable("password_reset_token", {
	id: text("id").primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	expires_at: timestamp("expires_at", { mode: 'string' }).notNull(),
});

export const app_documents = pgTable("app_documents", {
	id: uuid("id").primaryKey().notNull(),
	workspace_id: uuid("workspace_id"),
	user_id: uuid("user_id"),
	is_docshub: boolean("is_docshub").default(false).notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	icon: text("icon"),
	app_ids: json("app_ids").default([]),
	file_keys: text("file_keys"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const apps = pgTable("apps", {
	id: uuid("id").primaryKey().notNull(),
	workspace_id: uuid("workspace_id").notNull(),
	user_id: text("user_id").notNull(),
	description: text("description"),
	icon: text("icon"),
	api_rph: integer("api_rph"),
	api_rpm: integer("api_rpm"),
	enable_site: boolean("enable_site"),
	enable_api: boolean("enable_api"),
	tags: json("tags"),
	name: text("name"),
	app_mode: text("app_mode"),
	app_type: text("app_type"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const ai_models = pgTable("ai_models", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	mode: text("mode").default('CHAT').notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const app_customizations = pgTable("app_customizations", {
	id: uuid("id").primaryKey().notNull(),
	bot_logo: text("bot_logo"),
	bot_name: text("bot_name").notNull(),
	bg_color: text("bg_color").notNull(),
	ai_chat_color: text("ai_chat_color").notNull(),
	user_chat_color: text("user_chat_color").notNull(),
	bot_text_color: text("bot_text_color").notNull(),
	user_text_color: text("user_text_color").notNull(),
	bot_font_size: integer("bot_font_size").notNull(),
	bot_font_weight: integer("bot_font_weight").notNull(),
	bot_font_family: text("bot_font_family").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	app_id: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" } ),
});

export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().notNull(),
	user_id: uuid("user_id"),
	app_id: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" } ),
	file_keys: text("file_keys"),
	name: text("name"),
	ai_modal: text("ai_modal").default('gpt-4o-mini'),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const boards = pgTable("boards", {
	id: uuid("id").primaryKey().notNull(),
	user_id: uuid("user_id").notNull(),
	workspace_id: uuid("workspace_id").notNull(),
	name: text("name"),
	type: text("type"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const app_file = pgTable("app_file", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	workspace_id: uuid("workspace_id"),
	documents_id: uuid("documents_id").notNull().references(() => app_documents.id, { onDelete: "cascade" } ),
	is_docshub: boolean("is_docshub").default(false).notNull(),
	file_key: text("file_key").notNull(),
	is_active: boolean("is_active").default(true).notNull(),
	embedding_modal: text("embedding_modal").default('text-embedding-3-large').notNull(),
	status: text("status").default('ACTIVE').notNull(),
	chunk_size: integer("chunk_size").default(0).notNull(),
	chunk_overlap: integer("chunk_overlap").default(0).notNull(),
	words: integer("words").default(0).notNull(),
	file_size: text("file_size").default("0").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const vectors_db_data = pgTable("vectors_db_data", {
	id: uuid("id").primaryKey().notNull(),
	file_id: uuid("file_id").notNull().references(() => app_file.id, { onDelete: "cascade" } ),
	vector_id: uuid("vector_id").notNull(),
	charecter_length: integer("charecter_length"),
	content: text("content").default('').notNull(),
	is_active: boolean("is_active").default(true).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const monitoring = pgTable("monitoring", {
	id: uuid("id").primaryKey().notNull(),
	app_id: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" } ),
	workspace_id: uuid("workspace_id").notNull(),
	live_agent_id: uuid("live_agent_id").notNull(),
	is_enabled: boolean("is_enabled").default(true).notNull(),
	settings: json("settings"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const subscription = pgTable("subscription", {
	id: serial("id").primaryKey().notNull(),
	lemonSqueezyId: text("lemonSqueezyId").notNull(),
	orderId: integer("orderId").notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	status: text("status").notNull(),
	statusFormatted: text("statusFormatted").notNull(),
	renewsAt: text("renewsAt"),
	endsAt: text("endsAt"),
	trialEndsAt: text("trialEndsAt"),
	price: text("price").notNull(),
	isUsageBased: boolean("isUsageBased").default(false),
	isPaused: boolean("isPaused").default(false),
	subscriptionItemId: serial("subscriptionItemId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	planId: integer("planId").notNull().references(() => pricing_plans.id),
},
(table) => {
	return {
		subscription_lemonSqueezyId_unique: unique("subscription_lemonSqueezyId_unique").on(table.lemonSqueezyId),
	}
});

export const pricing_plans = pgTable("pricing_plans", {
	id: serial("id").primaryKey().notNull(),
	productId: integer("productId").notNull(),
	productName: text("productName"),
	variantId: integer("variantId").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	price: text("price").notNull(),
	isUsageBased: boolean("isUsageBased").default(false),
	interval: text("interval"),
	intervalCount: integer("intervalCount"),
	trialInterval: text("trialInterval"),
	trialIntervalCount: integer("trialIntervalCount"),
	sort: integer("sort"),
},
(table) => {
	return {
		pricing_plans_variantId_unique: unique("pricing_plans_variantId_unique").on(table.variantId),
	}
});

export const tools = pgTable("tools", {
	id: uuid("id").primaryKey().notNull(),
	user_id: uuid("user_id").notNull(),
	workspace_id: uuid("workspace_id").notNull(),
	name: text("name"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const logs = pgTable("logs", {
	id: uuid("id").primaryKey().notNull(),
	app_id: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" } ),
	workspace_id: uuid("workspace_id").notNull(),
	live_agent_id: uuid("live_agent_id").notNull(),
	content: text("content"),
	timestamp: timestamp("timestamp", { mode: 'string' }).defaultNow().notNull(),
});

export const messages = pgTable("messages", {
	id: uuid("id").primaryKey().notNull(),
	conversation_id: uuid("conversation_id").references(() => conversations.id, { onDelete: "cascade" } ),
	role: text("role").default('user').notNull(),
	content: text("content").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	message_type: text("message_type").default('text').notNull(),
	total_used_token: text("total_used_token"),
	completion_token: text("completion_token"),
	prompt_token: text("prompt_token"),
	timestamp: text("timestamp"),
});

export const webhookEvent = pgTable("webhookEvent", {
	id: integer("id").primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	eventName: text("eventName").notNull(),
	processed: boolean("processed").default(false),
	body: jsonb("body").notNull(),
	processingError: text("processingError"),
});

export const app_configs = pgTable("app_configs", {
	id: uuid("id").primaryKey().notNull(),
	instructions: text("instructions"),
	opening_statement: text("opening_statement"),
	follow_up: boolean("follow_up").default(false).notNull(),
	suggested_questions: json("suggested_questions").default([]),
	speech_to_text_enabled: boolean("speech_to_text_enabled").default(false),
	text_to_speech_enabled: boolean("text_to_speech_enabled").default(false),
	text_to_speech_voice: text("text_to_speech_voice").notNull(),
	text_to_speech_language: text("text_to_speech_language").notNull(),
	sensitive_word_avoidance_enabled: boolean("sensitive_word_avoidance_enabled").default(false),
	context_file_keys: text("context_file_keys"),
	embed_links: text("embed_links").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	app_id: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" } ),
	suggested_questions_enabled: boolean("suggested_questions_enabled").default(false),
});

export const workspaces = pgTable("workspaces", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	workspace_vector_db: text("workspace_vector_db").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const oauth_account = pgTable("oauth_account", {
	provider_id: text("provider_id").notNull(),
	provider_user_id: text("provider_user_id").notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
},
(table) => {
	return {
		oauth_account_provider_id_provider_user_id_pk: primaryKey({ columns: [table.provider_id, table.provider_user_id], name: "oauth_account_provider_id_provider_user_id_pk"}),
	}
});

export const workspace_users = pgTable("workspace_users", {
	user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	workspace_id: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
	role: text("role").notNull(),
},
(table) => {
	return {
		workspace_users_user_id_workspace_id_pk: primaryKey({ columns: [table.user_id, table.workspace_id], name: "workspace_users_user_id_workspace_id_pk"}),
	}
});