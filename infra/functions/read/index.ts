import { http, type HttpFunction } from "@google-cloud/functions-framework";
import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.BUCKET_NAME!;
const FILE_NAME = "books.json";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "https://zkrasner.com")
  .split(",")
  .map((s) => s.trim());

const storage = new Storage();

function getCorsOrigin(requestOrigin: string | undefined): string | null {
  if (!requestOrigin) return null;
  return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : null;
}

const handler: HttpFunction = async (req, res) => {
  const origin = getCorsOrigin(req.headers.origin);
  if (origin) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const [content] = await storage
      .bucket(BUCKET_NAME)
      .file(FILE_NAME)
      .download();

    res.set("Content-Type", "application/json");
    res.set("Cache-Control", "public, max-age=3600");
    res.status(200).send(content);
  } catch (err) {
    console.error("Read failed:", err);
    res.status(500).json({ error: "Failed to read books" });
  }
};

http("readBooks", handler);
