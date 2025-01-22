import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { AppConfig, appConfigs } from "@/db/schema"

export const getAppConfigDetails = async (appId: string) => {
  const appConfig = await db
    .select()
    .from(appConfigs)
    .where(eq(appConfigs.appId, appId))

  const appParsedFileKeyConfig = appConfig.map((config) => ({
    ...config,
    // fileKeys: config.contextFileKeys ? JSON.parse(config.contextFileKeys) : null,
    contextFileKeys: config.contextFileKeys
      ? JSON.parse(config.contextFileKeys)
      : null,
  }))

  console.log("parsed appConfigs :;", appParsedFileKeyConfig)

  return appParsedFileKeyConfig[0]
}

export const updateAppConfig = async (appId: string, config: AppConfig) => {
  // try {
  const updatedConfig = await db
    .update(appConfigs)
    .set(config)
    .where(eq(appConfigs.appId, appId))
  return updatedConfig
  // } catch (error) {
  //   console.error('Error updating app config:', error);
  //   throw error;
  // }
}
