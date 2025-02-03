import { relations } from "drizzle-orm/relations";
import { user, session, email_verification_code, password_reset_token, apps, app_customizations, conversations, app_documents, app_file, vectors_db_data, monitoring, subscription, pricing_plans, logs, messages, app_configs, oauth_account, workspace_users, workspaces } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	email_verification_codes: many(email_verification_code),
	password_reset_tokens: many(password_reset_token),
	subscriptions: many(subscription),
	oauth_accounts: many(oauth_account),
	workspace_users: many(workspace_users),
}));

export const email_verification_codeRelations = relations(email_verification_code, ({one}) => ({
	user: one(user, {
		fields: [email_verification_code.user_id],
		references: [user.id]
	}),
}));

export const password_reset_tokenRelations = relations(password_reset_token, ({one}) => ({
	user: one(user, {
		fields: [password_reset_token.user_id],
		references: [user.id]
	}),
}));

export const app_customizationsRelations = relations(app_customizations, ({one}) => ({
	app: one(apps, {
		fields: [app_customizations.app_id],
		references: [apps.id]
	}),
}));

export const appsRelations = relations(apps, ({many}) => ({
	app_customizations: many(app_customizations),
	conversations: many(conversations),
	monitorings: many(monitoring),
	logs: many(logs),
	app_configs: many(app_configs),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	app: one(apps, {
		fields: [conversations.app_id],
		references: [apps.id]
	}),
	messages: many(messages),
}));

export const app_fileRelations = relations(app_file, ({one, many}) => ({
	app_document: one(app_documents, {
		fields: [app_file.documents_id],
		references: [app_documents.id]
	}),
	vectors_db_data: many(vectors_db_data),
}));

export const app_documentsRelations = relations(app_documents, ({many}) => ({
	app_files: many(app_file),
}));

export const vectors_db_dataRelations = relations(vectors_db_data, ({one}) => ({
	app_file: one(app_file, {
		fields: [vectors_db_data.file_id],
		references: [app_file.id]
	}),
}));

export const monitoringRelations = relations(monitoring, ({one}) => ({
	app: one(apps, {
		fields: [monitoring.app_id],
		references: [apps.id]
	}),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id]
	}),
	pricing_plan: one(pricing_plans, {
		fields: [subscription.planId],
		references: [pricing_plans.id]
	}),
}));

export const pricing_plansRelations = relations(pricing_plans, ({many}) => ({
	subscriptions: many(subscription),
}));

export const logsRelations = relations(logs, ({one}) => ({
	app: one(apps, {
		fields: [logs.app_id],
		references: [apps.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	conversation: one(conversations, {
		fields: [messages.conversation_id],
		references: [conversations.id]
	}),
}));

export const app_configsRelations = relations(app_configs, ({one}) => ({
	app: one(apps, {
		fields: [app_configs.app_id],
		references: [apps.id]
	}),
}));

export const oauth_accountRelations = relations(oauth_account, ({one}) => ({
	user: one(user, {
		fields: [oauth_account.user_id],
		references: [user.id]
	}),
}));

export const workspace_usersRelations = relations(workspace_users, ({one}) => ({
	user: one(user, {
		fields: [workspace_users.user_id],
		references: [user.id]
	}),
	workspace: one(workspaces, {
		fields: [workspace_users.workspace_id],
		references: [workspaces.id]
	}),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	workspace_users: many(workspace_users),
}));