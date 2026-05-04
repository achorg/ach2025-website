---
title: Schedule
layout: page
templateEngineOverride: njk,md
---

## ACH 2026 Conference Program
The full program is available in ConfTool. You must be registered to access private session links.

<button class="btn btn-info"><a target="_blank" href="https://www.conftool.pro/ach2026/" style="color: white;">Open Program in ConfTool</a></button>

{% if conftool.error %}
<div class="alert alert-warning mt-4" role="alert">
  <strong>Unable to load schedule:</strong> {{ conftool.error }}
</div>
{% elif conftool.normalizedSessions and conftool.normalizedSessions.length > 0 %}
<p class="text-muted mt-3">Last updated: {{ conftool.fetchedAt | dateFilter }}</p>

{% for day in conftool.normalizedSessions | groupbyProp('dateDisplay') %}
<table width="100%" align="center" cellspacing="1" border="0" cellpadding="2" class="mediumbg table table-hover schedule-table">
  <tr>
    <td colspan="2" valign="top" class="listheader left">
      <span class="font12"><b>Date: {{ day.grouper }}</b></span>
    </td>
  </tr>
  {% for session in day.list %}
  <tr class="whitebg">
    <td class="brightbg topline_printonly schedule-time" align="center" valign="top" width="18%">
      <span class="fontbold font9">{{ session.timeDisplay }}</span>
    </td>
    <td class="whitebg topline_printonly leftline_printonly left" valign="top" width="82%">
      {% if session.sessionUrl %}
      <a class="font9" href="{{ session.sessionUrl }}" target="_blank"><b>{{ session.title }}</b></a><br />
      {% else %}
      <span class="font9"><b>{{ session.title }}</b></span><br />
      {% endif %}

      {% if session.location %}
      <span class="font8">Virtual location: </span>
      {% if session.locationUrl %}
      <a class="fontbold font8" target="_blank" href="{{ session.locationUrl }}">{{ session.location }}</a><br />
      {% else %}
      <span class="font8"><b>{{ session.location }}</b></span><br />
      {% endif %}
      {% endif %}

      {% for chair in session.chairs %}
      <span class="font8">Chair: </span><span class="font8"><b>{{ chair }}</b></span><br />
      {% endfor %}

      {% if session.sessionInfo %}
      <div class="font8 session_info">{{ session.sessionInfo | safe }}</div>
      {% endif %}

      {% if session.papers and session.papers.length > 0 %}
      <div style="font-size:8pt; clear:both;">&nbsp;</div>
      {% for paper in session.papers %}
      <p class="paper_title">{{ paper.title }}</p>
      {% if paper.authors %}
      <p class="paper_author">{{ paper.authors }}</p>
      {% endif %}
      {% if not loop.last %}
      <hr noshade width="100%" class="float_left"><br class="clearing" />
      {% endif %}
      {% endfor %}
      {% elif session.speakers and session.speakers.length > 0 %}
      <p class="paper_author"><b>Speaker(s):</b> {{ session.speakers | join(', ') }}</p>
      {% endif %}
    </td>
  </tr>
  {% endfor %}
</table>
{% endfor %}
{% else %}
<div class="alert alert-info mt-4" role="alert">
  <p>Schedule data is being loaded from ConfTool. Please check back soon.</p>
</div>
{% endif %}

<style>
  .schedule-table {
    margin-top: 1.5rem;
  }

  .schedule-time {
    min-width: 12rem;
  }

  .paper_title {
    margin-bottom: 0.2rem;
  }

  .paper_author {
    margin-top: 0;
  }
</style>
