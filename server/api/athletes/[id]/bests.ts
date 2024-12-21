import { Result } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const db = useDrizzle();
  // get all results for the athlete
  const results = await db.query.resultsTable.findMany({
    where: and(
      eq(tables.resultsTable.athlete, parseInt(params.id)),
    ),
    with: {
      meet: true,
    },
  });
  
  // find the fastest time for each event. dedupe by result.distance and result.stroke
  const bests: Result[] = [];
  for (const result of results.filter((x) => x.iR != "R")) {
    if (!result.score) {
      continue;
    }
    const existing = bests.findIndex(
      (x) =>
        x.distance == result.distance &&
        x.stroke == result.stroke &&
        x.course == result.course 
    );

    if (existing < 0  || !bests[existing]?.score) {
      bests.push(result);
    } else if (result?.score < bests[existing]?.score) {
      bests[existing] = result;
    }
  }
  return bests;
});
