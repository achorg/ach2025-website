# ConfTool Integration Setup

This site uses the ConfTool REST API to automatically fetch and display the conference schedule during the build process.

## Configuration

### 1. Set Up Environment Variables

Create a `.env` file in the root directory with your ConfTool REST credentials (use `.env.example` as a template):

```
CONFTOOL_REST_URL=https://www.conftool.pro/ach2026/rest.php
CONFTOOL_SHARED_SECRET=your_shared_secret_here
```

**Important for Netlify/CI/CD:**
- Add these environment variables to your deployment platform's settings
- Never commit `.env` to git (it's already in `.gitignore`)

### 2. Enable the ConfTool REST Interface

To enable REST access in ConfTool Pro:

1. Log in to your ConfTool instance as an administrator
2. Navigate to **Overview** → **Data Import and Export** → **Integrations With Other Systems**
3. Enable the general REST interface
4. Set a shared passphrase of at least 8 characters
5. Copy the REST URL shown by ConfTool and store it in your `.env` file as `CONFTOOL_REST_URL`
6. Store the shared passphrase in your `.env` file as `CONFTOOL_SHARED_SECRET`

### 3. Install Dependencies

```bash
npm install
```

This installs the required packages including `dotenv`, `node-fetch`, and `fast-xml-parser`.

## How It Works

### Build-Time Data Fetching

When you build the site, Eleventy automatically:

1. Loads the `_data/conftool.js` file
2. Calls the ConfTool REST endpoint with a unique nonce and SHA256 passhash
3. Makes the data available to all templates as `conftool` global data
4. Gracefully falls back if the API is unavailable

### Using the Data in Templates

The ConfTool data is available in any Nunjucks template as `conftool` object:

```njk
{% if conftool.sessions %}
  {% for session in conftool.sessions %}
    <h3>{{ session.title }}</h3>
    <p>{{ session.description }}</p>
  {% endfor %}
{% endif %}
```

### Schedule Pages

- **English:** `en/schedule.md` - Displays the schedule on `/en/schedule/`
- **Spanish:** `es/cronograma.md` - Displays the schedule on `/es/cronograma/`

These pages automatically use the `conftool` global data.

## ConfTool API Endpoints

The integration currently calls:

- `rest.php?page=adminExport&export_select=sessions...` - Exports session schedule data as XML

### Customizing the API Query

Edit `_data/conftool.js` to modify what data is fetched:

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

See the ConfTool forum documentation at https://www.conftool.net/ctforum/index.php/topic,280.0.html for the REST authentication flow and export parameters.

## Troubleshooting

### Build Fails with "CONFTOOL_SHARED_SECRET not set"

This is expected in development without a `.env` file. The build will continue and display a fallback message on the schedule pages.

To use actual ConfTool data:
1. Create a `.env` file with your REST URL and shared secret
2. Run `npm run build` again

### No Data Appears on Schedule Pages

1. **Check the shared secret**: Ensure `CONFTOOL_SHARED_SECRET` matches the passphrase configured in ConfTool
2. **Check the endpoint**: Verify `CONFTOOL_REST_URL` matches your ConfTool `rest.php` URL
3. **Test the API**: Try accessing the API directly in your browser to verify it returns data
4. **Check build output**: Look for error messages in the 11ty build logs

### Authentication Errors

If you see authentication errors:
1. Verify the REST interface is enabled in ConfTool
2. Verify your shared secret matches the passphrase set in ConfTool
3. If needed, save a new shared secret in ConfTool to reset the nonce sequence

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `CONFTOOL_SHARED_SECRET` | Yes | `your-secret-passphrase` |
| `CONFTOOL_REST_URL` | Yes | `https://www.conftool.pro/ach2026/rest.php` |

## Caching & Performance

- Data is fetched **once per build**, not per request
- This is optimal for static site generation
- To force a refresh: trigger a new build on your deployment platform
- For frequent updates: set up a webhook to trigger rebuilds

## Advanced: Filtering Data

Modify `_data/conftool.js` to filter sessions by:

- Event date
- Speaker
- Session type
- Track/Topic
- Status (accepted, rejected, etc.)

Example:

```javascript
// Filter for accepted sessions only
const sessions = await conftoolResponse.json();
return {
  sessions: sessions.filter(s => s.status === 'accepted'),
  // ...
};
```

## Support

For questions about:
- **ConfTool API**: Check [ConfTool documentation](https://www.conftool.pro) or contact ConfTool support
- **Eleventy config**: See [Eleventy documentation](https://www.11ty.dev)
- **This integration**: Review `_data/conftool.js` and `.eleventy.js`
