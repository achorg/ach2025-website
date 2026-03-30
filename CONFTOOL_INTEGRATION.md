# ConfTool Integration - Implementation Summary

## What's Been Set Up

Your 11ty website now has a ConfTool REST integration that exports session data during the build process and makes it available to the schedule page.

### Files Created/Modified

#### Core Implementation
- **`.eleventy.js`** — Updated with dotenv loading and date filter
- **`_data/conftool.js`** — Main data fetcher (runs at build time)
- **`lib/conftool-fetcher.js`** — REST export helper with nonce/passhash auth and caching

#### Schedule Pages (Bilingual)
- **`en/schedule.md`** — English schedule page
- **`es/cronograma.md`** — Spanish schedule page

#### Configuration & Documentation
- **`.env.example`** — Template for environment variables
- **`CONFTOOL_SETUP.md`** — Complete setup guide
- **`.gitignore`** — Updated to ignore `.env` and `.cache/`
- **`package.json`** — Added `dotenv` and `node-fetch` dependencies

### How to Get Started

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Enable the ConfTool REST Interface
1. Log into your ConfTool admin panel
2. Go to Overview → Data Import and Export → Integrations With Other Systems
3. Enable the general REST interface
4. Set a shared passphrase

#### Step 3: Configure Environment
Create `.env` in the project root:
```
CONFTOOL_REST_URL=https://www.conftool.pro/ach2026/rest.php
CONFTOOL_SHARED_SECRET=your_shared_secret_here
```

#### Step 4: Build and Deploy
```bash
npm run build
```

The schedule pages are now available at:
- `/en/schedule/`
- `/es/cronograma/`

### Key Features

✅ **Build-Time Fetching** — Data is exported once during build, not on every request
✅ **Smart Caching** — 24-hour cache prevents excessive API calls
✅ **Error Handling** — Gracefully falls back if API is unavailable
✅ **Bilingual** — English and Spanish schedule pages included
✅ **No Database** — Pure static site generation
✅ **CI/CD Ready** — Environment variables work with Netlify, GitHub Actions, etc.
✅ **ConfTool-Compatible Auth** — Uses ConfTool's documented nonce + SHA256 passhash flow

### What Gets Fetched

The integration currently exports:
- `sessions` — Conference session schedule data via `page=adminExport&export_select=sessions`

You can customize what data is fetched by editing `_data/conftool.js`.

### Template Usage

In any Nunjucks template, the ConfTool data is available as `conftool`:

```njk
{% if conftool.sessions %}
  {% for session in conftool.sessions %}
    <h3>{{ session.title }}</h3>
  {% endfor %}
{% endif %}
```

Available properties:
- `conftool.sessions` — Array of session objects
- `conftool.rawSessions` — Parsed XML export payload from ConfTool
- `conftool.fetchedAt` — ISO timestamp of last fetch
- `conftool.isConfigured` — Boolean indicating if API is configured
- `conftool.error` — Error message if fetch failed

### Deployment

#### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add environment variables:
  - `CONFTOOL_REST_URL` = your ConfTool REST URL
  - `CONFTOOL_SHARED_SECRET` = your shared secret
3. Trigger a new deploy

#### GitHub Actions / Other CI/CD
Set environment variables in your CI/CD platform's secrets, then use them in your build step.

### Customization

#### Change Update Frequency
Edit the cache duration in `_data/lib/conftool-fetcher.js`:
```javascript
this.cacheDuration = 24 * 60 * 60 * 1000; // Change this line
```

#### Filter Data
Modify `_data/conftool.js` to filter sessions:
```javascript
const sessions = (data.sessions || []).filter(s => s.status === 'accepted');
```

#### Fetch Additional Data
Add more exports to `fetchMultiple()` in `_data/conftool.js`:
```javascript
const data = await fetcher.fetchMultiple([
  {
    key: 'sessionsExport',
    exportSelect: 'sessions',
    extraParams: {
      'form_export_sessions_options[]': ['all']
    }
  }
]);
```

### Troubleshooting

**Problem:** Builds fail without API key
**Solution:** This is expected. Create `.env` with your REST URL and shared secret.

**Problem:** Schedule pages show "Unable to load"
**Solution:** Check `.env` has correct `CONFTOOL_REST_URL` and `CONFTOOL_SHARED_SECRET`.

**Problem:** Data is stale
**Solution:** Manually trigger a rebuild on your deployment platform or wait 24 hours for cache refresh.

### Next Steps

1. ✅ Run `npm install`
2. ✅ Create `.env` with your ConfTool REST URL and shared secret
3. ✅ Run `npm run build`
4. ✅ Visit `/en/schedule/` and `/es/cronograma/` to see the data
5. ✅ Customize the schedule page templates if desired
6. ✅ Deploy to production with environment variables configured

### Support Resources

- [ConfTool API Documentation](https://www.conftool.pro)
- [Eleventy Documentation](https://www.11ty.dev)
- See `CONFTOOL_SETUP.md` for detailed technical information

---

**Questions?** Check the log output during build time for detailed information about what's being fetched and any errors.
