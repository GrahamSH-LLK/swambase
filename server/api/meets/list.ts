import { desc } from "drizzle-orm";
import { meetTable } from "~/server/db/schema";

export default defineEventHandler((event) => {
  const db = useDrizzle();
  const meets = db.query.meetTable.findMany({
    orderBy: [desc(meetTable.start)]
  });
  return meets;
});
