import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://postgres:password@localhost:5555/swam`,
  },
});
