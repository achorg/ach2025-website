# ACH 2026 Website — Copilot Instructions

This is an Eleventy (11ty) v3.1.5 static site for the ACH 2026 conference. Templating uses Nunjucks and Markdown. Deployed on Netlify.

## Build

```bash
npm run build   # outputs to _site/
npm run serve   # dev server with live reload
```

`_site/` is generated. Never suggest edits there.

## Design System

- **Framework**: Bootstrap 5 (BootstrapMade TheEvent template v4.9.1)
- **Primary color**: `#1C1832` (navy)
- **Accent color**: `#F6C500` (gold) — used via `.ach` CSS class
- **Link/secondary color**: `#67848b`
- **Heading color**: `#0e1b4d`
- **Body font**: Open Sans; **Heading font**: Raleway; **Branding**: Lateef (`.ach` class, lowercase)
- Use `data-aos="fade-up"` on section container divs for scroll animations
- Do not modify `assets/vendor/` — contains Bootstrap, AOS, Glightbox, Swiper, Bootstrap Icons

## Layouts and Templates

Layouts are in `_includes/`: `base.njk`, `default.njk`, `page.njk`, `keynote.njk`.

Every content file needs front matter:
```yaml
---
title: Title Here
layout: page
description: "Meta description"
---
```

To use Nunjucks syntax in a `.md` file, add `templateEngineOverride: njk` to front matter.

Custom Nunjucks filters (in `.eleventy.js`): `groupbyProp`, `dateFilter`, `dateFilterEs`.

## i18n

- `en/` — English (primary, always complete)
- `es/` — Spanish (full translation required for every English page)
- `fr/` — French (partial)

`page.lang` is set automatically from the folder. Navigation lives in `_data/en_navigation.yaml` and `_data/es_navigation.yaml` — update both when adding pages.

## Data Files

- `_data/settings.yaml` — boolean feature flags (`about`, `program`, `speakers`, `partners`, `faq`); gate sections with `{% if settings.flagName %}`
- `_data/conftool.js` — fetches session data from ConfTool REST API at build time; use `conftool.normalizedSessions`, `conftool.totalPapers`, etc. in templates; never hardcode schedule data
- `_data/people.yaml` — committee members with bilingual `role` / `role_es` fields
- `_data/en_navigation.yaml`, `_data/es_navigation.yaml` — navbar items (supports `dropdown` lists)

## Adding a New Page Checklist

1. Create `en/page-name.md` (or `.njk`) with required front matter
2. Create `es/nombre-pagina.md` (Spanish translation)
3. Add nav entries to `_data/en_navigation.yaml` and `_data/es_navigation.yaml`
4. Add a redirect in `netlify.toml` if replacing a previously published URL
5. If gating the page behind a feature flag, add it to `_data/settings.yaml`

## What to Avoid

- Editing `_site/` (build output)
- Modifying `assets/vendor/` files
- Hardcoding session or schedule data (use `conftool.*`)
- Adding inline styles for colors or typography
- Installing new JS/CSS libraries if Bootstrap 5 or existing vendors suffice
- Deleting commented-out navigation items (they record deferred content)
