import { linkOAuthAccount } from "@/actions/auth"
import { getUserById } from "@/actions/user"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"

import { env } from "@/env.mjs"
import authConfig from "@/config/auth"
import { db } from "@/config/db"

import {
  createWorkspace,
  updateUserWorkspaceInUserTable,
} from "./actions/workspace-action"

const nextAuth = NextAuth({
  adapter: DrizzleAdapter(db),
  debug: env.NODE_ENV === "development",
  trustHost: process.env.AUTH_TRUST_HOST ? true : false,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    verifyRequest: "/signin/magic-link-signin",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) await linkOAuthAccount({ userId: user.id })
    },
    async signIn({ user }) {
      const workspace = await createWorkspace({
        name: user.name!,
        userId: user.id!,
      })
      await updateUserWorkspaceInUserTable({
        id: user.id!,
        workspaceId: workspace?.id!,
      })
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as "USER" | "ADMIN"
      return session
    },
    async signIn({ user, account }) {
      if (!user.id) return false
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById({ id: user.id })

      return !existingUser?.emailVerified ? false : true
    },
  },
  ...authConfig,
})

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = nextAuth

export default auth
