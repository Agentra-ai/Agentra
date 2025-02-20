"use server";

import { eq } from "drizzle-orm";

import db from "@/drizzle";
import { AppConfig, appConfigs } from "@/drizzle/schema";

export const getAppConfigDetails = async (appId: string) => {
  const appConfig = await db
    .select()
    .from(appConfigs)
    .where(eq(appConfigs.appId, appId));

  const appParsedFileKeyConfig = appConfig.map((config) => ({
    ...config,
    // fileKeys: config.contextFileKeys ? JSON.parse(config.contextFileKeys) : null,
    contextFileKeys: config.contextFileKeys
      ? JSON.parse(config.contextFileKeys)
      : null,
  }));

  console.log("parsed appConfigs :;", appParsedFileKeyConfig);

  return appParsedFileKeyConfig[0];
};

export const updateAppConfig = async (appId: string, config: AppConfig) => {
  // Convert createAt and updateAt to Date instances if they are not already dates
  if (!(config.createdAt instanceof Date)) {
    config.createdAt = new Date(config.createdAt);
  }
  if (!(config.updatedAt instanceof Date)) {
    config.updatedAt = new Date(config.updatedAt);
  }
  
  await db
    .update(appConfigs)
    .set(config)
    .where(eq(appConfigs.appId, appId));

  return { success: true };
};
