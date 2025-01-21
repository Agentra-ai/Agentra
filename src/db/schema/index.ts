import type { AdapterAccount } from "@auth/core/adapters"
import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js"
import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  json,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

// export const userRoleEnum = pgEnum("user_role", ["MEMBER", "ADMIN"])

// Enum definitions
export enum ModelMode {
  CHAT = "CHAT",
  COMPLETION = "COMPLETION",
  UNSET = "UNSET",
}

export enum AppMode {
  ADVANCE_CHAT = "ADVANCE_CHAT",
  AGENT_CHAT = "AGENT_CHAT",
  CHAT = "CHAT",
  COMPLETION = "COMPLETION",
  FLOW = "FLOW",
}

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  OWNER = "OWNER",
  USER = "USER",
}

export enum DocumentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum SubscriptionPlan {
  FREE = "FREE",
  SANDBOX = "SANDBOX",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

export enum BillingStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum BoardEnum {
  AGENT_BOARD = "AGENT_BOARD",
  CALENDAR = "CALENDAR",
  KANBAN = "KANBAN",
  TEAM_BOARD = "TEAM_BOARD",
}

export enum AiModalsEnum {
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4 = "gpt-4",
  GPT_3_5_TURBO = "gpt-3.5-turbo",
}

export enum MessageTypeEnum {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  FILE = "file",
}

export enum MessageSender {
  USER = "user",
  SYSTEM = "system",
}

export enum EmbeddingModal {
  TEXT_EMBEDDING_3_LARGE = "text-embedding-3-large",
  TEXT_EMBEDDING_3_SMALL = "text-embedding-3-small",
  TEXT_EMBEDDING_ADA_002 = "text-embedding-ada-002",
}

// Adjust the 'userId' and 'id' column types to 'text' to match the database and avoid data loss
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// In the 'users' table, change the 'role' column to use 'text' type instead of the enum
export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  role: text("role").notNull().default("ADMIN"),
  fullname: text("name"),
  username: text("username").unique(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: text("emailVerificationToken").unique(),
  passwordHash: text("passwordHash"),
  resetPasswordToken: text("resetPasswordToken").unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", {
    mode: "date",
  }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  workspaceId: text("workspaceId").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  session: many(sessions),
}))

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const newsletterSubscribers = pgTable("newsletterSubscriber", {
  email: text("email").notNull().primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// Workspace Table
const workspaces = pgTable("workspaces", {
  id: text("id").notNull().primaryKey().notNull(),
  name: text("name").notNull(),
  workspaceVectorDB: text("workspace_vector_db").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// WorkspaceUsers Join Table
const workspaceUsers = pgTable(
  "workspace_users",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.workspaceId] }),
  })
)

// AIModel Table
const aiModels = pgTable("ai_models", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  mode: text("mode").default(ModelMode.CHAT).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Customization Table
const appCustomizations = pgTable("app_customizations", {
  id: uuid("id").notNull().primaryKey(),
  botLogo: text("bot_logo"),
  botName: text("bot_name").notNull(),
  bgColor: text("bg_color").notNull(),
  aiChatColor: text("ai_chat_color").notNull(),
  userChatColor: text("user_chat_color").notNull(),
  botTextColor: text("bot_text_color").notNull(),
  userTextColor: text("user_text_color").notNull(),
  botFontSize: integer("bot_font_size").notNull(),
  botFontWeight: integer("bot_font_weight").notNull(),
  botFontFamily: text("bot_font_family").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  appId: uuid("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
})

// AppConfig Table
const appConfigs = pgTable("app_configs", {
  id: uuid("id").notNull().primaryKey(),
  instructions: text("instructions"),
  openingStatement: text("opening_statement"),
  followUp: boolean("follow_up").notNull().default(false),
  suggestedQuestions: json("suggested_questions").default([]),
  speechToTextEnabled: boolean("speech_to_text_enabled").default(false),
  textToSpeechEnabled: boolean("text_to_speech_enabled").default(false),
  textToSpeechVoice: text("text_to_speech_voice").notNull(),
  textToSpeechLanguage: text("text_to_speech_language").notNull(),
  sensitiveWordAvoidanceEnabled: boolean(
    "sensitive_word_avoidance_enabled"
  ).default(false),
  //be aware that we are saving the context file as {fileKey: string, isActive: boolean}[] but it was giving me error so we just save it manually using stringified json
  contextFileKeys: text("context_file_keys"),
  embedLink: text("embed_links").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  appId: uuid("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
  suggestedQuestionsEnabled: boolean("suggested_questions_enabled").default(
    false
  ),
  // datasetConfigId: uuid("dataset_configs_id").notNull(), // Foreign key to DatasetConfigs
  // annotationReply: json("annotation_reply").notNull(),
  // agentModeEnabled: boolean("agent_mode_enabled").default(false),
  // fileUpload: json("file_upload").notNull(),
  // retrieverResourceEnabled: boolean("retriever_resource_enabled").default(
  //   false
  // ),
  // chatPromptConfig: json("chat_prompt_config"),
  // completionPromptConfig: json("completion_prompt_config"),
  // datasetQueryVariable: text("dataset_query_variable").notNull(),
})

// App Table
const apps = pgTable("apps", {
  id: uuid("id").notNull().primaryKey(),
  workspaceId: uuid("workspace_id").notNull(),
  userId: text("user_id").notNull(),
  description: text("description"),
  icon: text("icon"),
  apiRph: integer("api_rph"),
  apiRpm: integer("api_rpm"),
  enableSite: boolean("enable_site"),
  enableApi: boolean("enable_api"),
  tags: json("tags"),
  name: text("name"),
  appMode: text("app_mode"),
  appType: text("app_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Update 'conversations' table
const conversations = pgTable("conversations", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id"), // Nullable for anonymous users
  appId: uuid("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }),
  fileKeys: text("file_keys"),
  name: text("name"),
  modal: text("ai_modal").default(AiModalsEnum.GPT_4O_MINI),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),  
})

const messages = pgTable("messages", {
  id: uuid("id").notNull().primaryKey(),
  conversationId: uuid("conversation_id").references(() => conversations.id, {
    onDelete: "cascade",
  }),
  role: text("role").default(MessageSender.USER).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  messageType: text("message_type").default(MessageTypeEnum.TEXT).notNull(),
  totalUsedToken: text("total_used_token"),
  completionToken: text("completion_token"),
  promptToken: text("prompt_token"),
  timestamp: text("timestamp"),
})

// Update 'AppDocuments' table
const AppDocuments = pgTable("app_documents", {
  id: uuid("id").notNull().primaryKey(),
  workspaceId: uuid("workspace_id"),
  userId: uuid("user_id"),
  isDocshub: boolean("is_docshub").default(false).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  appIds: json("app_ids").default([]).$type<string[]>(),
  fileKeys: text("file_keys"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Files Table
const Appfile = pgTable("app_file", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  workspaceId: uuid("workspace_id"),
  documentsId: uuid("documents_id")
    .notNull()
    .references(() => AppDocuments.id, { onDelete: "cascade" }),
  isDocshub: boolean("is_docshub").default(false).notNull(),
  fileKey: text("file_key").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  embeddingModal: text("embedding_modal")
    .default(EmbeddingModal.TEXT_EMBEDDING_3_LARGE)
    .notNull(),
  status: text("status").default(DocumentStatus.ACTIVE).notNull(),
  chunkSize: integer("chunk_size").default(0).notNull(),
  chunkOverlap: integer("chunk_overlap").default(0).notNull(),
  words: integer("words").default(0).notNull(),
  fileSize: text("file_size").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

const VectorsDBData = pgTable("vectors_db_data", {
  id: uuid("id").notNull().primaryKey(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => Appfile.id, { onDelete: "cascade" }),
  vectorId: uuid("vector_id").notNull(),
  charecterLength: integer("charecter_length"),
  content: text("content").notNull().default(""),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Tool Table
const tools = pgTable("tools", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Board Table
const boards = pgTable("boards", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
  name: text("name"),
  type: text("type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Log Table
const logs = pgTable("logs", {
  id: uuid("id").notNull().primaryKey(),
  appId: uuid("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }), // Foreign key to App
  workspaceId: uuid("workspace_id").notNull(),
  liveAgentId: uuid("live_agent_id").notNull(), // Optional foreign key to LiveAgent
  content: text("content"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
})

// Monitoring Table
const monitoring = pgTable("monitoring", {
  id: uuid("id").notNull().primaryKey(),
  appId: uuid("app_id")
    .notNull()
    .references(() => apps.id, { onDelete: "cascade" }), // Foreign key to App
  workspaceId: uuid("workspace_id").notNull(),
  liveAgentId: uuid("live_agent_id").notNull(), // Optional foreign key to LiveAgent
  isEnabled: boolean("is_enabled").default(true).notNull(),
  settings: json("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// LiveAgent Table
// const liveAgents = pgTable("live_agents", {
//   id: uuid("id").notNull().primaryKey(),
//   userId: uuid("user_id").notNull(),
//   workspaceId: uuid("workspace_id").notNull(),
//   name: text("name"),
//   configuration: json("configuration"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

const webhookEvents = pgTable("webhookEvent", {
  id: integer("id").primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  eventName: text("eventName").notNull(),
  processed: boolean("processed").default(false),
  body: jsonb("body").notNull(),
  processingError: text("processingError"),
})

const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  productName: text("productName"),
  variantId: integer("variantId").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  isUsageBased: boolean("isUsageBased").default(false),
  interval: text("interval"),
  intervalCount: integer("intervalCount"),
  trialInterval: text("trialInterval"),
  trialIntervalCount: integer("trialIntervalCount"),
  sort: integer("sort"),
})

const subscriptions = pgTable("subscription", {
  id: serial("id").primaryKey(),
  lemonSqueezyId: text("lemonSqueezyId").unique().notNull(),
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
  subscriptionItemId: serial("subscriptionItemId"),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  planId: integer("planId")
    .notNull()
    .references(() => pricingPlans.id),
})

export type SubscriptionStatusType =
  Subscription["data"]["attributes"]["status"]

export {
  monitoring,
  workspaces,
  workspaceUsers,
  aiModels,
  appCustomizations,
  appConfigs,
  apps,
  conversations,
  messages,
  AppDocuments,
  Appfile,
  VectorsDBData,
  tools,
  boards,
  logs,
  pricingPlans,
  subscriptions,
  webhookEvents,
}

//Auth tables
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert

//DamaAI tables
export type Workspace = typeof workspaces.$inferSelect
export type WorkspaceUser = typeof workspaceUsers.$inferSelect
export type AIModelType = typeof aiModels.$inferSelect
export type AppCustomization = typeof appCustomizations.$inferSelect
export type AppConfig = typeof appConfigs.$inferSelect
export type App = typeof apps.$inferSelect
export type ConversationType = typeof conversations.$inferSelect
export type MessagesType = typeof messages.$inferSelect
export type AppFileType = typeof Appfile.$inferSelect
export type TypeVectorDBData = typeof VectorsDBData.$inferSelect
export type AppDocumentType = typeof AppDocuments.$inferSelect
export type ToolType = typeof tools.$inferSelect
export type BoardType = typeof boards.$inferSelect
export type LogType = typeof logs.$inferSelect
export type MonitoringType = typeof monitoring.$inferSelect

//payments
export type TypeSubscription = typeof subscriptions.$inferSelect
export type TypePricingPlan = typeof pricingPlans.$inferSelect
export type TypeWebhookEvents = typeof webhookEvents.$inferSelect
