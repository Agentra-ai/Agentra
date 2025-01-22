"use server"

import { unstable_noStore as noStore } from "next/cache"

import { db } from "@/db/db"
import {
  psGetUserByEmail,
  psGetUserByEmailVerificationToken,
  psGetUserById,
  psGetUserByResetPasswordToken,
} from "@/db/prepared/statements"
import { users, type User } from "@/db/schema"
import { eq } from 'drizzle-orm'
import {
  getUserByEmailSchema,
  getUserByEmailVerificationTokenSchema,
  getUserByIdSchema,
  getUserByResetPasswordTokenSchema,
  type GetUserByEmailInput,
  type GetUserByEmailVerificationTokenInput,
  type GetUserByIdInput,
  type GetUserByResetPasswordTokenInput,
} from "@/validations/user"
import auth from "@/main-auth"

export async function getUserById(
  rawInput: GetUserByIdInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserById.execute({ id: validatedInput.data.id })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by id")
  }
}

export async function getUserDetails(): Promise<User | null> {
  try {
    // Get the session
    const session = await auth();

    // Check if the session exists and has a user
    if (!session?.user?.email) {
      return null;
    }
    
    // Fetch the user from the database using the email from the session
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email));

    return user || null;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw new Error('Error getting user details');
  }
}

export async function getUserByEmail(
  rawInput: GetUserByEmailInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByEmailSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByEmail.execute({
      email: validatedInput.data.email,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email")
  }
}

export async function getUserByResetPasswordToken(
  rawInput: GetUserByResetPasswordTokenInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByResetPasswordTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByResetPasswordToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by reset password token")
  }
}

export async function getUserByEmailVerificationToken(
  rawInput: GetUserByEmailVerificationTokenInput
): Promise<User | null> {
  try {
    const validatedInput =
      getUserByEmailVerificationTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByEmailVerificationToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email verification token")
  }
}
