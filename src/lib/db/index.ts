import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!process.env.DATABASE_URL) return undefined;
  // Supabase transaction pooler requires prepared statements disabled.
  database ??= drizzle(
    postgres(process.env.DATABASE_URL, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    }),
    { schema },
  );
  return database;
}
