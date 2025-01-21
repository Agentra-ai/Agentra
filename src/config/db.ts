import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "@/env.mjs"
import * as schema from "@/db/schema"

dotenv.config()

const Db_URL =
  "postgresql://dama_owner:esr8ZDR9BwYO@ep-yellow-king-a1gcoebp.ap-southeast-1.aws.neon.tech/dama?sslmode=require"
const sql = neon(Db_URL || env.DATABASE_URL)

export const db = drizzle(sql, { schema })
