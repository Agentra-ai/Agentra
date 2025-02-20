"use server";

import { unstable_noStore as noStore } from "next/cache";
import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { createWorkspace } from "./workspace/workspace-action";

export async function getUserDetails() {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    noStore();

    const [user] = await db.query.users.findMany({
      where: eq(users.email, session.user.email),
    });

    return user || null;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("Error fetching user details");
  }
}

export async function getUserByEmail() {
  const session = await auth();
  if (!session?.user?.email) return null;
  try {
    noStore();

    const [user] = await db.query.users.findMany({
      where: eq(users.email, session?.user?.email),
    });

    return user || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Error fetching user by email");
  }
}

export async function findUserByEmail(email: string) {
  try {
    noStore();

    const [user] = await db.query.users.findMany({
      where: eq(users.email, email),
    });

    return user || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Error finding user by email");
  }
}
