"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchShelf = fetchShelf;
exports.parseItems = parseItems;
exports.sortBooks = sortBooks;
const GOODREADS_USER_ID = "110750477";
const SHELF = "read";
function decodeEntities(str) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}
function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
    if (match)
        return decodeEntities(match[1].trim());
    const simple = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return simple ? decodeEntities(simple[1].trim()) : "";
}
function upgradeCoverUrl(url) {
    return url.replace(/_S[XY]\d+_/, "_SY475_");
}
async function fetchShelf(page) {
    const url = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${SHELF}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`HTTP ${res.status} fetching ${url}`);
    return res.text();
}
function parseItems(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const block = match[1];
        const rawTitle = extractTag(block, "title");
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
function sortBooks(books) {
    return [...books].sort((a, b) => {
        if (a.dateRead && b.dateRead)
            return b.dateRead.localeCompare(a.dateRead);
        if (a.dateRead)
            return -1;
        if (b.dateRead)
            return 1;
        return 0;
    });
}
