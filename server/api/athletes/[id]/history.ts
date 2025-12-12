export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const db = useDrizzle();

  const results = await db.query.resultsTable.findMany({
    where: and(eq(tables.resultsTable.athlete, parseInt(params.id))),
    with: {
      meet: true,
    },
  });

  const eventGroups: Record<string, typeof results> = {};

  for (const result of results.filter(
    (x) => x.iR != "R" && x.score && x.score > 0
  )) {
    const eventKey = `${result.distance}-${result.stroke}-${result.course}`;
    if (!eventGroups[eventKey]) {
      eventGroups[eventKey] = [];
    }
    eventGroups[eventKey].push(result);
  }

  for (const key in eventGroups) {
    eventGroups[key].sort((a, b) => {
      const dateA = new Date(a.meet?.start || 0);
      const dateB = new Date(b.meet?.start || 0);
      return dateA.getTime() - dateB.getTime();
    });
  }

  return eventGroups;
});
