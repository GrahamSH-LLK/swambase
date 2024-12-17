export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const db = useDrizzle();

    const athlete = await db.query.athleteTable.findFirst({
        where: eq(tables.athleteTable.athlete, parseInt(params.athlete)),
        with: {
            team: true,
            entries: {
                where: eq(tables.entryTable.meet, parseInt(params.id)),
                with: {
                    event: true,
                }
            },
            results: {
                where: eq(tables.resultsTable.meet, parseInt(params.id)),
            },
        }
    }); 
    return athlete;
});