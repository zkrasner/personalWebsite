/**
 * Fetches books from a Goodreads RSS feed and generates src/data/books.ts.
 *
 * Usage: npx tsx scripts/sync-books.ts
 */

const GOODREADS_USER_ID = "110750477";
const SHELF = "read";
const OUTPUT_PATH = "src/data/books.ts";

interface Book {
  title: string;
  author: string;
  coverUrl: string;
  dateRead: string | null;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(
    new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`),
  );
  if (match) return decodeEntities(match[1].trim());
  const simple = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return simple ? decodeEntities(simple[1].trim()) : "";
}

function upgradeCoverUrl(url: string): string {
  // Goodreads thumbnails use _SY75_ or _SX50_ etc. — bump to _SY475_ for larger images
  return url.replace(/_S[XY]\d+_/, "_SY475_");
}

async function fetchShelf(page: number): Promise<string> {
  const url = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${SHELF}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

function parseItems(xml: string): Book[] {
  const items: Book[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const rawTitle = extractTag(block, "title");
    // Strip series info like " (Mistborn, #5)"
    const title = rawTitle.replace(/\s*\(.*\)\s*$/, "");

    const author = extractTag(block, "author_name");
    const coverUrl = upgradeCoverUrl(extractTag(block, "book_image_url"));
    const readAt = extractTag(block, "user_read_at");

    const dateRead = readAt
      ? new Date(readAt).toISOString().split("T")[0]
      : null;

    if (title && author) {
      items.push({ title, author, coverUrl, dateRead });
    }
  }

  return items;
}

async function main() {
  const allBooks: Book[] = [];
  let page = 1;

  // Paginate through all pages (Goodreads returns up to ~100 per page)
  while (true) {
    console.log(`Fetching page ${page}...`);
    const xml = await fetchShelf(page);
    const books = parseItems(xml);
    if (books.length === 0) break;
    allBooks.push(...books);
    page++;
  }

  console.log(`Found ${allBooks.length} books from Goodreads.`);

  const fs = await import("fs");
  const path = await import("path");
  const url = await import("url");
  const scriptDir = path.dirname(url.fileURLToPath(import.meta.url));

  allBooks.sort((a, b) => {
    if (a.dateRead && b.dateRead) return b.dateRead.localeCompare(a.dateRead);
    if (a.dateRead) return -1;
    if (b.dateRead) return 1;
    return 0;
  });

  const fileContent = `export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  dateRead: string | null;
}

export const books: Book[] = ${JSON.stringify(allBooks, null, 2)};
`;

  const outPath = path.resolve(scriptDir, "..", OUTPUT_PATH);
  fs.writeFileSync(outPath, fileContent);
  console.log(`Wrote ${allBooks.length} books to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
