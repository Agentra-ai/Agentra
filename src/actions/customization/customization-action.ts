import { eq } from "drizzle-orm";

import db from "@/drizzle";
import { AppCustomization, appCustomizations } from "@/drizzle/schema";

export const getAppCustomization = async (appId: string) => {
  const appCustomizationsData = await db
    .select()
    .from(appCustomizations)
    .where(eq(appCustomizations.appId, appId))
    .execute();

  console.log("fetch server action", appCustomizationsData, appId);

  return appCustomizationsData[0] as AppCustomization;
};

export const updateAppCustomization = async (
  appId: string,
  customisedData: Partial<AppCustomization>,
) => {
  // console.log("update server action", customisedData, "appId", appId);

  // Create a new object with properly formatted dates
  const dataToUpdate = {
    ...customisedData,
    createdAt: customisedData.createdAt
      ? new Date(customisedData.createdAt)
      : undefined,
    updatedAt: new Date(),
  };

  // Remove undefined values
  Object.keys(dataToUpdate).forEach((key) => {
    const typedKey = key as keyof typeof dataToUpdate;
    dataToUpdate[typedKey] === undefined && delete dataToUpdate[typedKey];
  });

  console.log("update server action", dataToUpdate, dataToUpdate.botLogo);

  const updatedConfig = await db
    .update(appCustomizations)
    .set(dataToUpdate)
    .where(eq(appCustomizations.appId, appId));

  return updatedConfig;
};
