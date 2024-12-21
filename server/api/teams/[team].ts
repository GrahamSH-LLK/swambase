// team detail

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const db = useDrizzle();

    const team = await db.query.teamsTable.findFirst({
        where: eq(tables.teamsTable.team, parseInt(params.team)),
        with: {
            athletes: true,
        }
    });
    return team;
});