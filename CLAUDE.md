# ACH 2026 Website — Claude Code Instructions

Website for the ACH 2026 annual conference (Association for Computers and the Humanities), virtual, June 24–26 2026, theme: "Emergence/ia". Built with Eleventy v3.1.5.

## Build Commands

```bash
npm run build   # one-shot build → _site/
npm run serve   # dev server with live reload at localhost:8080
```

**Never edit `_site/` directly** — it is generated output and is overwritten on every build.

## Project Structure

```
_data/          # Global data files (YAML, JS): settings, navigation, ConfTool, FAQs, people
_includes/      # Nunjucks layouts and HTML partials
assets/         # CSS, JS, images, vendor libraries
en/             # English content (primary locale)
es/             # Spanish content (full translation)
fr/             # French content (partial)
admin/          # Netlify CMS config
_site/          # BUILD OUTPUT — never edit
.eleventy.js    # Eleventy config: plugins, filters, passthrough copies
netlify.toml    # Netlify build config and URL redirects
```

## Tech Stack

- **Static site generator**: Eleventy (11ty) v3.1.5
- **Templating**: Nunjucks (`.njk`) and Markdown (`.md`)
- **CSS framework**: Bootstrap 5 via BootstrapMade "TheEvent" template v4.9.1
- **Animations**: AOS (Animate On Scroll)
- **Search**: Pagefind (post-build index)
- **Hosting/CI**: Netlify (build command: `npx eleventy`, publish dir: `_site/`)

## Design System

### Color Palette

| Name      | Hex       | Usage                                  |
|-----------|-----------|----------------------------------------|
| Navy      | `#1C1832` | Hero background, hover link color      |
| Gold      | `#F6C500` | `.ach` branding class, accent          |
| Slate     | `#67848b` | Default link color, secondary text     |
| Deep blue | `#0e1b4d` | All `h1`–`h6` heading color           |

Do not introduce new brand colors. All overrides go in `assets/css/style.css`.

### Typography

- **Body text**: "Open Sans" (sans-serif)
- **Headings** (`h1`–`h6`): "Raleway" (sans-serif, weight 400)
- **ACH branding**: "Lateef" serif, lowercase, gold — CSS class `.ach` (e.g. `<span class="ach">ach</span>2026`)

### Layout Conventions

- Use Bootstrap 5 grid: `col-lg-*`, `col-md-*`, etc.
- Wrap page content sections in `<section>` → `<div class="container" data-aos="fade-up">`
- Section titles use the `.section-header` div with an `<h2>` inside
- Content pages using the `page` layout automatically get a colored header spacer
- Avoid inline styles except for the hero/background overrides already in `en/index.njk`
- Do not add new CSS if Bootstrap 5 utilities or existing classes are sufficient

### Vendor Libraries

Files in `assets/vendor/` **must not be modified**. Included libraries:
`aos`, `bootstrap`, `bootstrap-icons`, `glightbox`, `swiper`, `php-email-form`

---

## Templating

### Layout Hierarchy

```
base.njk       ← home page layout (full <head> with AOS/Bootstrap vendor scripts)
default.njk    ← most content pages (same structure, slightly different <head>)
page.njk       ← extends base.njk; adds .section-header wrapper for prose pages
keynote.njk    ← extends base.njk; speaker card layout
```

Set layout in front matter: `layout: page` (or `default`, `keynote`).

### Required Front Matter

Every content file needs at minimum:

```yaml
---
title: Page Title
layout: page
description: "SEO meta description (used in <meta name=description>)"
---
```

The `lang` attribute (`page.lang`) is set automatically by Eleventy's i18n plugin from the folder (`en/` → `"en"`, `es/` → `"es"`, `fr/` → `"fr"`).

### Nunjucks in Markdown Files

To use Nunjucks template syntax inside a `.md` file, add to front matter:

```yaml
templateEngineOverride: njk
```

### Custom Nunjucks Filters (defined in `.eleventy.js`)

- `groupbyProp(arr, prop)` — groups an array of objects by a property value
- `dateFilter(dateString)` — formats an ISO date string to English long format
- `dateFilterEs(dateString)` — formats an ISO date string to Spanish long format

---

## Internationalization (i18n)

**Every English page must have a Spanish equivalent.** French is partial.

| Folder | Language | Completeness          |
|--------|----------|-----------------------|
| `en/`  | English  | Primary — always full |
| `es/`  | Spanish  | Full translation       |
| `fr/`  | French   | Partial (cfp, keynote, safety, work-adventure, policies) |

URL structure: `/en/page-name`, `/es/nombre-pagina`, `/fr/nom-page`

When adding a new page:
1. Create it in `en/` first
2. Create the translated version in `es/` (and `fr/` if applicable)
3. Add nav entries to both `_data/en_navigation.yaml` and `_data/es_navigation.yaml`

The Eleventy i18n plugin (`@11ty/eleventy-plugin-i18n`) handles routing. Language is detected from the folder, not from file-level front matter.

---

## Navigation

Navigation is data-driven — **do not hardcode nav links in templates**.

- `_data/en_navigation.yaml` — English navbar items (supports nested `dropdown` lists)
- `_data/es_navigation.yaml` — Spanish navbar (parallel structure)

To add a nav item, update both files. To temporarily hide an item, comment it out with `#` — do not delete it.

---

## Feature Flags

Sections are shown or hidden via `_data/settings.yaml`. Check this file before adding new sections.

```yaml
about: true
program: false    # set true when program is ready to publish
speakers: false
partners: false
faq: false
```

In templates: `{% if settings.program %}...{% endif %}`. Use these flags rather than removing template code.

---

## ConfTool Session Data

Session and program data is fetched **at build time** from the ConfTool REST API via `_data/conftool.js`. It is available in all templates as the `conftool` object.

Key properties:

| Property | Description |
|----------|-------------|
| `conftool.normalizedSessions` | Array of sessions with times pre-converted to CDT, ET, PT, BRT, UTC |
| `conftool.totalPapers` | Count of accepted papers |
| `conftool.totalSessions` | Count of sessions |
| `conftool.uniqueDays` | Number of conference days |
| `conftool.totalTopics` | Count of distinct topic tags |
| `conftool.allTopics` | Deduplicated array of topic strings |
| `conftool.fetchedAt` | ISO timestamp of last successful fetch |
| `conftool.error` | Error message string if the API call failed (check before rendering) |

**Do not hardcode session, paper, or schedule data in templates or markdown.** Always read from `conftool.*`.

See `CONFTOOL_SETUP.md` for environment variable setup and `CONFTOOL_INTEGRATION.md` for implementation details.

---

## People / Committee Data

Committee members are in `_data/people.yaml`. Each entry has bilingual fields:
- `role` — English role title
- `role_es` — Spanish role title

The `en/people.njk` and `es/gente.njk` templates render this data automatically. Add new members to `people.yaml`, not to the templates.

---

## URL Redirects

Redirects live in `netlify.toml`. When renaming a page or adding a new URL that replaces an old one, add a redirect entry. Existing redirects handle:
- `/schedule` → `/en/program`
- `/cronograma` → `/es/programa`
- Language negotiation via `Accept-Language` header (routes to `/es/`, `/fr/`, `/en/`)

---

## What Not To Do

- Edit `_site/` — it is build output
- Modify files in `assets/vendor/`
- Hardcode session/schedule data — use `conftool.*`
- Delete i18n routes — every English page needs a Spanish version
- Add new npm dependencies if Bootstrap 5 or existing vendor libs cover the need
- Use inline styles for colors or typography — use CSS classes or `assets/css/style.css`
- Delete commented-out navigation items — they record intentional deferments
