---
title: Program Overview
layout: page
templateEngineOverride: njk,md
---

<p>ACH 2026 brings together presentations across multiple sessions, with participants joining from timezones spanning the Americas, Europe, the Middle East, South Asia, and East Asia. Use this page to explore themes, sessions, and the full program.</p>

{% if conftool.normalizedSessions and conftool.normalizedSessions.length > 0 %}
<p class="text-muted">Last updated: {{ conftool.fetchedAt | dateFilter }}</p>

<div class="viz-stats">
  <div class="viz-stat"><span class="viz-num">{{ conftool.totalPapers }}</span><span class="viz-label">Papers</span></div>
  <div class="viz-stat"><span class="viz-num">{{ conftool.totalSessions }}</span><span class="viz-label">Sessions</span></div>
  <div class="viz-stat"><span class="viz-num">12+</span><span class="viz-label">Timezones</span></div>
  <div class="viz-stat"><span class="viz-num">{{ conftool.uniqueDays }}</span><span class="viz-label">Conference Days</span></div>
</div>
{% elif conftool.error %}
<div class="alert alert-warning mt-3" role="alert">
  <strong>Unable to load program data:</strong> {{ conftool.error }}
</div>
{% else %}
<div class="viz-stats">
  <div class="viz-stat"><span class="viz-num">41</span><span class="viz-label">Papers</span></div>
  <div class="viz-stat"><span class="viz-num">20</span><span class="viz-label">Sessions</span></div>
  <div class="viz-stat"><span class="viz-num">12+</span><span class="viz-label">Timezones</span></div>
  <div class="viz-stat"><span class="viz-num">3</span><span class="viz-label">Conference Days</span></div>
</div>
{% endif %}

<div class="viz-section">
  <h3>Browse the Program</h3>
  <div class="viz-filters">
    <input id="vizSearch" type="search" placeholder="Search by title, author, or keyword" aria-label="Search papers">    <select id="vizDay" aria-label="Filter by day">
      <option value="">All days</option>
    </select>    <select id="vizPanel" aria-label="Filter by session">
      <option value="">All sessions</option>
    </select>
  </div>
  <div id="vizCards" class="viz-cards"></div>
  <p id="vizNoResults" class="viz-noresults" hidden>No papers match your search.</p>
</div>

<script>
{% if conftool.normalizedSessions and conftool.normalizedSessions.length > 0 %}
const PAPERS = [
{% for session in conftool.normalizedSessions %}
{% for paper in session.papers %}
{"panel":{{ session.title | dump | safe }},"id":{{ paper.id | dump | safe }},"title":{{ paper.title | dump | safe }},"authors":{{ paper.authors | dump | safe }},"keywords":{{ paper.keywords | dump | safe }},"date":{{ session.dateDisplay | dump | safe }},"time":{{ session.timeDisplay | dump | safe }},"startISO":{{ session.startISO | dump | safe }},"startTime":{{ session.startTime | dump | safe }},"endTime":{{ session.endTime | dump | safe }}},
{% endfor %}
{% endfor %}
];
{% else %}
const PAPERS = [];
{% endif %}
(function() {
  const cards     = document.getElementById('vizCards');
  const search    = document.getElementById('vizSearch');
  const daySelect = document.getElementById('vizDay');
  const select    = document.getElementById('vizPanel');
  const none      = document.getElementById('vizNoResults');
  const INITIAL_LIMIT = 10;

  // Populate day filter
  const dayMap = new Map();
  PAPERS.forEach(p => { if (p.startISO && !dayMap.has(p.startISO)) dayMap.set(p.startISO, p.date); });
  [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([iso, label]) => {
    const opt = document.createElement('option');
    opt.value = iso;
    opt.textContent = label;
    daySelect.appendChild(opt);
  });

  // Populate panel filter — dynamic, respects active day filter
  const panelData = new Map();
  PAPERS.forEach(p => {
    if (!panelData.has(p.panel)) panelData.set(p.panel, { startISO: p.startISO, startTime: p.startTime, time: p.time });
  });

  function populatePanels(df) {
    const current = select.value;
    while (select.options.length > 1) select.remove(1);
    [...panelData.entries()]
      .filter(([, info]) => !df || info.startISO === df)
      .sort((a, b) => {
        const d = (a[1].startISO || '').localeCompare(b[1].startISO || '');
        if (d !== 0) return d;
        return (a[1].startTime || '').localeCompare(b[1].startTime || '');
      })
      .forEach(([name, info]) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = info.time ? `${info.time} · ${name}` : name;
        select.appendChild(opt);
      });
    if ([...select.options].some(o => o.value === current)) select.value = current;
  }

  populatePanels('');

  function isFiltering() {
    return search.value.trim() !== '' || daySelect.value !== '' || select.value !== '';
  }

  function isLive(p) {
    if (!p.startISO || !p.startTime || !p.endTime) return false;
    const now = new Date();
    const y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, '0'), d = String(now.getDate()).padStart(2, '0');
    if (p.startISO !== `${y}-${m}-${d}`) return false;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = p.startTime.split(':').map(Number);
    const [eh, em] = p.endTime.split(':').map(Number);
    return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
  }

  function renderCard(p) {
    const live = isLive(p);
    const div = document.createElement('div');
    div.className = 'viz-card' + (live ? ' viz-card--live' : '');
    div.innerHTML = `
      <div class="viz-card-panel">${p.panel}${live ? ' <span class="viz-live-badge">&#9679; LIVE</span>' : ''}</div>
      ${p.date ? `<div class="viz-card-datetime">${p.date}${p.time ? ' &middot; ' + p.time : ''}</div>` : ''}
      <div class="viz-card-title">${p.title}</div>
      <div class="viz-card-authors">${p.authors}</div>
      ${p.keywords.length ? '<div class="viz-card-kws">' + p.keywords.map(k => `<span class="viz-kw">${k}</span>`).join('') + '</div>' : ''}
    `;
    return div;
  }

  function render() {
    const q  = search.value.toLowerCase();
    const df = daySelect.value;
    const pf = select.value;
    const filtering = isFiltering();
    const filtered = PAPERS.filter(p => {
      const matchDay   = !df || p.startISO === df;
      const matchPanel = !pf || p.panel === pf;
      const matchQ = !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q));
      return matchDay && matchPanel && matchQ;
    });

    // Sort chronologically when no panel filter is active
    if (!pf) {
      filtered.sort((a, b) => {
        const d = (a.startISO || '').localeCompare(b.startISO || '');
        if (d !== 0) return d;
        return (a.time || '').localeCompare(b.time || '');
      });
    }

    cards.innerHTML = '';
    // Remove any existing "show more" footer
    const existing = document.getElementById('vizShowMore');
    if (existing) existing.remove();

    const limit = filtering ? filtered.length : INITIAL_LIMIT;
    const visible = filtered.slice(0, limit);

    none.hidden = filtered.length > 0;
    visible.forEach(p => cards.appendChild(renderCard(p)));

    // Show "showing X of Y" + load-all button when not filtering and there are more
    if (!filtering && filtered.length > INITIAL_LIMIT) {
      const footer = document.createElement('div');
      footer.id = 'vizShowMore';
      footer.className = 'viz-show-more';
      footer.innerHTML = `Showing ${INITIAL_LIMIT} of ${filtered.length} papers. <button class="viz-show-more-btn">Show all</button>`;
      footer.querySelector('button').addEventListener('click', () => {
        cards.innerHTML = '';
        filtered.forEach(p => cards.appendChild(renderCard(p)));
        footer.remove();
      });
      cards.after(footer);
    }
  }

  search.addEventListener('input', render);
  daySelect.addEventListener('change', () => { populatePanels(daySelect.value); render(); });
  select.addEventListener('change', render);
  render();
  // Refresh live status every minute
  setInterval(render, 60 * 1000);
})();
</script>