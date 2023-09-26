// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { rename, readdir } from "node:fs/promises";
import { join } from "node:path";

export const config = {
  api: {
    bodyParser: false, // for formidable
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const storage = join(process.cwd(), "storage");
  const form = formidable({
    uploadDir: storage,
  });

  let fields: formidable.Fields;
  let files: formidable.Files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err: any) {
    console.error(err)
    return res.status(500).send("Internal Server Error");
  }
  const file = (files.file as formidable.File[])[0];

  await rename(file.filepath, join(storage, file.originalFilename!));

  res
    .status(200)
    .json((await readdir(storage)).filter((item) => item !== ".gitkeep"));
}
