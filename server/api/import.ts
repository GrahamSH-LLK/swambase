import { importData } from "../db/importData";

export default defineEventHandler(async (event) => {
  const data = readFormData(event);
  const password = (await data).get("password") as string;
  if (password !== process.env.IMPORT_PASSWORD) {
    return createError({
      statusCode: 401,
      message: "Invalid password",
    });
  }
  const file = (await data).get("file") as Blob;
  const blob = new Blob([file], { type: file.type });
  const buffer = Buffer.from(await blob.arrayBuffer());

  if (!buffer) {
    return createError({
      statusCode: 400,
      message: "No data provided",
    });
  }
  try {
    await importData(buffer);
    return { success: true };
  } catch (e: any) {
    console.log(e);
    throw createError({
      statusCode: 400,
      statusMessage: e?.message,
    });
  }
});
