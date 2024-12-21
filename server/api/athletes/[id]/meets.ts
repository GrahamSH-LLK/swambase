export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const db = useDrizzle();

    const athlete = await db.query.athleteTable.findFirst({
        where: eq(tables.athleteTable.athlete, parseInt(params.id)),
        with: {
            team: true,
            entries: {

                with: {
                    meet: true
                }
            },
        }
    });
    // reduce entries to list of meets
    let meets = athlete?.entries.map((entry) => entry.meet);
    meets =  meets?.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) =>  t?.meet === value?.meet) 
    ).sort((a,b) => a?.start < b?.start ? 1 : -1);

    return meets;
});