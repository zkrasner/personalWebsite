// Formats an ISO YYYY-MM string into "MMM YYYY" display format.
// Used for date ranges in projects, experience, and education.
export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

// Formats a date range. If end is omitted, renders as "Present".
// Matches the em-dash separator used throughout the resume.
export function formatDateRange(start: string, end?: string): string {
  return `${formatMonthYear(start)} — ${end ? formatMonthYear(end) : "Present"}`;
}
