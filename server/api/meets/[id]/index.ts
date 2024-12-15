export default defineEventHandler((event) => {
  const db = useDrizzle();
  const params = getRouterParams(event);
  const meet = db.query.meetTable.findFirst({
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
  return meet;
});
