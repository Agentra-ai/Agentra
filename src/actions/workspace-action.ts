import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

import { db } from "@/config/db"

import { users, workspaces, workspaceUsers } from "./../db/schema/index"
import { getUserDetails } from "./user"

export async function createWorkspace({
  name,
  userId,
}: {
  name: string
  userId: string
}) {
  // Check if the user already exists in workspaceUsers
  const existingWorkspaceUser = await db
    .select()
    .from(workspaceUsers)
    .where(eq(workspaceUsers.userId, userId))
    .limit(1)

  if (existingWorkspaceUser.length > 0) {
    // User already associated with a workspace
    const workspaceId = existingWorkspaceUser[0]?.workspaceId
    // Update user's workspaceId in users table
    await updateUserWorkspaceInUserTable({
      id: userId,
      workspaceId: workspaceId!,
    })
    // Retrieve and return the existing workspace
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId!))
      .limit(1)
    return existingWorkspace[0]
  } else {
    const workspaceId = uuidv4()
    const workspaceVectorDB = uuidv4()
    const newWorkspace = await db
      .insert(workspaces)
      .values({
        id: workspaceId,
        name,
        workspaceVectorDB: workspaceVectorDB,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    console.log(newWorkspace)

    // Add user to workspace_users with role 'admin'
    await db.insert(workspaceUsers).values({
      userId,
      workspaceId: (newWorkspace[0]?.id as string) || "",
      role: "ADMIN",
    })

    // Update user's workspaceId in users table
    await updateUserWorkspaceInUserTable({
      id: userId,
      workspaceId: newWorkspace[0]?.id || "",
    })

    return newWorkspace[0]
  }
}

export async function updateUserWorkspaceInUserTable({
  id,
  workspaceId,
}: {
  id: string
  workspaceId: string
}) {
  const updatedUserWorkspace = await db
    .update(users)
    .set({ workspaceId })
    .where(eq(users.id, id))
    .returning()

  console.log(updatedUserWorkspace)

  return updatedUserWorkspace[0]
}

export async function getWorkspaceDetails() {
  const userDetails = await getUserDetails()
  const workspaceId = userDetails?.workspaceId
  if (!workspaceId) {
    throw new Error("Workspace ID is undefined")
  }
  const workspaceArray = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1)
  return workspaceArray[0]
}
