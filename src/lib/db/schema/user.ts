import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { workspaces } from "./app-schema";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  username: text("username"),
  hashed_password: text("hashed_password"),
  email_verified: boolean("email_verified").notNull().default(false),
  two_factor_secret: text("two_factor_secret"),
  workspaceId: text("workspaceId").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
});

export type User = typeof userTable.$inferSelect