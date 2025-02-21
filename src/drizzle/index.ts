import { drizzle } from "drizzle-orm/neon-http";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

// Cast the Neon client to accept boolean type parameters
const sql = neon(DATABASE_URL) as NeonQueryFunction<boolean, boolean>;

const db = drizzle(sql, { schema });

export default db;
