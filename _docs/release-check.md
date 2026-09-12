# Digital archive release check

Validated on 2026-09-12 before publishing to GitHub Pages.

## Browser coverage

Checked 17 representative routes at desktop and 390px mobile widths, with light
and dark preferences. The resume deliberately keeps its independent light layout.
Routes: home, archive, books, recipes, mystery, research, projects, lab, about,
categories, tags, series, resume, page2, page3, a mystery post and a recipe post.
This is layout/template coverage, not a manual reading of every historical post.

- No page-level horizontal overflow after fixing the resume's fixed 748px width.
- No broken images detected on the checked routes.
- Archive search, no-results, clear filters and type filtering work.
- Global search returns results; theme selection persists across navigation.
- Research publication disclosure exposes all 16 records.
- Activity calendar renders 366 cells for 2024, shows both posts on 2025-07-30,
  and a single-post day navigates to the unchanged post URL.
- Reduced-motion CSS remains in place. No new browser dependencies were added.

## Automated checks

```sh
bundle exec jekyll build
bundle exec ruby _checks/archive.rb
bundle exec ruby _checks/portfolio.rb
node _checks/compatibility.cjs /path/to/original-jekyll-output
git diff --check
```

The compatibility check retained all 1,056 baseline output files, 253 article
bodies and comment mappings, and the entries on all three pagination pages.
RSS item content and dates, search data and sitemap paths are preserved. RSS and
sitemap URLs now use the configured production origin exactly once. Feed XML was
parsed successfully with ten items.

Existing `_Hannah_bada` YAML parse warnings predate this redesign. The build
completes; these source files have intentionally not been edited. Likewise, old
post titles, spelling and embedded content remain unchanged.

## Design and deployment notes

The editorial layer uses existing fonts, monochrome tokens, generous spacing and
thin rules, with the activity graph retaining its green intensity scale. About
uses existing personal data and photography. The resume's only change is a
small-screen `screen` media query; desktop and print styling remain unchanged.

Commit and push to the existing `master` branch, then verify the GitHub Pages
workflow for that exact commit and check the live navigation and feed. Lab tools
are explicitly marked as placeholders and are not interactive applications.
