export default defineEventHandler((event) => {
  const db = useDrizzle();
  const params = getRouterParams(event);
  const meetEvent = db.query.meetEventsTable.findFirst({
    where: and(
      eq(tables.meetEventsTable.eventNumber, parseInt(params.eventId)),
      eq(tables.meetEventsTable.meet, parseInt(params.id))
    ),
    with: {
      entries: {
        orderBy: (entries, { asc }) => [asc(entries.heat),asc(entries.lane)],
        with: {
          athlete: true
        }
      },
    },
  });
  if (!meetEvent) {
    return createError({
      statusCode: 404,
      message: "Event not found",
    });
  }
  return meetEvent;
});
