export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const teams = await db.query.teamsTable.findMany({
    with: {
      athletes: true,
    },
  });
  return teams;
});
