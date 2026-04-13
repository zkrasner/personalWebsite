# Adding a Project

How to add a new entry to `/projects` and (optionally) link to it from the Experience section.

## TL;DR checklist

<details><summary>Quick reference for repeat additions</summary>

1. Add an entry to `projects` in `src/data/projects.ts`
2. (Optional) Capture a screenshot to `public/projects/{slug}.png` and set `coverImage`
3. (Optional) Add the slug to a Role bullet's `products` array in `src/data/resume.ts` to link from Experience
4. Run `npm run build` and verify the new pages are listed under `/projects/[slug]`
5. Spot-check `/projects` and the new detail page in dev or via `npx serve out`

</details>

## 1. Decide what kind of project this is

<details><summary>Work, side, or both?</summary>

- `type: "work"` — built as part of a job. Set `company` to the matching `companyKey` from `src/data/resume.ts` (e.g. `"grassroots"`).
- `type: "side"` — personal or independent. No company.

Most projects belong to exactly one of these.

</details>

## 2. Write the project entry

<details><summary>Required fields</summary>

```ts
{
  slug: "my-project",         // URL segment, lowercase, hyphenated
  title: "My Project",
  tagline: "One-line pitch",  // Italic muted subtitle on cards
  description: "2-3 sentence summary that appears on the card.",
  type: "work",               // or "side"
  status: "live",             // wip | live | archived
  startDate: "2024-03",       // YYYY-MM
  tech: { /* see step 3 */ },
}
```

</details>

<details><summary>Optional but recommended fields</summary>

- `endDate: "YYYY-MM"` — omit if ongoing (renders as "Present")
- `role: "Solo"` or `"Tech Lead"` — your specific contribution, surfaces in the meta row
- `teamSize: 4` — including yourself
- `company: "grassroots"` — for work projects, ties to a `companyKey` in resume.ts
- `coverImage: "/projects/my-project.png"` — see step 5
- `links: [{ label: "Live site", url: "https://..." }]` — labels containing "live" auto-surface as the primary link in the card meta row
- `problem: ["paragraph 1", "paragraph 2"]` — what was broken or needed
- `approach: [...]` — what you built and why
- `outcomes: [...]` — what changed; concrete metrics if you have them
- `metrics: [{ label: "Query time", before: "15 min", after: "< 15 sec" }, { label: "Weekly requests", value: "~10,000" }]` — captured but not yet rendered specially
- `sections: [{ heading: "What's next", body: "..." }]` — freeform content beyond problem/approach/outcomes

</details>

## 3. Categorize the tech stack

<details><summary>Tech categories and what belongs in each</summary>

`ProjectTech` has six optional category arrays:

| Category         | What goes here                                                     | Examples                                       |
| ---------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| `frontend`       | Languages, UI frameworks, client libraries                         | Vue, React, TypeScript, PrimeVue, Mapbox GL    |
| `backend`        | Server languages and frameworks                                    | Python, Flask, Django, Node, FastAPI           |
| `data`           | Databases, query engines, blob storage (label is "Data & Storage") | BigQuery, Firestore, PostgreSQL, Cloud Storage |
| `infrastructure` | Compute, networking, auth, deployment                              | GCP, Cloud Run, Firebase Auth, Secret Manager  |
| `testing`        | Test frameworks and runners                                        | pytest, Vitest, Playwright                     |
| `other`          | Anything else worth highlighting                                   | Docker, GitHub Actions, external APIs          |

Rules of thumb:

- **Skip dev tooling** (npm, ESLint, Prettier, Husky) — too granular for a card chip
- **Skip libraries that are implementation details** (Pydantic, Lodash, Axios) unless they're load-bearing to the story
- **Cross-reference the diagrammer manifest** if the project has one in `../projectDiagrammer/docs/examples/{slug}-manifest.yaml` — the manifest is usually the source of truth for what infra and frameworks the project actually uses

</details>

<details><summary>Adding a tech to the filter dropdown</summary>

The `/projects` page has a tech filter dropdown sourced from `TECH_FILTERS` at the top of `src/data/projects.ts`. It is **curated, not auto-generated** — only add entries that are filter-worthy across multiple projects (Python, React, GCP, etc.). One-off tools don't belong.

</details>

## 4. Write the rich content (problem/approach/outcomes)

<details><summary>Structure and tone</summary>

Each is an array of paragraphs, rendered as `<p>` tags on the detail page in order. The site favors plain prose over bullet lists for these sections.

- **Problem**: what was broken before this project, who suffered, what was the cost of the status quo? Concrete examples (durations, error rates, headcount) land harder than adjectives.
- **Approach**: what you built and the key technical/product decisions. Include the _why_ of unusual choices (e.g. "chose Vue because the team already knew it, not because I preferred it").
- **Outcomes**: what changed afterward. Numbers if you have them. "Still in production X years later" counts.

If the project has a more bloggy story (architecture deep-dive, lessons learned, etc.), use the `sections` array for ad-hoc headings beyond these three.

</details>

<details><summary>Style: avoid em-dashes in prose</summary>

The site reserves em-dashes (—) for date ranges only. In prose, use commas, periods, or rephrase. This is a personal preference but the existing data follows it consistently.

</details>

## 5. Capture a screenshot (optional)

<details><summary>Conventions</summary>

- Capture the live site at **1280×720** (16:9 aspect ratio)
- Save as `public/projects/{slug}.png`
- Set `coverImage: "/projects/{slug}.png"` in the project entry
- The card and detail page render the image automatically; if the file is missing, the image area collapses gracefully

If the project has no live URL or you don't have a good screenshot yet, leave `coverImage` unset and the card stays text-only.

</details>

<details><summary>Future: automation</summary>

Once there are 5+ projects with live URLs, we'll add a `scripts/sync-project-screenshots.ts` script following the `scripts/sync-books.ts` pattern. For now, manual capture is the right tradeoff.

</details>

## 6. Link from Experience (optional)

<details><summary>When and how</summary>

If the project corresponds to a product you built in a Role, you can link to it from the Experience section.

In `src/data/resume.ts`, find the appropriate Role's bullet and add a `products` entry referencing the project's slug:

```ts
{
  text: "Bullet describing what you did at a high level",
  products: [
    {
      name: "My Project",
      slug: "my-project",       // matches projects.ts slug
      description: "Job-context-specific description, may differ from the projects.ts description",
    },
    // ...other products tied to the same bullet
  ],
}
```

Notes:

- The `description` here can (and should) differ from the `description` in projects.ts. This one describes what the project meant in the context of that role; the projects.ts one is the high-level project pitch.
- Without `slug`, the product card still renders but isn't clickable.
- With `slug`, the card gets the accent outline + arrow and links to `/projects/{slug}`.
- All products attached to a bullet render as a 2-column grid directly below that bullet.

</details>

## 7. Verify

<details><summary>Build and spot-check</summary>

```sh
npm run build
```

The build output should list the new page under `● /projects/[slug]` with your slug.

Spot-check:

- `/projects` — new card appears, sorted by `startDate` desc, filterable by type/tech/year
- `/projects/{slug}` — title, meta row, sections, tech stack all render
- Experience section (if you linked it) — product card appears under the right bullet, links to the detail page
- Mobile width — card layout stacks correctly

</details>

## Reference: existing examples

- [`Moosehead`](../src/data/projects.ts) — work project with full sections, metrics, no live URL, linked from Experience
- [`ShoreGrounds`](../src/data/projects.ts) — solo side project with live URL, lighter tech stack
