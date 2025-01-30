import dotenv from 'dotenv';
import { defineConfig } from "drizzle-kit"

import { env } from "@/env.mjs"

dotenv.config()

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
