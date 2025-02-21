"use server";

import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { createWorkspace } from "./workspace/workspace-action";

export async function oauthVerifyEmailAction(email: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        isNull(users.fullname),
        isNull(users.emailVerified),
      ),
    )
    .then((res) => res[0] ?? null);

  if (existingUser?.id) {
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, existingUser.id));
  }

  // if(existingUser && !existingUser.workspaceId)
  // {
  //   await createWorkspace({
  //     name: existingUser?.fullname! || "my workspace",
  //     userId: existingUser?.id!,
  //   })
  // }
}
