import { z } from "zod"

import {
  BillingStatus,
  DocumentStatus,
  ModelMode,
  SubscriptionPlan,
} from "@/db/schema"

// User schema
export const userSchema = z.object({
  id: z.string(),
  role: z.string().default("ADMIN"),
  fullname: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  emailVerificationToken: z.string().nullable(),
  passwordHash: z.string().nullable(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordTokenExpiry: z.date().nullable(),
  image: z.string().nullable(),
  createdAt: z.date(),
  workspaceId: z.string().nullable(),
})

// Account schema
export const accountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

// Session schema
export const sessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
})

// VerificationToken schema
export const verificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
})

// NewsletterSubscriber schema
export const newsletterSubscriberSchema = z.object({
  email: z.string(),
  createdAt: z.date(),
})

// Workspace schema
export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

// WorkspaceUser schema
export const workspaceUserSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
  role: z.string(),
})

// AIModel schema
export const aiModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  mode: z.nativeEnum(ModelMode).default(ModelMode.CHAT),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Billing schema
export const billingSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  plan: z.nativeEnum(SubscriptionPlan).default(SubscriptionPlan.FREE),
  quota: z.number(),
  status: z.nativeEnum(BillingStatus).default(BillingStatus.ACTIVE),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// AppCustomization schema
export const appCustomizationSchema = z.object({
  id: z.string(),
  botLogo: z.string().nullable(),
  botName: z.string(),
  bgColor: z.string(),
  aiChatColor: z.string(),
  userChatColor: z.string(),
  botTextColor: z.string(),
  botFontSize: z.number(),
  botFontWeight: z.number(),
  botFontFamily: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  appId: z.string(),
})

// AppConfig schema
export const appConfigSchema = z.object({
  id: z.string(),
  userInputForm: z.string().nullable(),
  openingStatement: z.string().nullable(),
  followup: z.boolean().default(false),
  suggestedQuestions: z.array(z.any()).default([]),
  chatPromptConfig: z.any().nullable(),
  completionPromptConfig: z.any().nullable(),
  datasetQueryVariable: z.string(),
  speechToTextEnabled: z.boolean().default(false),
  textToSpeechEnabled: z.boolean().default(false),
  textToSpeechVoice: z.string(),
  textToSpeechLanguage: z.string(),
  retrieverResourceEnabled: z.boolean().default(false),
  sensitiveWordAvoidanceEnabled: z.boolean().default(false),
  annotationReply: z.any(),
  agentModeEnabled: z.boolean().default(false),
  modelId: z.string(),
  datasetConfigId: z.string(),
  fileUpload: z.any(),
  files: z.any(),
  createdAt: z.date(),
  appId: z.string(),
})

// App schema
export const appSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  apiRph: z.number().nullable(),
  apiRpm: z.number().nullable(),
  enableSite: z.boolean().nullable(),
  enableApi: z.boolean().nullable(),
  tags: z.array(z.any()).nullable(),
  name: z.string().nullable(),
  appMode: z.string().nullable(),
  appType: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// LiveAgent schema
export const liveAgentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().nullable(),
  configuration: z.any().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// DocsVault schema
export const docsVaultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Folder schema
export const folderSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string().nullable(),
  docsVaultId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Document schema
export const documentSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  workspaceId: z.string(),
  userId: z.string(),
  folderId: z.string(),
  content: z.string().nullable(),
  status: z.nativeEnum(DocumentStatus).default(DocumentStatus.ACTIVE),
  isPublic: z.boolean().default(false),
  words: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Tool schema
export const toolSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Board schema
export const boardSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string().nullable(),
  type: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Log schema
export const logSchema = z.object({
  id: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  liveAgentId: z.string(),
  content: z.string().nullable(),
  timestamp: z.date(),
})

// Monitoring schema
export const monitoringSchema = z.object({
  id: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  liveAgentId: z.string(),
  isEnabled: z.boolean().default(true),
  settings: z.any().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
