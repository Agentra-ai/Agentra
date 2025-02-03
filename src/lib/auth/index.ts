import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "../db";
import { sessionTable } from "../db/schema/session";

import { User as UserType } from "@/lib/db/schema/user";
import { userTable } from "../db/schema/user";

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  // @ts-expect-error
  sessionTable,
  userTable
);
// https://lucia-auth.com/getting-started/nextjs-app
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,

    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
      email: attributes.email,
      email_verified: attributes.email_verified,
      setupTwoFactor: attributes.two_factor_secret !== null,
      workspaceId: attributes.workspaceId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes extends UserType {}
