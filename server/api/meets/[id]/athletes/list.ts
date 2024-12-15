import { Athlete } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const params = getRouterParams(event);
  const events = await db.query.meetEventsTable.findMany({
    where: eq(tables.meetEventsTable.meet, parseInt(params.id)),
    with: {
      entries: {
        with: {
          athlete: {
            with: {
              team: true,
            },
          },
        },
      },
    },
  });
  // dedupe
  const athletes: Map<number, Athlete> = new Map();
  events
    .filter((x) => x)
    .forEach((event) => {
      event.entries.forEach((entry) => {
        if (!entry.athlete) {
          return;
        }
        athletes.set(entry.athlete?.athlete, entry.athlete);
      });
    });
  const array: Array<Athlete> = Array.from(athletes.values());
  return array;
});
