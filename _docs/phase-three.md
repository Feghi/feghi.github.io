# Phase 3: Research, Projects and Lab

## Pages

- `/research/`: research interests, publications, research projects, teaching, and links to the original resume and research notes. Three recent publications are visible initially; the rest are in a native `details` disclosure that works without JavaScript.
- `/projects/`: software project cards with independent GitHub, demo and optional source links.
- `/lab/`: six explicitly unavailable tools: CSV Explorer, Statistical Test Helper, JSON Formatter, QR Generator, Markdown Preview and Text Diff. These are informational placeholders, not functioning tools or disabled links to nonexistent routes.
- All six main navigation items now have real destinations. No existing routes were moved.

The homepage Projects count now reflects the software catalog in `_data/projects.yml`; project-typed posts remain archive entries rather than being counted again as software projects.

## Data and provenance

`_data/publications.yml` contains the 10 journal papers and six international conference entries already listed in the resume. Titles, venues and years come from that file; author order, DOIs and paper URLs have not been inferred. Domestic conference entries remain available in the original resume.

`_data/research.yml` contains interests from `_data/me.yml`, the existing 2020 doctoral thesis and its original RISS link, the existing Scholar profile link, and the documented 2020 R/Python teaching course. No currently-held position is asserted from the resume's open-ended date ranges.

`_data/projects.yml` initially contains this repository's `fe.flag` project. Its year is the blog's original start year (2020); the homepage demo points to `/`, which respects Jekyll's `baseurl`. No unrelated GitHub projects were imported or invented.

`_data/lab.yml` is the requested six-tool roadmap. Editing a description does not implement a tool.

## Supported metadata

```yaml
# _data/projects.yml (list)
- title: Project title
  description: A short description
  year: 2026
  status: Active
  technologies: [Python, JavaScript]
  github: https://github.com/owner/repository
  demo: /lab/example/
  image: /assets/img/example.png
  image_alt: Project interface
```

Only `title` is essential to a useful card. Missing optional fields do not produce empty links, broken image elements or dummy values. Use valid root-relative paths or HTTP(S) URLs; `data-url.html` omits unsupported URL schemes. Research project cards also accept `source_url` and `source_label`.

```yaml
# _data/publications.yml (list)
- title: Paper title
  venue: Journal or conference
  year: 2026
  kind: Journal
  category: SCI
  authors: [First Author, Second Author]
  url: https://example.org/paper
```

Publications are sorted newest first. `authors`, `kind`, `category` and `url` are optional. Do not add a DOI or authors without confirming them.

Research keys are `introduction`, `scholar`, `interests` (text list), `projects` (project-card records), and `teaching` (list with `title`, `institution`, `period`, `description`, and optional `topics`). Empty research/project lists have explicit empty states.

## Implementation and verification

New includes: `portfolio-intro.html`, `project-card.html`, `publication-item.html`, `data-url.html`. New SCSS: `_sass/pages/_portfolio.scss`, using the existing theme tokens. No JavaScript, runtime library, build dependency, service or database was added.

```text
bundle exec jekyll build
bundle exec ruby _checks/portfolio.rb
bundle exec ruby _checks/archive.rb
node _checks/compatibility.cjs <original-baseline-build-directory>
```

Portfolio fixture checks use isolated temporary sites for optional metadata, escaped text, safe data links, images, baseurl, publication ordering and disclosure, empty states and Lab placeholders. Existing posts, the resume, config and collection documents remain untouched. The pre-existing `_Hannah_bada` YAML warnings are unchanged.
