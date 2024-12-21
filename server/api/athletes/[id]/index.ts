export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const db = useDrizzle();

    const athlete = await db.query.athleteTable.findFirst({
        where: eq(tables.athleteTable.athlete, parseInt(params.id)),
    });
    return athlete;
});