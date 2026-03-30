/**
 * Fetch conference data from ConfTool REST API
 * This runs at build time to populate schedule/sessions data
 * 
 * Data is cached locally for 24 hours to improve build performance
 * and to handle temporary API unavailability gracefully
 */

require('dotenv').config();
const ConfToolFetcher = require('../lib/conftool-fetcher');

module.exports = async function() {
  const sharedSecret = process.env.CONFTOOL_SHARED_SECRET;
  const restUrl = process.env.CONFTOOL_REST_URL || 'https://www.conftool.pro/ach2026/rest.php';

  if (!sharedSecret) {
    console.warn('⚠️  CONFTOOL_SHARED_SECRET not set. Skipping ConfTool data fetch.');
    console.warn('   Set the environment variable to enable ConfTool integration.');
    return {
      sessions: [],
      rawSessions: null,
      isConfigured: false
    };
  }

  try {
    const fetcher = new ConfToolFetcher(sharedSecret, restUrl);
    const data = await fetcher.fetchMultiple([
      {
        key: 'sessionsExport',
        exportSelect: 'sessions',
        extraParams: {
          'form_export_sessions_options[]': ['all']
        }
      }
    ]);

    const sessionsExport = data.sessionsExport;
    const sessions = Array.isArray(sessionsExport?.records) ? sessionsExport.records : [];

    console.log(`✅ ConfTool data ready: ${sessions.length} sessions`);

    return {
      sessions,
      rawSessions: sessionsExport?.xml || null,
      fetchedAt: new Date().toISOString(),
      source: 'ConfTool REST API',
      restUrl,
      isConfigured: true
    };
  } catch (error) {
    console.error('❌ Error setting up ConfTool fetcher:', error.message);
    return {
      sessions: [],
      rawSessions: null,
      error: error.message,
      isConfigured: false
    };
  }
};

