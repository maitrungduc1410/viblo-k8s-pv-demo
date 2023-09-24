// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { rename, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const storage = join(process.cwd(), "storage");

    const files = await readdir(storage);
    res.status(200).json(files.filter((item) => item !== ".gitkeep"));
  } else if (req.method === "POST") {
    const { file } = req.body;
    const storage = join(process.cwd(), "storage");
    await rm(join(storage, file));
    res.status(200).json({ success: true });
  }
}
