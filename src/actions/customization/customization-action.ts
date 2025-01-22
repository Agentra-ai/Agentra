import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { AppCustomization, appCustomizations } from "@/db/schema"

export const getAppCustomization = async (appId: string) => {
  const appCustomizationsData = await db
    .select()
    .from(appCustomizations)
    .where(eq(appCustomizations.appId, appId))
    .execute()

  console.log("parsed appConfigs :;", appCustomizationsData)
  return appCustomizationsData[0] as AppCustomization
}

export const updateAppCustomization = async (
  appId: string,
  customisedData: AppCustomization
) => {
  console.log("customisedData :;", customisedData, appId)
  const updatedConfig = await db
    .update(appCustomizations)
    .set(customisedData)
    .where(eq(appCustomizations.appId, appId))

  return updatedConfig
}
