# ACH 2026 Website — Agent Instructions

Website for the ACH 2026 conference (Association for Computers and the Humanities), virtual, June 24–26 2026. Built with Eleventy (11ty) v3.1.5. See `CLAUDE.md` for the full reference — this file is a condensed summary.

## Essential Commands

```bash
npm run build   # build → _site/
npm run serve   # dev server at localhost:8080
```

**`_site/` is generated output. Never edit it directly.**

## Stack at a Glance

- Eleventy 3.1.5 with Nunjucks + Markdown
- Bootstrap 5 (BootstrapMade "TheEvent" template v4.9.1)
- AOS for scroll animations, Pagefind for search
- Deployed on Netlify; redirects in `netlify.toml`

## Critical Rules

### 1. Three-language site
Every English page (`en/`) needs a Spanish equivalent (`es/`). French (`fr/`) is partial. The `lang` value comes from the folder — do not set it in front matter.

### 2. Navigation is data-driven
Edit `_data/en_navigation.yaml` and `_data/es_navigation.yaml`. Do not hardcode nav links in templates. Comment out items to hide them; do not delete.

### 3. Feature flags control section visibility
`_data/settings.yaml` has boolean flags (`about`, `program`, `speakers`, `partners`, `faq`). Gate new sections with `{% if settings.flagName %}` rather than removing code.

### 4. Session data comes from ConfTool at build time
`_data/conftool.js` fetches the program from the ConfTool REST API. Use `conftool.normalizedSessions`, `conftool.totalPapers`, etc. in templates. Never hardcode schedule data.

### 5. Never touch vendor files
`assets/vendor/` contains Bootstrap, AOS, Glightbox, Swiper, Bootstrap Icons. Do not modify these files.

## Design Tokens

| Token     | Value     |
|-----------|-----------|
| Primary   | `#1C1832` |
| Accent    | `#F6C500` |
| Secondary | `#67848b` |
| Headings  | `#0e1b4d` |

Body font: Open Sans. Headings: Raleway. ACH branding: `.ach` class (Lateef, lowercase, gold).

## Layouts

- `base.njk` — home page (full vendor scripts in `<head>`)
- `default.njk` — standard content pages
- `page.njk` — prose pages with `.section-header` wrapper
- `keynote.njk` — speaker card pages

Required front matter: `title`, `layout`, `description`. Add `templateEngineOverride: njk` to use Nunjucks inside `.md` files.

## Custom Eleventy Filters

Defined in `.eleventy.js`:
- `groupbyProp(arr, prop)`
- `dateFilter(dateString)` — English date format
- `dateFilterEs(dateString)` — Spanish date format

## Data Files

| File | Purpose |
|------|---------|
| `_data/settings.yaml` | Feature flags |
| `_data/en_navigation.yaml` | English nav |
| `_data/es_navigation.yaml` | Spanish nav |
| `_data/people.yaml` | Committee members (bilingual: `role` / `role_es`) |
| `_data/conftool.js` | Build-time ConfTool API fetcher |
| `_data/en_faq.yaml` / `_data/es_faq.yaml` | FAQ content |

## When Adding a New Page

1. Create the page in `en/` with required front matter
2. Create the Spanish version in `es/`
3. Add to `_data/en_navigation.yaml` and `_data/es_navigation.yaml`
4. Add a redirect in `netlify.toml` if replacing an existing URL
