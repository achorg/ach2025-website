---
title: Program (test)
layout: page
templateEngineOverride: njk
permalink: /en/program-test/
eleventyExcludeFromCollections: true
description: "Experimental version of the ACH 2026 program page. Used to test new visualizations and layouts before applying changes to the live program."
---

<div class="alert alert-info" role="alert" style="background:#fff8e1; border-left:4px solid #f4b400; padding:0.75rem 1rem; margin-bottom:1.25rem; border-radius:3px;">
  <strong>Experimental page.</strong> Sandbox for trying out new program-page visualizations. Live program: <a href="/en/program/">/en/program/</a>. Anything broken here will not affect production.
</div>

<p class="prog-intro">ACH 2026 brings together presentations across multiple sessions, with participants joining from timezones spanning the Americas, Europe, the Middle East, South Asia, and East Asia. Browse the full chronological program below — search by title, author, or topic, or filter by day, session, or topic.</p>

<p class="prog-intro">Times are shown in <strong>Central Time (CDT)</strong> by default. Use the toggle below to switch zones. Full program is also available in <a href="https://www.conftool.pro/ach2026/" target="_blank">ConfTool</a>.</p>

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
  <div class="viz-stat"><span class="viz-num">{{ conftool.totalTopics }}</span><span class="viz-label">Distinct Topics</span></div>
</div>

{% if conftool.allTopics and conftool.allTopics.length > 0 %}

<div class="variations-intro">
  <h2>Topic visualization — design variations</h2>
  <p class="text-muted">Three ways of presenting the {{ conftool.totalTopics }} distinct topics chosen by authors across {{ conftool.totalPapers }} papers. Pick a favorite or mix-and-match. Variations A &amp; D group by ConfTool's 6 categories; C is a flat clickable cloud. <strong>Click any topic in any variation to filter the program below.</strong></p>
</div>

<!-- ============================================================ -->
<!-- VARIATION A — Faceted by category (display-only)               -->
<!-- ============================================================ -->
<section class="viz-section variation-block" id="variation-a">
  <h3>Variation A — Faceted by category (display-only)</h3>
  <p class="text-muted">Topics grouped by ConfTool's 6 categories. Each category collapses independently. Chips here are display-only — see Variation D for clickable filtering.</p>

  <div class="topic-facets">
    {% for cat in conftool.categoryEntries %}
    <details class="topic-facet" data-cat="{{ cat.slug }}" {% if loop.index <= 3 %}open{% endif %}>
      <summary>
        <span class="topic-facet-name">{{ cat.label }}</span>
        <span class="topic-facet-meta">{{ cat.distinctCount }} topic{% if cat.distinctCount != 1 %}s{% endif %} · {{ cat.totalCount }} paper-use{% if cat.totalCount != 1 %}s{% endif %}</span>
      </summary>
      <div class="topic-facet-chips">
        {% for item in cat.items %}
        <span class="topic-tag" title="{{ item.count }} paper{% if item.count != 1 %}s{% endif %}">{{ item.value }} <span class="topic-count-badge">{{ item.count }}</span></span>
        {% endfor %}
      </div>
    </details>
    {% endfor %}
  </div>
</section>

<!-- ============================================================ -->
<!-- VARIATION C — Flat clickable cloud (top 30)                    -->
<!-- ============================================================ -->
<section class="viz-section variation-block" id="variation-c">
  <h3>Variation C — Flat clickable cloud (top 30 by frequency)</h3>
  <p class="text-muted">Most-frequent topics across all categories, sized by count. Click to filter the program below; click again to remove. Useful for spotting cross-category prominence (e.g. whether more papers tag "Method: text mining" than "Geography: Global"). Note that "Language: English" and "Language: Spanish" tend to dominate.</p>

  <div class="topic-cloud topic-cloud--clickable">
    {% for item in conftool.allTopics %}{% if loop.index <= 30 %}
    <button type="button" class="topic-tag topic-tag--btn" data-topic="{{ item.topic | lower }}" data-cat="{{ item.slug or 'other' }}" style="font-size:{{ item.sizeRem }}rem" title="{{ item.count }} paper{% if item.count != 1 %}s{% endif %}">{{ item.topic }} <span class="topic-count-badge">{{ item.count }}</span></button>
    {% endif %}{% endfor %}
  </div>
  {% if conftool.totalTopics > 30 %}
  <p class="text-muted small" style="margin-top:0.5rem">Showing top 30 of {{ conftool.totalTopics }} topics.</p>
  {% endif %}
</section>

<!-- ============================================================ -->
<!-- VARIATION D — Faceted + clickable (hybrid)                     -->
<!-- ============================================================ -->
<section class="viz-section variation-block" id="variation-d">
  <h3>Variation D — Faceted + clickable (hybrid)</h3>
  <p class="text-muted">Combines A's category grouping with C's filter behavior. Every chip is a button. Likely the strongest design for shipping to the live program.</p>

  <div class="topic-facets topic-facets--clickable">
    {% for cat in conftool.categoryEntries %}
    <details class="topic-facet" data-cat="{{ cat.slug }}" {% if loop.index <= 3 %}open{% endif %}>
      <summary>
        <span class="topic-facet-name">{{ cat.label }}</span>
        <span class="topic-facet-meta">{{ cat.distinctCount }} topic{% if cat.distinctCount != 1 %}s{% endif %} · {{ cat.totalCount }} paper-use{% if cat.totalCount != 1 %}s{% endif %}</span>
      </summary>
      <div class="topic-facet-chips">
        {% for item in cat.items %}
        <button type="button" class="topic-tag topic-tag--btn" data-topic="{{ item.fullTopic | lower }}" data-cat="{{ cat.slug }}" title="{{ item.count }} paper{% if item.count != 1 %}s{% endif %}">{{ item.value }} <span class="topic-count-badge">{{ item.count }}</span></button>
        {% endfor %}
      </div>
    </details>
    {% endfor %}
  </div>
</section>

<div class="topic-filter-status" id="topicFilterBar">
  <span id="topicFilterStatus" class="text-muted small"></span>
  <button type="button" id="topicFilterClear" class="prog-reset" hidden>Clear topic filters</button>
</div>

<!-- ============================================================ -->
<!-- DEBUG — raw topic data dump                                    -->
<!-- ============================================================ -->
<details class="viz-section topic-debug">
  <summary><strong>Debug — raw topic data ({{ conftool.totalTopics }} distinct topics across {{ conftool.totalPapers }} papers, {{ conftool.categoryEntries.length }} categories)</strong></summary>
  <div class="topic-debug-body">
    <h4>Categories detected</h4>
    <ul class="topic-debug-cats">
      {% for cat in conftool.categoryEntries %}
      <li><strong>{{ cat.label }}</strong> ({{ cat.key }}) — {{ cat.distinctCount }} distinct, {{ cat.totalCount }} paper-uses</li>
      {% endfor %}
    </ul>
    <h4>All topics, frequency-sorted</h4>
    <ol class="topic-debug-list">
      {% for item in conftool.allTopics %}
      <li><code>{{ item.topic }}</code> <span class="topic-count-badge">{{ item.count }}</span></li>
      {% endfor %}
    </ol>
  </div>
</details>

{% endif %}

{% include "partials/tz-toggle.html" %}

<div class="prog-filters" role="search" aria-label="Filter program">
  <input id="progSearch" type="search" placeholder="Search by title, author, or topic" aria-label="Search sessions">
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
    {%- set sessionTopics = [] -%}
    {%- for p in session.papers -%}
      {%- for t in p.topics -%}
        {%- set sessionTopics = (sessionTopics.push(t | lower), sessionTopics) -%}
      {%- endfor -%}
    {%- endfor -%}
    <article class="prog-session"
             data-day-iso="{{ day.grouper }}"
             data-panel="{{ session.title }}"
             data-start-utc="{{ session.startUTC }}"
             data-end-utc="{{ session.endUTC }}"
             data-topics="{{ sessionTopics | join('|') }}"
             data-search="{{ session.title | lower }}{% for chair in session.chairs %} {{ chair | lower }}{% endfor %}{% for p in session.papers %} {{ p.title | lower }} {{ p.authors | lower }}{% for k in p.keywords %} {{ k | lower }}{% endfor %}{% for t in p.topics %} {{ t | lower }}{% endfor %}{% endfor %}">

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
              {% if paper.topicGroups and paper.topicGroups.length > 0 %}
              <div class="prog-paper-topics-grouped">
                {% for grp in paper.topicGroups %}
                <div class="paper-topic-group" data-cat="{{ grp.slug }}">
                  <span class="paper-topic-cat-label">{{ grp.short }}</span>
                  {% for t in grp.items %}<span class="prog-kw">{{ t }}</span>{% endfor %}
                </div>
                {% endfor %}
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
  /* ============================================================
     Per-category color scheme — applied via [data-cat="..."] on
     chip parents. Shared across all variations + per-paper display.
     ============================================================ */
  [data-cat="lang"]    .topic-tag, [data-cat="lang"]    .prog-kw,
  .topic-tag[data-cat="lang"]    { background:#e3f2fd; color:#1565c0; }
  [data-cat="geo"]     .topic-tag, [data-cat="geo"]     .prog-kw,
  .topic-tag[data-cat="geo"]     { background:#e8f5e9; color:#2e7d32; }
  [data-cat="time"]    .topic-tag, [data-cat="time"]    .prog-kw,
  .topic-tag[data-cat="time"]    { background:#fff3e0; color:#b35900; }
  [data-cat="topical"] .topic-tag, [data-cat="topical"] .prog-kw,
  .topic-tag[data-cat="topical"] { background:#f3e5f5; color:#6a1b9a; }
  [data-cat="method"]  .topic-tag, [data-cat="method"]  .prog-kw,
  .topic-tag[data-cat="method"]  { background:#fbe9e7; color:#c0392b; }
  [data-cat="field"]   .topic-tag, [data-cat="field"]   .prog-kw,
  .topic-tag[data-cat="field"]   { background:#e0f2f1; color:#00695c; }
  [data-cat="other"]   .topic-tag, [data-cat="other"]   .prog-kw,
  .topic-tag[data-cat="other"]   { background:#eceff1; color:#455a64; }

  /* Active filter state — overrides per-category color */
  .topic-tag--btn.is-active,
  .topic-tag--btn.is-active[data-cat] {
    background: #4C25E1 !important;
    color: #fff !important;
    border-color: #4C25E1 !important;
  }
  .topic-tag--btn.is-active .topic-count-badge {
    background: rgba(255,255,255,0.25);
    color: #fff;
  }

  /* ============================================================
     Variation gallery layout
     ============================================================ */
  .variations-intro { margin: 1.5rem 0 0.5rem; padding-top: 0.5rem; border-top: 2px dashed #d8d4ec; }
  .variations-intro h2 { margin: 0 0 0.25rem; font-size: 1.2rem; }

  .variation-block {
    margin: 1rem 0 1.5rem;
    padding: 0.85rem 1rem 1rem;
    background: #fbfaff;
    border: 1px solid #e6e2f5;
    border-radius: 5px;
  }
  .variation-block > h3 { margin-top: 0; font-size: 1.05rem; color: #4C25E1; }
  .variation-block > p.text-muted { margin-top: 0.15rem; font-size: 0.85rem; }

  /* ============================================================
     Facets (A & D)
     ============================================================ */
  .topic-facets { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.6rem; }
  .topic-facet {
    border: 1px solid #d8d4ec;
    border-radius: 4px;
    background: #fff;
  }
  .topic-facet > summary {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    list-style: revert;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .topic-facet-name { font-weight: 600; color: #2a2440; }
  .topic-facet-meta { font-size: 0.78rem; color: #777; }
  .topic-facet-chips {
    padding: 0.25rem 0.75rem 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.4rem;
    align-items: baseline;
  }

  /* ============================================================
     Topic chips (shared base)
     ============================================================ */
  .topic-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 0.4rem;
    margin: 0.5rem 0 0;
    align-items: baseline;
    line-height: 1.6;
  }
  .topic-tag {
    padding: 0.12rem 0.5rem;
    background: #ece8ff;
    color: #4C25E1;
    border-radius: 12px;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s;
    font-size: 0.8rem;
    border: 1px solid transparent;
  }
  .topic-tag--btn {
    cursor: pointer;
    font-family: inherit;
  }
  .topic-tag--btn:hover {
    border-color: rgba(0,0,0,0.25);
  }
  .topic-count-badge {
    display: inline-block;
    margin-left: 0.25rem;
    padding: 0 0.3rem;
    background: rgba(0,0,0,0.08);
    border-radius: 8px;
    font-size: 0.72em;
    font-weight: 500;
  }

  /* ============================================================
     Filter status bar
     ============================================================ */
  .topic-filter-status {
    margin: 0.6rem 0 1rem;
    padding: 0.5rem 0.75rem;
    display: flex;
    gap: 0.8rem;
    align-items: center;
    background: #f6f4ff;
    border: 1px solid #e6e2f5;
    border-radius: 4px;
    min-height: 2rem;
  }
  .topic-filter-status:empty,
  .topic-filter-status[data-empty="1"] { display: none; }

  /* ============================================================
     Debug
     ============================================================ */
  .topic-debug {
    margin: 1rem 0 1.5rem;
    padding: 0.5rem 0.85rem;
    background: #fafafa;
    border: 1px dashed #c8c8c8;
    border-radius: 4px;
    font-size: 0.85rem;
  }
  .topic-debug > summary { cursor: pointer; font-size: 0.85rem; color: #555; }
  .topic-debug-body h4 { margin: 0.8rem 0 0.3rem; font-size: 0.9rem; }
  .topic-debug-cats { font-size: 0.82rem; margin: 0.2rem 0; padding-left: 1.2rem; }
  .topic-debug-list {
    columns: 2;
    column-gap: 1.5rem;
    font-size: 0.78rem;
    margin: 0.2rem 0;
    padding-left: 1.5rem;
  }
  .topic-debug-list li { break-inside: avoid; padding: 0.05rem 0; }
  .topic-debug-list code { background: #fff; padding: 0 0.25rem; border-radius: 2px; font-size: 0.9em; }
  @media (max-width: 640px) { .topic-debug-list { columns: 1; } }

  /* ============================================================
     Per-paper topic display (grouped by category)
     ============================================================ */
  .prog-paper-topics-grouped {
    margin-top: 0.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .paper-topic-group {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.2rem 0.3rem;
  }
  .paper-topic-cat-label {
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #888;
    flex-shrink: 0;
    min-width: 2.5rem;
  }

  /* ============================================================
     Program list (unchanged from live page)
     ============================================================ */
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
  .prog-session.topic-filtered { display: none; }
  @media (max-width: 640px) {
    .prog-session { grid-template-columns: 1fr; gap: 0.3rem; padding: 0.6rem; }
  }
  .prog-session-time { font-variant-numeric: tabular-nums; line-height: 1.2; }
  .prog-session-time .session-time-primary {
    display: block; font-weight: 600; font-size: 0.95rem; color: #222;
  }
  .prog-session-time .session-time-zone-label { font-size: 0.7rem; color: #555; }
  .prog-live-badge {
    display: inline-block; margin-top: 0.25rem; padding: 0.05rem 0.35rem;
    font-size: 0.65rem; font-weight: 700; background: #d62b2b; color: #fff; border-radius: 3px;
  }
  .prog-session-body > * + * { margin-top: 0.25rem; }
  .prog-session-title { margin: 0; font-size: 1rem; font-weight: 600; }
  .prog-session-title a { color: inherit; text-decoration: none; border-bottom: 1px dotted #4C25E1; }
  .prog-session-meta { font-size: 0.82rem; color: #555; }
  .prog-meta-item { display: inline-block; margin-right: 0.8rem; }
  .prog-papers { margin-top: 0.25rem; }
  .prog-papers summary { cursor: pointer; font-size: 0.78rem; color: #4C25E1; margin-bottom: 0.25rem; list-style: revert; }
  .prog-paper-list { list-style: none; padding-left: 0; margin: 0; }
  .prog-paper { padding: 0.35rem 0; border-top: 1px solid #e6e6ee; }
  .prog-paper:first-child { border-top: none; padding-top: 0.15rem; }
  .prog-paper-title { font-weight: 500; font-size: 0.9rem; line-height: 1.3; }
  .prog-paper-authors { font-size: 0.8rem; color: #555; margin-top: 0.1rem; }
  .prog-kw {
    display: inline-block; padding: 0.05rem 0.4rem; margin: 0;
    font-size: 0.7rem; background: #ece8ff; color: #4C25E1; border-radius: 10px; line-height: 1.4;
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

    sessions.forEach(s => {
      const matchDay   = !df || s.dataset.dayIso === df;
      const matchPanel = !pf || s.dataset.panel === pf;
      const matchQ     = !q || s.dataset.search.includes(q);
      s.hidden = !(matchDay && matchPanel && matchQ);
    });

    let anyVisible = 0;
    days.forEach(d => {
      const visible = Array.from(d.querySelectorAll('.prog-session'))
        .some(s => !s.hidden && !s.classList.contains('topic-filtered'));
      d.hidden = !visible;
      if (visible) anyVisible++;
    });

    none.hidden = sessions.some(s => !s.hidden && !s.classList.contains('topic-filtered'));
    if (none.hidden === false) none.hidden = anyVisible > 0;
  }
  window.progApplyFilters = applyFilters;

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

// Topic-filter logic — shared by Variations C and D via event delegation.
// Any .topic-tag--btn with a data-topic value participates; clicking the same
// topic in any variation toggles all matching pills in sync.
(function () {
  const status = document.getElementById('topicFilterStatus');
  const clear  = document.getElementById('topicFilterClear');
  const bar    = document.getElementById('topicFilterBar');
  if (!status || !clear || !bar) return;

  const active = new Set();
  const sessions = document.querySelectorAll('.prog-session');

  function syncPillState() {
    document.querySelectorAll('.topic-tag--btn').forEach(btn => {
      btn.classList.toggle('is-active', active.has(btn.dataset.topic));
    });
  }

  function applyTopicFilter() {
    const filterActive = active.size > 0;
    sessions.forEach(s => {
      if (!filterActive) {
        s.classList.remove('topic-filtered');
        return;
      }
      const sessionTopics = (s.dataset.topics || '').split('|').filter(Boolean);
      const hasMatch = sessionTopics.some(st => active.has(st));
      s.classList.toggle('topic-filtered', !hasMatch);
    });

    syncPillState();
    if (filterActive) {
      const labels = Array.from(active).map(t => {
        const m = t.match(/^[^:]+:\s*(.+)$/);
        return m ? m[1] : t;
      });
      status.textContent = `Filtering by ${active.size} topic${active.size === 1 ? '' : 's'}: ${labels.join(', ')}`;
      bar.dataset.empty = '0';
    } else {
      status.textContent = '';
      bar.dataset.empty = '1';
    }
    clear.hidden = !filterActive;

    if (window.progApplyFilters) window.progApplyFilters();
  }
  bar.dataset.empty = '1';

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.topic-tag--btn');
    if (btn && btn.dataset.topic) {
      e.preventDefault();
      const t = btn.dataset.topic;
      if (active.has(t)) active.delete(t);
      else active.add(t);
      applyTopicFilter();
    }
  });

  clear.addEventListener('click', () => {
    active.clear();
    applyTopicFilter();
  });
})();
</script>
