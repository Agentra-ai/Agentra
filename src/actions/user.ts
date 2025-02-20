"use server";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/get-session";

export async function getUserDetails() {
  try {
    const session = await validateRequest();
    if (!session.user?.id) return null;

    noStore();

    const [user] = await db.query.userTable.findMany({
      where: eq(userTable.id, session.user.id),
    });

    return user || null;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("Error fetching user details");
  }
}

export async function getUserByEmail() {
  try {
    const session = await validateRequest();
    if (!session.user?.email) return null;

    noStore();

    const [user] = await db.query.userTable.findMany({
      where: eq(userTable.email, session.user.email),
    });

    return user || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Error fetching user by email");
  }
}
