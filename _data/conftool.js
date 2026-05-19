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

function normalizePapers(record, paperById = {}) {
  // New-style: p{N}_title fields from sessions export with presentations option
  const newStyleKeys = Object.keys(record)
    .filter((key) => /^p\d+_title$/i.test(key))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  if (newStyleKeys.length > 0) {
    return newStyleKeys
      .map((titleKey) => {
        const n = titleKey.match(/\d+/)[0];
        const title = record[titleKey];
        if (!title) return null;
        const id = String(record[`p${n}_paperID`] || '');
        const authors = String(record[`p${n}_authors`] || '');
        const paper = paperById[id] || {};
        const keywords = paper.keywords ? splitPeople(paper.keywords) : [];
        return { title: String(title), authors, id, keywords };
      })
      .filter(Boolean);
  }

  // Legacy-style: paper_title{N} / presentation_title{N} etc.
  const titleMatches = Object.keys(record)
    .filter((key) => /paper.*title|presentation.*title|contribution.*title|talk.*title/i.test(key))
    .sort();

  const papers = [];
  for (const titleKey of titleMatches) {
    const index = titleKey.match(/(\d+)/)?.[1] || '';
    const authorKeyCandidates = [
      `paper_author${index}`, `paper_authors${index}`,
      `presentation_author${index}`, `presentation_authors${index}`,
      `contribution_author${index}`, `contribution_authors${index}`,
      `talk_author${index}`, `talk_authors${index}`
    ];
    const paperTitle = record[titleKey];
    const paperAuthors = firstValue(record, authorKeyCandidates);
    const paperId = firstValue(record, [`paper_id${index}`, `submission_id${index}`, `paper_number${index}`]);
    const paper = paperById[String(paperId)] || {};
    const keywords = paper.keywords ? splitPeople(paper.keywords) : [];
    if (paperTitle) {
      papers.push({
        title: String(paperTitle),
        authors: String(paperAuthors || ''),
        id: String(paperId || ''),
        keywords
      });
    }
  }
  return papers;
}

function parseSessionStart(record, locale = 'en-US') {
  const raw = firstValue(record, ['session_start', 'start_date', 'date', 'session_date', 'form_date', 'day']);
  if (!raw) return { date: '', time: '', iso: '' };
  const str = String(raw).trim();
  // Format: "YYYY-MM-DD HH:MM" or "YYYY-MM-DD"
  const match = str.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/);
  if (match) {
    const dateObj = new Date(match[1]);
    const dateDisplay = dateObj.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    return { date: dateDisplay, time: match[2] || '', iso: match[1] };
  }
  return { date: str, time: '', iso: '' };
}

function normalizeSession(record, paperById = {}) {
  const { date: parsedDate, time: parsedTime, iso } = parseSessionStart(record, 'en-US');
  const date = parsedDate || firstValue(record, ['date', 'session_date', 'form_date', 'start_date', 'day']);
  const time = parsedTime || firstValue(record, ['time', 'session_time', 'time_range', 'slot', 'start_time']);
  const endTimeRaw = firstValue(record, ['session_end', 'end_time', 'session_end_time']);
  const endTime = endTimeRaw ? String(endTimeRaw).replace(/^\d{4}-\d{2}-\d{2}\s+/, '') : '';
  const rawTitle = firstValue(record, ['title', 'session_title', 'name', 'session', 'event_title']);
  // Strip leading scheduling code (e.g. "D1-S3-Z1: ") for clean display
  const title = rawTitle ? rawTitle.replace(/^[A-Z0-9][\w-]*:\s+/, '') : rawTitle;
  const subtitle = firstValue(record, ['subtitle', 'sub_title']);
  const location = firstValue(record, ['virtual_location', 'location', 'room', 'session_room']);
  const locationUrl = firstValue(record, ['virtual_location_url', 'location_url', 'zoom_link', 'zoom_url', 'join_url']);
  const sessionInfo = firstValue(record, ['session_info', 'description', 'abstract', 'notes']);
  const sessionUrl = firstValue(record, ['session_url', 'url', 'details_url']);

  const chairFields = collectMatchingValues(record, /chair|moderator/i);
  const chairs = chairFields.flatMap(splitPeople);

  const speakers = splitPeople(firstValue(record, ['speakers', 'speaker', 'presenters', 'presenter']));
  const papers = normalizePapers(record, paperById);

  let displayTime = time;
  if (time && endTime && !String(time).includes('-')) {
    displayTime = `${time} - ${endTime}`;
  }

  return {
    dateDisplay: date || 'Date TBA',
    timeDisplay: displayTime || 'Time TBA',
    startISO: iso || '',
    startTime: time || '',
    endTime: endTime || '',
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
  const dateCompare = String(a.startISO || '').localeCompare(String(b.startISO || ''));
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
          'form_export_sessions_options[]': ['presentations', 'abstracts']
        }
      },
      {
        key: 'papersExport',
        exportSelect: 'papers',
        extraParams: {}
      }
    ]);

    // Build a lookup of papers by ID for keyword enrichment
    const papersArr = Array.isArray(data.papersExport?.records) ? data.papersExport.records : [];
    const paperById = Object.fromEntries(papersArr.map((p) => [String(p.paperID), p]));

    const sessionsExport = data.sessionsExport;
    const sessions = Array.isArray(sessionsExport?.records) ? sessionsExport.records : [];
    const normalizedSessions = sessions.map((r) => normalizeSession(r, paperById)).sort(sortSessions);
    const normalizedSessionsEs = sessions.map((r) => {
      const session = normalizeSession(r, paperById);
      const { date } = parseSessionStart(r, 'es-ES');
      session.dateDisplay = date || session.dateDisplay;
      return session;
    }).sort(sortSessions);

    const totalPapers = normalizedSessions.reduce((sum, s) => sum + s.papers.length, 0);
    const uniqueDays = new Set(normalizedSessions.map(s => s.dateDisplay)).size;

    // Panel vs solo session breakdown
    const panelCount = normalizedSessions.filter(s => s.papers.length >= 2).length;
    const soloCount  = normalizedSessions.filter(s => s.papers.length === 1).length;

    // Bilingual/Spanish session detection via accented characters common in Spanish
    const spanishChars = /[áéíóúüñÁÉÍÓÚÜÑ]/;
    const spanishCount = normalizedSessions.filter(s =>
      spanishChars.test(s.title) ||
      s.papers.some(p => spanishChars.test(p.title) || spanishChars.test(p.authors))
    ).length;

    // Keyword frequency across all papers
    const kwFreq = {};
    normalizedSessions.forEach(s =>
      s.papers.forEach(p =>
        p.keywords.forEach(k => {
          const kl = k.toLowerCase().trim();
          if (kl) kwFreq[kl] = (kwFreq[kl] || 0) + 1;
        })
      )
    );
    const kwAcronyms = { ai: 'AI', ml: 'ML', nlp: 'NLP', dh: 'DH', api: 'API', gis: 'GIS', ocr: 'OCR' };
    const topKeywords = Object.entries(kwFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([kw, count]) => ({ kw: kwAcronyms[kw] ?? kw, count }));

    console.log(`✅ ConfTool data ready: ${sessions.length} sessions, ${totalPapers} papers`);

    return {
      sessions,
      normalizedSessions,
      normalizedSessionsEs,
      rawSessions: sessionsExport?.xml || null,
      fetchedAt: new Date().toISOString(),
      source: 'ConfTool REST API',
      restUrl,
      isConfigured: true,
      totalPapers,
      totalSessions: normalizedSessions.length,
      uniqueDays,
      panelCount,
      soloCount,
      spanishCount,
      topKeywords,
      maxKwCount: topKeywords.length ? topKeywords[0].count : 1,
      totalKeywords: Object.keys(kwFreq).length
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

