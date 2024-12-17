import { count, desc } from "drizzle-orm";
import { meetTable } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const meets = await db.query.meetTable.findMany({
    orderBy: [desc(meetTable.start)],
  });
  return  Promise.all(meets.map(async(meet) => {
    const entryCount = await db
      .select({
        count: count(),
      })
      .from(tables.entryTable)
      .where(eq(tables.entryTable.meet, meet.meet));
    return {...meet, entryCount: entryCount[0].count};
  }));
});
