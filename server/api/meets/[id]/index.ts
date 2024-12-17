export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const params = getRouterParams(event);
  const meet = await db.query.meetTable.findFirst({
    where: eq(tables.meetTable.meet, parseInt(params.id)),
    with: {
      events: {
        orderBy: (events, { asc }) => [asc(events.eventNumber)],
        with: {
          entries: {
            orderBy: (entries, { asc }) => [
              asc(entries.heat),
              asc(entries.lane),
            ],

            with: {
              athlete: true,
            },
          },
        },
      },
    },
  });
  if (!meet) {
    return createError({
      statusCode: 404,
      message: "Meet not found",
    });
  }
  // get all results for the meet
  const results = await db.query.resultsTable.findMany({
    where: eq(tables.resultsTable.meet, parseInt(params.id)),
    with: {
      athlete: true,
    },
  });
  return {...meet, results};
});
