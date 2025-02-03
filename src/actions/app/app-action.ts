"use server"

import { getUserDetails } from "@/actions/user"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

import { db } from "@/lib/db"
import { appConfigs, appCustomizations, apps } from "@/lib/db/schema"


type AppDetails = {
  name: string
  description: string
  icon: string
  tags: string[]
  appType: string
  existingAppId: string | null
}

export const createApp = async (appDetails: AppDetails) => {
  console.log(appDetails)
  try {
    const users = await getUserDetails()
    console.log(users)
    console.log("exisiting id :", appDetails.existingAppId)
    if (!users) {
      console.log("cannot find user in app-action.tsx")
      return
    }
    if (!users?.workspaceId) {
      console.log("User does not have a workspace")
      return
    }
    const newAppId = uuidv4()
    const newAppConfigId = uuidv4()
    const newCustomizationId = uuidv4()

    if (
      appDetails &&
      appDetails.existingAppId &&
      appDetails.existingAppId !== "" &&
      appDetails.existingAppId !== "null"
    ) {
      console.log("Updating existing app")
      // Update existing app  
      await db
        .update(apps)
        .set({
          description: appDetails.description,
          icon: appDetails.icon,
          tags: appDetails.tags,
          name: appDetails.name,
          appType: appDetails.appType,
          updatedAt: new Date(),
        })
        .where(eq(apps.id, appDetails.existingAppId))

      return appDetails.existingAppId
    } else {
      console.log("Creating new app")
      // Insert into 'apps' first
      console.log(appDetails)
      await db.insert(apps).values({
        id: newAppId,
        workspaceId: users.workspaceId!,
        userId: users.id!,
        description: appDetails.description,
        icon: appDetails.icon,
        apiRph: 0,
        apiRpm: 0,
        enableSite: false,
        enableApi: false,
        tags: appDetails.tags,
        name: appDetails.name,
        appType: appDetails.appType,
        appMode: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Then insert into 'appConfigs'
      await db.insert(appConfigs).values({
        id: newAppConfigId,
        appId: newAppId,
        instructions: "",
        openingStatement: "",
        followUp: false,
        suggestedQuestions: [],
        suggestedQuestionsEnabled: false,
        speechToTextEnabled: false,
        textToSpeechEnabled: false,
        textToSpeechVoice: "",
        textToSpeechLanguage: "",
        sensitiveWordAvoidanceEnabled: false,
        // modelId: uuidv4(),
        contextFileKeys: "",
        embedLink: "",
        createdAt: new Date(),
      })

      // Then insert into 'appCustomizations'
      await db.insert(appCustomizations).values({
        id: newCustomizationId,
        appId: newAppId,
        botLogo: appDetails.icon,
        botName: "Agent App",
        bgColor: "#ffffff",
        aiChatColor: "#f5f5fa",
        userChatColor: "#ebf5ff",
        botTextColor: "#000000",
        userTextColor: "#3d3d3d",
        botFontSize: 14,
        botFontWeight: 400,
        botFontFamily: "Arial",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`App with id ${newAppId} created successfully`)
      return newAppId
    }
  } catch (error) {
    console.error(error)
    throw new Error("Error creating or updating app")
  }
}

export const deleteApp = async (appId: string) => {
  const users = await getUserDetails()
  try {
    if (!users) {
      console.log("cannot find user in app-action.tsx")
      return
    }
    if (!users?.workspaceId) {
      console.log("User does not have a workspace")
      return
    }
    const app = await db.select().from(apps).where(eq(apps.id, appId)).limit(1)

    if (app.length) {
      await db.delete(apps).where(eq(apps.id, appId))
    }
    console.log(app)
    if (!app.length) {
      console.log(`App with id ${appId} not found`)
      return
    }
    console.log(`App with id ${appId} deleted successfully`)
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting app")
  }
}

export const getWorkspaceApps = async () => {
  // await rateLimitByIp({ key: "getWorkspaceApps", limit: 10, window: 60000 })
  const users = await getUserDetails()
  if (users === null || !users.workspaceId) return null

  const workspaceApps = await db
    .select()
    .from(apps)
    .where(eq(apps.workspaceId, users.workspaceId))
  return workspaceApps
}
