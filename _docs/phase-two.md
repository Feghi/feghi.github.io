# Phase 2: Archive and Books

## Scope

- `/archive/`: all posts and explicitly typed documents from output-enabled collections.
- `/archive/books/`, `/archive/recipes/`, `/archive/mystery/`: type-specific lists.
- Search by display title, original title, tags, categories and book author/genre/medium; filter by year and (on All entries) type. Filters are reflected in the URL for bookmarking and are restored on reload.
- Book totals, average rating, number rated, years represented, books by year and rating distribution are rendered at build time in accessible tables. They describe the whole bookshelf; list filters do not change the statistics.
- Research, Projects and Lab remain future phases.

The Phase 1 design tokens and card layout are reused. No library, service, database or framework was added. All lists/statistics remain readable without JavaScript; enhancement controls are hidden until initialized.

## Adding metadata to a new post

```yaml
---
type: book
book:
  title: "Book title"
  author: "Author name"
  rating: 4.5
  genre: "Fiction"
  medium: "Paper" # any descriptive text, e.g. Ebook or Audiobook
  finished: "2026-09-12"
---
```

Every `book` field is optional. A `type: book` post shows supplied metadata before its original Markdown body. Book cards use `book.title`, then an existing H1, then Jekyll's title. `rating` uses the 0–5 scale; use a YAML number. Zero is a valid rating, while missing/malformed/out-of-range values are excluded from averages and distributions. Distribution buckets are 0–<1, 1–<2, 2–<3, 3–<4, 4–<5 and exactly 5. Unrated averages show `—`, never an invented zero.

Use an ISO `YYYY-MM-DD` completion date. Books are counted by completion year when parseable, otherwise by post year. This is a record/review count, not deduplicated unique titles: a second review or reread is a second entry. All-entry/recipe/mystery filters use the publication year. Lists remain in newest-publication-first order.

Explicit `type` wins over legacy tags. Existing `독후감`, `레시피`, `머미` tags and the `paper_review` category still work. Unknown or missing types do not break rendering; unclassified posts use the Phase 1 diary fallback. Untyped series documents stay in `/series/`.

No existing post or collection document was edited to add metadata. Existing post URLs, category/tag/series pages, resume, comment issue mappings, feeds and homepage pagination remain in place. The sitemap now additionally includes the four Archive pages.

## Implementation

- `_layouts/archive.html` and `archive/**/index.html`: one reusable layout and four explicit routes.
- `_includes/archive-items.html`, `archive-tabs.html`: shared public document source and navigation.
- `_includes/card-title.html`, `book-rating.html`, `book-year.html`, `book-stats.html`, `book-metadata.html`: shared presentation and statistics rules.
- `_sass/pages/_archive.scss`: archive-specific styles using existing variables.
- `assets/js/archive-browser.js`: browser-only list filtering with keyboard-friendly native controls and live result counts.

## Verification

```text
bundle exec jekyll build
bundle exec ruby _checks/archive.rb
node _checks/compatibility.cjs <original-baseline-build-directory>
node --check assets/js/archive-browser.js
```

The fixture check builds isolated temporary sites and never touches real posts. It covers numeric zero, decimal ratings, missing/invalid values, completion-year fallback, typed public collections, excluded private/untyped collections, metadata escaping, a non-empty baseurl, explicit type precedence and an empty archive. The original compatibility checker allows new sitemap entries but rejects missing existing URLs.

Manually verify desktop/mobile light and dark modes; combined search/year/type filters; no-result/reset behavior; reload of a filtered URL; direct card navigation; and all four Archive tabs. The existing `_Hannah_bada` YAML warnings predate the redesign and remain untouched.
