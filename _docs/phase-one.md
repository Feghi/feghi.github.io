# Phase 1: personal archive shell

Jekyll 3.9, Markdown, Liquid and SCSS remain the build stack. No runtime dependencies were added.

## Compatibility

- `_config.yml`, `_posts`, `_Hannah_bada`, post permalinks and bare/resume layouts are unchanged.
- The homepage still uses `paginator.posts` (seven per page); `/page2`, etc. retain the same entries and paths.
- Archive links to the existing `/category/` browser for Phase 1. Categories, tags, series, resume, RSS and About remain accessible.
- Research, Projects and Lab are deliberately non-link “coming soon” labels until their pages are implemented. No applications or empty destination pages are generated.
- Search has one result container and deferred initialization, replacing the previous duplicate IDs and inline jQuery race.
- Grouped archives load one pagination library after jQuery, rather than racing two competing plugins. Series controls use the same collection label as their target panels.
- Existing post markup and comments' pathname-based issue mapping remain intact. The shell synchronizes the Utterances theme through its message API.

## Content presentation

`_includes/content-type.html` prefers explicit `type`. Without it, legacy tags `독후감`, `레시피`, `머미` map to book, recipe and mystery; `paper_review` maps to research, with diary as the fallback. This affects cards/counts only. Posts are never rewritten. Statistics scan Jekyll collection documents once (including posts); no invented project data is shown.

## Theme and activity

Tokens live in `_sass/base/_tokens.scss`; layout, cards, calendar and page adjustments have separate partials. New selectors are scoped to `.site-shell`, with small overrides to legacy styles. The resume does not load the new stylesheet or theme script.

`theme.js` reads `fe-theme` before styles load, follows the OS when no preference exists, tolerates blocked storage, and honors live OS/storage changes. Remove the key to return to the OS preference. Reduced-motion settings disable transitions.

Cards display an existing Markdown H1 when available, falling back to Jekyll's title. Post-page titles, content, URLs and feed titles are unchanged.

The activity JSON uses Jekyll dates/URLs and escapes `<` for safe script embedding. The calendar uses UTC arithmetic, including leap years, defaults to the build year, and offers older years with posts. One-post days link directly; multi-post days reveal a keyboard-accessible list. Zero-post days expose native date/count tooltips. With JavaScript disabled, a link to the archive remains available.

## Verification

Run `bundle install`, then `bundle exec jekyll build` and `bundle exec jekyll serve --host 127.0.0.1`. Check desktop/mobile, light/dark, theme persistence, search, both single/multiple-post days, leap years, page two, old/new posts, category/tag/series, and the bare resume. Compare output routes and article bodies against a baseline build.

Baseline build reports malformed YAML in several existing `_Hannah_bada` entries. Those source files are deliberately unchanged under the content-preservation requirement.

Run `node _checks/compatibility.cjs <baseline-directory>` after a plain build (not a development-server rebuild, which changes the host). It verifies output paths, rendered article bodies, comment mappings, RSS except build timestamps, search data, sitemap URLs and pagination membership/order.
