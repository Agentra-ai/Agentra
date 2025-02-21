"use server";

import { getUserByEmail, getUserDetails } from "@/actions/user";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  DatabaseError,
  UnauthorizedError,
  NotFoundError,
} from "@/lib/errors/errors";

import db from "@/drizzle";
import { appConfigs, appCustomizations, apps } from "@/drizzle/schema";
import { auth } from "@/auth";

type AppDetails = {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  appType: string;
  existingAppId: string | null;
};

export const createApp = async (appDetails: AppDetails) => {
  try {
    const user = await getUserDetails();

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user?.workspaceId) {
      throw new BadRequestError("User does not have a workspace");
    }

    const newAppId = uuidv4();
    const newAppConfigId = uuidv4();
    const newCustomizationId = uuidv4();

    if (
      appDetails?.existingAppId &&
      appDetails.existingAppId !== "" &&
      appDetails.existingAppId !== "null"
    ) {
      // Update existing app logic
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
        .where(eq(apps.id, appDetails.existingAppId));

      return appDetails.existingAppId;
    } else {
      // Create new app logic
      await db.insert(apps).values({
        id: newAppId,
        workspaceId: user.workspaceId,
        userId: user.id!,
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
      });

      // Insert configurations
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
        contextFileKeys: "",
        embedLink: "",
        createdAt: new Date(),
      });

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
      });

      return newAppId;
    }
  } catch (error) {
    if (error) throw error;
    throw new DatabaseError("Error creating or updating app");
  }
};

export const deleteApp = async (appId: string) => {
  try {
    const user = await getUserDetails();

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user?.workspaceId) {
      throw new BadRequestError("User does not have a workspace");
    }

    const app = await db.select().from(apps).where(eq(apps.id, appId)).limit(1);

    if (!app.length) {
      throw new NotFoundError(`App with id ${appId} not found`);
    }

    await db.delete(apps).where(eq(apps.id, appId));
    return true;
  } catch (error) {
    if (error) throw error;
    throw new DatabaseError("Error deleting app");
  }
};

export const getWorkspaceApps = async () => {
  try {
    const session = await auth();
    const user = await getUserByEmail();

    if (!user || !user.workspaceId) {
      throw new UnauthorizedError("User not found or no workspace assigned");
    }

    const workspaceApps = await db
      .select()
      .from(apps)
      .where(eq(apps.workspaceId, user.workspaceId))
      .orderBy(desc(apps.createdAt));

    return workspaceApps;
  } catch (error) {
    if (error) throw error;
    throw new DatabaseError("Error fetching workspace apps");
  }
};
