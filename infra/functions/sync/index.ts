import { http, type HttpFunction } from "@google-cloud/functions-framework";
import { Storage } from "@google-cloud/storage";
import { fetchShelf, parseItems, sortBooks } from "./shared/goodreads.js";
import type { Book } from "./shared/types.js";

const BUCKET_NAME = process.env.BUCKET_NAME!;
const BOOKS_FILE = "books.json";
const OVERRIDES_FILE = "overrides.json";

const storage = new Storage();

async function loadOverrides(): Promise<Book[]> {
  try {
    const [content] = await storage
      .bucket(BUCKET_NAME)
      .file(OVERRIDES_FILE)
      .download();
    return JSON.parse(content.toString());
  } catch {
    console.warn(
      "No overrides.json found in bucket, continuing without overrides",
    );
    return [];
  }
}

async function syncBooks(): Promise<Book[]> {
  const allBooks: Book[] = [];
  let page = 1;

  while (true) {
    console.log(`Fetching page ${page}...`);
    const xml = await fetchShelf(page);
    const books = parseItems(xml);
    if (books.length === 0) break;
    allBooks.push(...books);
    page++;
  }

  console.log(`Found ${allBooks.length} books from Goodreads.`);

  const overrides = await loadOverrides();
  console.log(`Loaded ${overrides.length} overrides from bucket.`);

  // Append overrides (additional entries, not replacements)
  return sortBooks([...allBooks, ...overrides]);
}

const handler: HttpFunction = async (_req, res) => {
  try {
    const books = await syncBooks();

    await storage
      .bucket(BUCKET_NAME)
      .file(BOOKS_FILE)
      .save(JSON.stringify(books), {
        contentType: "application/json",
      });

    console.log(
      `Wrote ${books.length} books to gs://${BUCKET_NAME}/${BOOKS_FILE}`,
    );
    res.status(200).json({ ok: true, count: books.length });
  } catch (err) {
    console.error("Sync failed:", err);
    res.status(500).json({ ok: false, error: "Sync failed" });
  }
};

http("syncBooks", handler);
