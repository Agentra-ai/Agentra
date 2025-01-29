import { defineConfig } from "drizzle-kit"
import dotenv from "dotenv";
import { env } from "@/env.mjs"

// Load environment variables explicitly from .env
dotenv.config({ path: "/home/ubuntu/Agentra/.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
