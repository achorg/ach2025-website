/**
 * Fetch conference data from ConfTool REST API
 * This runs at build time to populate schedule/sessions data
 * 
 * Data is cached locally for 24 hours to improve build performance
 * and to handle temporary API unavailability gracefully
 */

require('dotenv').config();
const ConfToolFetcher = require('../lib/conftool-fetcher');

function firstValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return record[key];
    }
  }
  return '';
}

function splitPeople(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  return String(value)
    .split(/\s*[,;|]\s*/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function collectMatchingValues(record, pattern) {
  return Object.keys(record)
    .filter((key) => pattern.test(key))
    .sort()
    .map((key) => record[key])
    .filter((value) => value !== undefined && value !== null && value !== '');
}

function normalizePapers(record) {
  const titleMatches = Object.keys(record)
    .filter((key) => /paper.*title|presentation.*title|contribution.*title|talk.*title/i.test(key))
    .sort();

  const papers = [];
  for (const titleKey of titleMatches) {
    const index = titleKey.match(/(\d+)/)?.[1] || '';
    const authorKeyCandidates = [
      `paper_author${index}`,
      `paper_authors${index}`,
      `presentation_author${index}`,
      `presentation_authors${index}`,
      `contribution_author${index}`,
      `contribution_authors${index}`,
      `talk_author${index}`,
      `talk_authors${index}`
    ];

    const paperTitle = record[titleKey];
    const paperAuthors = firstValue(record, authorKeyCandidates);

    if (paperTitle) {
      papers.push({
        title: String(paperTitle),
        authors: String(paperAuthors || '')
      });
    }
  }

  return papers;
}

function normalizeSession(record) {
  const date = firstValue(record, ['date', 'session_date', 'form_date', 'start_date', 'day']);
  const time = firstValue(record, ['time', 'session_time', 'time_range', 'slot', 'start_time']);
  const endTime = firstValue(record, ['end_time', 'session_end_time']);
  const title = firstValue(record, ['title', 'session_title', 'name', 'session', 'event_title']);
  const subtitle = firstValue(record, ['subtitle', 'sub_title']);
  const location = firstValue(record, ['virtual_location', 'location', 'room', 'session_room']);
  const locationUrl = firstValue(record, ['virtual_location_url', 'location_url', 'zoom_link', 'zoom_url', 'join_url']);
  const sessionInfo = firstValue(record, ['session_info', 'description', 'abstract', 'notes']);
  const sessionUrl = firstValue(record, ['session_url', 'url', 'details_url']);

  const chairFields = collectMatchingValues(record, /chair|moderator/i);
  const chairs = chairFields.flatMap(splitPeople);

  const speakers = splitPeople(firstValue(record, ['speakers', 'speaker', 'presenters', 'presenter']));
  const papers = normalizePapers(record);

  let displayTime = time;
  if (time && endTime && !String(time).includes('-')) {
    displayTime = `${time} - ${endTime}`;
  }

  return {
    dateDisplay: date || 'Date TBA',
    timeDisplay: displayTime || 'Time TBA',
    title: title || subtitle || 'Untitled session',
    subtitle,
    location,
    locationUrl,
    chairs,
    speakers,
    sessionInfo,
    sessionUrl,
    papers,
    raw: record
  };
}

function sortSessions(a, b) {
  const dateCompare = String(a.dateDisplay).localeCompare(String(b.dateDisplay));
  if (dateCompare !== 0) {
    return dateCompare;
  }
  return String(a.timeDisplay).localeCompare(String(b.timeDisplay));
}

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
    const normalizedSessions = sessions.map(normalizeSession).sort(sortSessions);

    console.log(`✅ ConfTool data ready: ${sessions.length} sessions`);

    return {
      sessions,
      normalizedSessions,
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
      normalizedSessions: [],
      rawSessions: null,
      error: error.message,
      isConfigured: false
    };
  }
};

