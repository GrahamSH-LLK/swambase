import { drizzle } from "drizzle-orm/node-postgres";

export { sql, eq, and, or, like, asc,desc } from "drizzle-orm";
import * as schema from "../db/schema";
export const tables = schema;
export type Athlete = typeof schema.athleteTable.$inferSelect 
export type Result = typeof schema.resultsTable.$inferSelect
export function useDrizzle() {
  return drizzle(`postgresql://postgres:password@localhost:5555/swam`, {
    schema,
  });
}

