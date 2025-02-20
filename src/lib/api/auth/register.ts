"use server";

import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { action } from "@/lib/safe-action";
import { InferInsertModel } from "drizzle-orm";
import { generateId } from "lucia";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { z } from "zod";
import { sendEmailVerificationCode } from "./mails";
import { useRateLimiting } from "@/lib/utils.server";
import { v4 } from "uuid";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
});
export const register = action(registerSchema, async ({ email, password }) => {
  // check if user exists
  await useRateLimiting();

  const existingUser = await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const userId = v4();
  let values: InferInsertModel<typeof userTable> = {
    email,
    id: userId,
    hashed_password: undefined,
    workspaceId : v4()
  };
  // create user
  if (password) {
    const hashedPassword = await new Argon2id().hash(password);
    values = {
      ...values,
      hashed_password: hashedPassword,
      email_verified: false,
      workspaceId : v4()
    };
  }
  await db.insert(userTable).values(values);

  // send magic link
  await sendEmailVerificationCode({
    email,
    userId: userId,
  });

  redirect(`/auth/verify-email?email=${email}`);
});
