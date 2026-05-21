---
title: Program
layout: page
templateEngineOverride: njk
description: "Full chronological program for ACH 2026 — sessions, papers, keynotes. Times shown in CDT with toggle for ET, PT, BRT, UTC, or your local timezone."
---

<p class="prog-intro">ACH 2026 brings together presentations across multiple sessions, with participants joining from timezones spanning the Americas, Europe, the Middle East, South Asia, and East Asia. Browse the full chronological program below — search by title, author, or keyword, or filter by day or session.</p>

<p class="prog-intro">Times are shown in <strong>Central Time (CDT)</strong> by default — the conference's primary timezone. Use the toggle below to switch to Eastern, Pacific, Brazil, UTC, or your local timezone. The full program is also available in <a href="https://www.conftool.pro/ach2026/" target="_blank">ConfTool</a> (registration required for private session links).</p>

{% if conftool.error %}
<div class="alert alert-warning mt-3" role="alert">
  <strong>Unable to load program data:</strong> {{ conftool.error }}
</div>
{% endif %}

{% if conftool.normalizedSessions and conftool.normalizedSessions.length > 0 %}

<p class="text-muted">Last updated: {{ conftool.fetchedAt | dateFilter }}</p>

<div class="viz-stats">
  <div class="viz-stat"><span class="viz-num">{{ conftool.totalPapers }}</span><span class="viz-label">Papers</span></div>
  <div class="viz-stat"><span class="viz-num">{{ conftool.totalSessions }}</span><span class="viz-label">Sessions</span></div>
  <div class="viz-stat"><span class="viz-num">{{ conftool.uniqueDays }}</span><span class="viz-label">Conference Days</span></div>
  <div class="viz-stat"><span class="viz-num">12+</span><span class="viz-label">Timezones</span></div>
</div>

{% if conftool.allKeywords and conftool.allKeywords.length > 0 %}
<div class="viz-section">
  <h3>Topics across the program</h3>
  <p class="text-muted">{{ conftool.totalKeywords }} distinct keywords selected by authors across {{ conftool.totalPapers }} papers — sized by how many papers chose each.</p>
  <div class="topic-cloud" aria-label="All author-selected keywords">
    {% for item in conftool.allKeywords %}
    <span class="topic-tag" style="font-size:{{ item.sizeRem }}rem" title="{{ item.count }} paper{% if item.count != 1 %}s{% endif %}">{{ item.kw }}</span>
    {% endfor %}
  </div>
</div>
{% endif %}

{% include "partials/tz-toggle.html" %}

<div class="prog-filters" role="search" aria-label="Filter program">
  <input id="progSearch" type="search" placeholder="Search by title, author, or keyword" aria-label="Search sessions">
  <select id="progDay" aria-label="Filter by day">
    <option value="">All days</option>
    {% set seenDays = [] %}
    {% for session in conftool.normalizedSessions %}
      {% if session.startISO and session.startISO not in seenDays %}
        {% set seenDays = (seenDays.push(session.startISO), seenDays) %}
        <option value="{{ session.startISO }}">{{ session.dateDisplay }}</option>
      {% endif %}
    {% endfor %}
  </select>
  <select id="progPanel" aria-label="Filter by session">
    <option value="">All sessions</option>
    {% for session in conftool.normalizedSessions %}
      <option value="{{ session.title }}">{{ session.zoneTimes.CT.start }} · {{ session.title }}</option>
    {% endfor %}
  </select>
  <button type="button" id="progReset" class="prog-reset">Reset</button>
</div>

<p id="progNoResults" class="prog-noresults" hidden>No sessions match your filters.</p>

<div class="prog-list">
{% for day in conftool.normalizedSessions | groupbyProp('startISO') %}
  <section class="prog-day"
           data-day-iso="{{ day.grouper }}">
    <h3 class="prog-day-header">{{ day.list[0].dateDisplay }}</h3>

    {% for session in day.list %}
    <article class="prog-session"
             data-day-iso="{{ day.grouper }}"
             data-panel="{{ session.title }}"
             data-start-utc="{{ session.startUTC }}"
             data-end-utc="{{ session.endUTC }}"
             data-search="{{ session.title | lower }}{% for chair in session.chairs %} {{ chair | lower }}{% endfor %}{% for p in session.papers %} {{ p.title | lower }} {{ p.authors | lower }}{% for k in p.keywords %} {{ k | lower }}{% endfor %}{% endfor %}">

      <div class="prog-session-time">
        <time class="session-time"
              datetime="{{ session.startUTC }}"
              data-end="{{ session.endUTC }}"
              data-zone-CT="{{ session.zoneTimes.CT.range }}"
              data-zone-ET="{{ session.zoneTimes.ET.range }}"
              data-zone-PT="{{ session.zoneTimes.PT.range }}"
              data-zone-BRT="{{ session.zoneTimes.BRT.range }}"
              data-zone-UTC="{{ session.zoneTimes.UTC.range }}">
          <span class="session-time-primary">{{ session.zoneTimes.CT.range }}</span>
          <span class="session-time-zone-label">CDT</span>
        </time>
        <span class="prog-live-badge" hidden>&#9679; LIVE</span>
      </div>

      <div class="prog-session-body">
        <h4 class="prog-session-title">
          {% if session.sessionUrl %}
          <a href="{{ session.sessionUrl }}" target="_blank">{{ session.title }}</a>
          {% else %}
          {{ session.title }}
          {% endif %}
        </h4>

        <div class="prog-session-meta">
          {% if session.location %}
          <span class="prog-meta-item"><strong>Virtual location:</strong>
            {% if session.locationUrl %}<a href="{{ session.locationUrl }}" target="_blank">{{ session.location }}</a>
            {% else %}{{ session.location }}{% endif %}
          </span>
          {% endif %}
          {% for chair in session.chairs %}
          <span class="prog-meta-item"><strong>Chair:</strong> {{ chair }}</span>
          {% endfor %}
        </div>

        {% if session.sessionInfo %}
        <div class="prog-session-info">{{ session.sessionInfo | safe }}</div>
        {% endif %}

        {% if session.papers and session.papers.length > 0 %}
        <details class="prog-papers" open>
          <summary>{{ session.papers.length }} paper{% if session.papers.length != 1 %}s{% endif %}</summary>
          <ul class="prog-paper-list">
            {% for paper in session.papers %}
            <li class="prog-paper">
              <div class="prog-paper-title">{{ paper.title }}</div>
              {% if paper.authors %}<div class="prog-paper-authors">{{ paper.authors }}</div>{% endif %}
              {% if paper.keywords and paper.keywords.length > 0 %}
              <div class="prog-paper-kws">
                {% for kw in paper.keywords %}<span class="prog-kw">{{ kw }}</span>{% endfor %}
              </div>
              {% endif %}
            </li>
            {% endfor %}
          </ul>
        </details>
        {% elif session.speakers and session.speakers.length > 0 %}
        <div class="prog-paper-authors"><strong>Speaker(s):</strong> {{ session.speakers | join(', ') }}</div>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </section>
{% endfor %}
</div>

{% else %}
<div class="alert alert-info mt-4" role="alert">
  <p>Schedule data is being loaded from ConfTool. Please check back soon.</p>
</div>
{% endif %}

<style>
  .topic-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.5rem;
    margin: 0.75rem 0 1.5rem;
    align-items: baseline;
    line-height: 1.6;
  }
  .topic-tag {
    padding: 0.15rem 0.55rem;
    background: #ece8ff;
    color: #4C25E1;
    border-radius: 12px;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .topic-tag:hover { background: #d8d0ff; }

  .prog-filters {
    display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
    margin: 1rem 0 1.5rem;
  }
  .prog-filters input[type="search"] { flex: 1 1 240px; padding: 0.4rem 0.6rem; font-size: 0.9rem; border: 1px solid #c8c8d4; border-radius: 4px; }
  .prog-filters select { padding: 0.4rem 0.6rem; font-size: 0.9rem; border: 1px solid #c8c8d4; border-radius: 4px; background: #fff; }
  .prog-reset { background: #fff; border: 1px solid #c8c8d4; border-radius: 4px; padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer; }
  .prog-reset:hover { border-color: #4C25E1; color: #4C25E1; }

  .prog-intro { margin: 0 0 0.6rem; }
  .prog-list { margin-top: 0.6rem; }
  .prog-list * { line-height: 1.35; }
  .prog-list p { margin: 0; }
  .prog-day { margin: 0 0 1.2rem; }
  .prog-day-header {
    margin: 1rem 0 0.4rem;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid #4C25E1;
    font-size: 1.15rem;
    font-weight: 600;
  }
  .prog-session {
    display: grid;
    grid-template-columns: 7.5rem 1fr;
    gap: 0.8rem;
    padding: 0.6rem 0.8rem;
    margin-bottom: 0.3rem;
    background: #fafafd;
    border-left: 3px solid #c8c8d4;
    border-radius: 3px;
    align-items: start;
  }
  .prog-session.is-live { border-left-color: #d62b2b; background: #fff4f4; }
  .prog-session[hidden] { display: none; }
  @media (max-width: 640px) {
    .prog-session { grid-template-columns: 1fr; gap: 0.3rem; padding: 0.6rem; }
  }
  .prog-session-time {
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
  }
  .prog-session-time .session-time-primary {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    color: #222;
  }
  .prog-session-time .session-time-zone-label {
    font-size: 0.7rem;
    color: #555;
    margin-left: 0;
  }
  .prog-live-badge {
    display: inline-block;
    margin-top: 0.25rem;
    padding: 0.05rem 0.35rem;
    font-size: 0.65rem;
    font-weight: 700;
    background: #d62b2b;
    color: #fff;
    border-radius: 3px;
  }
  .prog-session-body > * + * { margin-top: 0.25rem; }
  .prog-session-title { margin: 0; font-size: 1rem; font-weight: 600; }
  .prog-session-title a { color: inherit; text-decoration: none; border-bottom: 1px dotted #4C25E1; }
  .prog-session-meta { font-size: 0.82rem; color: #555; }
  .prog-meta-item { display: inline-block; margin-right: 0.8rem; }
  .prog-papers { margin-top: 0.25rem; }
  .prog-papers summary {
    cursor: pointer;
    font-size: 0.78rem;
    color: #4C25E1;
    margin-bottom: 0.25rem;
    list-style: revert;
  }
  .prog-paper-list { list-style: none; padding-left: 0; margin: 0; }
  .prog-paper {
    padding: 0.35rem 0;
    border-top: 1px solid #e6e6ee;
  }
  .prog-paper:first-child { border-top: none; padding-top: 0.15rem; }
  .prog-paper-title { font-weight: 500; font-size: 0.9rem; line-height: 1.3; }
  .prog-paper-authors { font-size: 0.8rem; color: #555; margin-top: 0.1rem; }
  .prog-paper-kws { margin-top: 0.2rem; }
  .prog-kw {
    display: inline-block;
    padding: 0.05rem 0.4rem;
    margin: 0.05rem 0.15rem 0.05rem 0;
    font-size: 0.7rem;
    background: #ece8ff;
    color: #4C25E1;
    border-radius: 10px;
    line-height: 1.4;
  }
  .prog-noresults { padding: 1rem; text-align: center; color: #777; background: #f6f6f9; border-radius: 4px; }
</style>

<script>
(function () {
  const search = document.getElementById('progSearch');
  const dayF   = document.getElementById('progDay');
  const panelF = document.getElementById('progPanel');
  const reset  = document.getElementById('progReset');
  const none   = document.getElementById('progNoResults');
  if (!search) return;

  const sessions = Array.from(document.querySelectorAll('.prog-session'));
  const days     = Array.from(document.querySelectorAll('.prog-day'));

  function applyFilters() {
    const q  = search.value.trim().toLowerCase();
    const df = dayF.value;
    const pf = panelF.value;
    let visibleCount = 0;

    sessions.forEach(s => {
      const matchDay   = !df || s.dataset.dayIso === df;
      const matchPanel = !pf || s.dataset.panel === pf;
      const matchQ     = !q || s.dataset.search.includes(q);
      const show = matchDay && matchPanel && matchQ;
      s.hidden = !show;
      if (show) visibleCount++;
    });

    // Hide a day section entirely if it has no visible sessions
    days.forEach(d => {
      const anyVisible = d.querySelectorAll('.prog-session:not([hidden])').length > 0;
      d.hidden = !anyVisible;
    });

    none.hidden = visibleCount > 0;
  }

  // Live badge — runs every 60s
  function updateLive() {
    const now = Date.now();
    sessions.forEach(s => {
      const start = Date.parse(s.dataset.startUtc);
      const end   = Date.parse(s.dataset.endUtc);
      const live  = !isNaN(start) && !isNaN(end) && now >= start && now < end;
      s.classList.toggle('is-live', live);
      const badge = s.querySelector('.prog-live-badge');
      if (badge) badge.hidden = !live;
    });
  }

  search.addEventListener('input', applyFilters);
  dayF.addEventListener('change', applyFilters);
  panelF.addEventListener('change', applyFilters);
  reset.addEventListener('click', () => {
    search.value = ''; dayF.value = ''; panelF.value = '';
    applyFilters();
  });

  applyFilters();
  updateLive();
  setInterval(updateLive, 60 * 1000);
})();
</script>
