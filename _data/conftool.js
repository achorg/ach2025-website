/**
 * Fetch conference data from ConfTool REST API
 * This runs at build time to populate schedule/sessions data
 * 
 * Data is cached locally for 24 hours to improve build performance
 * and to handle temporary API unavailability gracefully
 */

require('dotenv').config();
const { DateTime } = require('luxon');
const ConfToolFetcher = require('../lib/conftool-fetcher');

// Timezone the ConfTool export's `session_start` is actually in.
// We observed (May 2026) the export ships values 1h ahead of CDT, which is Eastern.
// Override via env if ConfTool's behavior changes.
const SOURCE_TZ = process.env.CONFTOOL_SOURCE_TZ || 'America/New_York';

// Canonical conference timezone (what we want as the primary display).
const CONFERENCE_TZ = process.env.CONFERENCE_TZ || 'America/Chicago';

// Zones to precompute for multi-timezone display.
// Each entry: [IANA zone, short label]. Primary first.
const DISPLAY_ZONES = [
  ['America/Chicago',     'CT'],   // Central, primary
  ['America/New_York',    'ET'],   // Eastern
  ['America/Los_Angeles', 'PT'],   // Pacific
  ['America/Sao_Paulo',   'BRT'],  // Brazil (Latin America audience)
  ['UTC',                 'UTC']
];

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

// ConfTool 2026 topic taxonomy. Authors pick from a fixed list of ~141 topics
// across 6 categories, each named "Category: Value". CATEGORY_ORDER is the
// admin's display order in ConfTool — we mirror it on the site.
const TOPIC_CATEGORIES = [
  { key: 'Language',     label: 'Language of Presentation', short: 'Lang',   slug: 'lang' },
  { key: 'Geography',    label: 'Geography',                short: 'Geo',    slug: 'geo' },
  { key: 'Temporal',     label: 'Temporal',                 short: 'Era',    slug: 'time' },
  { key: 'Topics',       label: 'Topical area',             short: 'Topic',  slug: 'topical' },
  { key: 'Methods',      label: 'Methods',                  short: 'Method', slug: 'method' },
  { key: 'Disc./Fields', label: 'Disciplines & Fields',     short: 'Field',  slug: 'field' }
];
const CATEGORY_BY_KEY = Object.fromEntries(TOPIC_CATEGORIES.map((c) => [c.key, c]));
const UNCATEGORIZED = { key: 'Uncategorized', label: 'Other', short: 'Other', slug: 'other' };

// Split "Category: Value" into its parts. ConfTool's 2026 taxonomy uses this
// exact pattern for every topic; if a string doesn't match we treat it as
// uncategorized rather than guessing alternate separators.
function parseTopicCategory(topic) {
  if (!topic || typeof topic !== 'string') return { category: null, value: String(topic || '') };
  const m = topic.trim().match(/^([^:]{1,40}?)\s*:\s*(.+)$/);
  if (m) return { category: m[1].trim(), value: m[2].trim() };
  return { category: null, value: topic.trim() };
}

// Try the two field shapes ConfTool can use for topics on the papers export:
// a single `topics` field (semicolon/comma/pipe separated) or numbered
// `topic_1`, `topic_2` keys. The build log dumps actual field names so we
// can confirm which one ConfTool returns for this conference.
function normalizeTopics(paper) {
  if (!paper || typeof paper !== 'object') return [];

  if (paper.topics) {
    return splitPeople(paper.topics);
  }

  const numbered = Object.keys(paper)
    .filter((k) => /^topic_\d+$/i.test(k))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))
    .map((k) => paper[k])
    .filter((v) => v !== undefined && v !== null && v !== '')
    .map((v) => String(v).trim())
    .filter(Boolean);

  return numbered;
}

// Group a paper's topics by their category. Returns category groups in admin
// order, dropping empty categories. Used for compact per-paper display.
function groupPaperTopics(topics) {
  if (!topics || topics.length === 0) return [];
  const byCat = {};
  for (const t of topics) {
    const { category, value } = parseTopicCategory(t);
    const key = category || 'Uncategorized';
    if (!byCat[key]) byCat[key] = [];
    byCat[key].push(value);
  }
  const groups = [];
  for (const cat of TOPIC_CATEGORIES) {
    if (byCat[cat.key]) groups.push({ ...cat, items: byCat[cat.key] });
  }
  if (byCat['Uncategorized']) groups.push({ ...UNCATEGORIZED, items: byCat['Uncategorized'] });
  return groups;
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
        const topics = normalizeTopics(paper);
        const topicGroups = groupPaperTopics(topics);
        return { title: String(title), authors, id, keywords, topics, topicGroups };
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
    const topics = normalizeTopics(paper);
    const topicGroups = groupPaperTopics(topics);
    if (paperTitle) {
      papers.push({
        title: String(paperTitle),
        authors: String(paperAuthors || ''),
        id: String(paperId || ''),
        keywords,
        topics,
        topicGroups
      });
    }
  }
  return papers;
}

// Parse "YYYY-MM-DD[ HH:MM[:SS]]" (and a few looser variants) into a luxon DateTime
// anchored in SOURCE_TZ. Returns null if we can't parse.
function parseInSourceZone(raw) {
  if (!raw) return null;
  const str = String(raw).trim();
  const formats = [
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd HH:mm',
    'yyyy-MM-dd\'T\'HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm',
    'yyyy-MM-dd'
  ];
  for (const fmt of formats) {
    const dt = DateTime.fromFormat(str, fmt, { zone: SOURCE_TZ });
    if (dt.isValid) return dt;
  }
  // Last resort: ISO with offset (preserves whatever offset is embedded).
  const iso = DateTime.fromISO(str, { setZone: true });
  if (iso.isValid) return iso;
  return null;
}

function parseSessionStart(record, locale = 'en-US') {
  const raw = firstValue(record, ['session_start', 'start_date', 'date', 'session_date', 'form_date', 'day']);
  const dt = parseInSourceZone(raw);
  if (!dt) {
    return { date: raw ? String(raw) : '', time: '', iso: '', dt: null };
  }
  // Format the date label in the conference zone so weekday lines up with primary-zone day.
  const inConf = dt.setZone(CONFERENCE_TZ);
  const dateDisplay = inConf.setLocale(locale).toFormat('cccc, LLLL d, yyyy');
  return {
    date: dateDisplay,
    time: inConf.toFormat('HH:mm'),
    iso: inConf.toFormat('yyyy-MM-dd'),
    dt
  };
}

function parseSessionEnd(record) {
  const raw = firstValue(record, ['session_end', 'end_time', 'session_end_time']);
  return parseInSourceZone(raw);
}

// Build the per-zone time strings for one session.
function buildZoneTimes(startDt, endDt) {
  const times = {};
  for (const [zone, label] of DISPLAY_ZONES) {
    const s = startDt ? startDt.setZone(zone).toFormat('HH:mm') : '';
    const e = endDt ? endDt.setZone(zone).toFormat('HH:mm') : '';
    times[label] = {
      zone,
      label,
      start: s,
      end: e,
      range: s && e ? `${s}–${e}` : (s || e)
    };
  }
  return times;
}

function normalizeSession(record, paperById = {}, locale = 'en-US') {
  const { date: parsedDate, time: parsedTime, iso, dt: startDt } = parseSessionStart(record, locale);
  const endDt = parseSessionEnd(record);
  const date = parsedDate || firstValue(record, ['date', 'session_date', 'form_date', 'start_date', 'day']);
  const time = parsedTime || firstValue(record, ['time', 'session_time', 'time_range', 'slot', 'start_time']);
  const endTime = endDt ? endDt.setZone(CONFERENCE_TZ).toFormat('HH:mm') : '';
  const zoneTimes = buildZoneTimes(startDt, endDt);
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

  // Primary display: conference timezone (CDT in June).
  const primary = zoneTimes['CT'] || { start: time, end: endTime, range: time };
  const displayTime = primary.range || (primary.start && primary.end ? `${primary.start}–${primary.end}` : primary.start || 'Time TBA');

  return {
    dateDisplay: date || 'Date TBA',
    timeDisplay: displayTime,
    startISO: iso || '',
    startTime: primary.start || time || '',
    endTime: primary.end || endTime || '',
    startUTC: startDt ? startDt.toUTC().toISO() : '',
    endUTC: endDt ? endDt.toUTC().toISO() : '',
    sourceTZ: SOURCE_TZ,
    conferenceTZ: CONFERENCE_TZ,
    zoneTimes,
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
  // Sort by real UTC moment when available — falls back to ISO date + HH:MM otherwise.
  const aKey = a.startUTC || `${a.startISO || ''}T${a.startTime || ''}`;
  const bKey = b.startUTC || `${b.startISO || ''}T${b.startTime || ''}`;
  return String(aKey).localeCompare(String(bKey));
}

module.exports = async function() {
  const sharedSecret = process.env.CONFTOOL_SHARED_SECRET;
  const restUrl = process.env.CONFTOOL_REST_URL || 'https://www.conftool.pro/ach2026/rest.php';

  if (!sharedSecret) {
    console.warn('⚠️  CONFTOOL_SHARED_SECRET not set. Skipping ConfTool data fetch.');
    return { sessions: [], rawSessions: null, isConfigured: false };
  }

  try {
    const fetcher = new ConfToolFetcher(sharedSecret, restUrl);
    const data = await fetcher.fetchMultiple([
      {
        key: 'sessionsExport',
        exportSelect: 'sessions',
        extraParams: {
          'form_export_sessions_options[]': ['presentations', 'all']
        }
      },
      {
        key: 'papersExport',
        exportSelect: 'papers',
        extraParams: {}
      }
    ]);
    const papersArr = Array.isArray(data.papersExport?.records) ? data.papersExport.records : [];
    const sessions = Array.isArray(data.sessionsExport?.records) ? data.sessionsExport.records : [];

    const paperById = Object.fromEntries(papersArr.map((p) => [String(p.paperID), p]));

    const normalizedSessions = sessions.map((r) => normalizeSession(r, paperById, 'en-US')).sort(sortSessions);
    const normalizedSessionsEs = sessions.map((r) => normalizeSession(r, paperById, 'es-ES')).sort(sortSessions);

    const totalPapers = normalizedSessions.reduce((sum, s) => sum + s.papers.length, 0);
    const uniqueDays = new Set(normalizedSessions.map(s => s.startISO).filter(Boolean)).size;

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

    // Full keyword list sized for tag-cloud display (font-size 0.75rem → 1.4rem
    // linearly between single-paper and most-popular keyword).
    const sortedKeywords = Object.entries(kwFreq).sort((a, b) => b[1] - a[1]);
    const maxKwCount = sortedKeywords.length ? sortedKeywords[0][1] : 1;
    const allKeywords = sortedKeywords.map(([kw, count]) => ({
      kw: kwAcronyms[kw] ?? kw,
      count,
      sizeRem: maxKwCount > 1
        ? +(0.75 + ((count - 1) / (maxKwCount - 1)) * 0.65).toFixed(3)
        : 1
    }));

    // Topic frequency across all papers (controlled vocabulary from ConfTool)
    const topicFreq = {};
    normalizedSessions.forEach(s =>
      s.papers.forEach(p =>
        (p.topics || []).forEach(t => {
          const tl = String(t).trim();
          if (tl) topicFreq[tl] = (topicFreq[tl] || 0) + 1;
        })
      )
    );
    const sortedTopics = Object.entries(topicFreq).sort((a, b) => b[1] - a[1]);
    const maxTopicCount = sortedTopics.length ? sortedTopics[0][1] : 1;
    const allTopics = sortedTopics.map(([topic, count]) => ({
      topic,
      count,
      sizeRem: maxTopicCount > 1
        ? +(0.75 + ((count - 1) / (maxTopicCount - 1)) * 0.65).toFixed(3)
        : 1
    }));

    // Group topics by category, keeping admin's display order. Each entry
    // carries the prettified label, short label, and CSS slug for chip styling.
    const topicsByCategoryMap = {};
    for (const item of allTopics) {
      const { category, value } = parseTopicCategory(item.topic);
      const key = category || 'Uncategorized';
      if (!topicsByCategoryMap[key]) topicsByCategoryMap[key] = [];
      topicsByCategoryMap[key].push({ ...item, value, fullTopic: item.topic });
    }
    const categoryEntries = [];
    for (const cat of TOPIC_CATEGORIES) {
      if (!topicsByCategoryMap[cat.key]) continue;
      const items = topicsByCategoryMap[cat.key].sort((a, b) => b.count - a.count);
      categoryEntries.push({
        ...cat,
        items,
        totalCount: items.reduce((sum, i) => sum + i.count, 0),
        distinctCount: items.length
      });
    }
    if (topicsByCategoryMap['Uncategorized']) {
      const items = topicsByCategoryMap['Uncategorized'].sort((a, b) => b.count - a.count);
      categoryEntries.push({
        ...UNCATEGORIZED,
        items,
        totalCount: items.reduce((sum, i) => sum + i.count, 0),
        distinctCount: items.length
      });
    }

    // Keyword tier diagnostic (helps tune the tag-cloud threshold)
    const tiers = { '5+': 0, '3-4': 0, '2': 0, '1': 0 };
    for (const c of Object.values(kwFreq)) {
      if (c >= 5) tiers['5+']++;
      else if (c >= 3) tiers['3-4']++;
      else if (c === 2) tiers['2']++;
      else tiers['1']++;
    }

    console.log(`✅ ConfTool data ready: ${sessions.length} sessions, ${totalPapers} papers — source TZ ${SOURCE_TZ} → conference TZ ${CONFERENCE_TZ}`);
    console.log(`   📊 Keywords: ${Object.keys(kwFreq).length} unique across ${totalPapers} papers (${tiers['5+']} on 5+ papers, ${tiers['3-4']} on 3-4, ${tiers['2']} on 2, ${tiers['1']} on 1)`);
    if (papersArr.length > 0) {
      const topicFields = Object.keys(papersArr[0]).filter(k => /topic|subject|track/i.test(k));
      console.log(`   🏷  Paper fields matching /topic|subject|track/: ${topicFields.length > 0 ? topicFields.join(', ') : '(none — author free-text keywords only)'}`);
    }
    console.log(`   🏷  Topics: ${Object.keys(topicFreq).length} unique across ${totalPapers} papers`);

    return {
      sessions,
      normalizedSessions,
      normalizedSessionsEs,
      rawSessions: null,
      fetchedAt: new Date().toISOString(),
      source: 'ConfTool REST API',
      restUrl,
      sourceTZ: SOURCE_TZ,
      conferenceTZ: CONFERENCE_TZ,
      displayZones: DISPLAY_ZONES.map(([zone, label]) => ({ zone, label })),
      isConfigured: true,
      totalPapers,
      totalSessions: normalizedSessions.length,
      uniqueDays,
      panelCount,
      soloCount,
      spanishCount,
      topKeywords,
      allKeywords,
      maxKwCount,
      totalKeywords: Object.keys(kwFreq).length,
      allTopics,
      categoryEntries,
      totalTopics: Object.keys(topicFreq).length
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

