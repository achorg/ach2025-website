---
title: Schedule
layout: page
templateEngineOverride: njk,md
---

{# This page displays the conference schedule fetched from ConfTool API #}

<div class="schedule-container">
  {% if conftool.error %}
    <div class="alert alert-warning" role="alert">
      <strong>⚠️ Unable to load schedule:</strong> {{ conftool.error }}
      <p>Please visit <a href="https://www.conftool.pro/ach2026/">ConfTool</a> to view the full schedule.</p>
    </div>
  {% elif conftool.sessions and conftool.sessions.length > 0 %}
    <p class="text-muted">Last updated: {{ conftool.fetchedAt | dateFilter }}</p>
    
    <div class="sessions-grid">
      {% for session in conftool.sessions %}
        <div class="session-card card mb-3">
          <div class="card-header">
            <h5>{{ session.title or session.name }}</h5>
          </div>
          <div class="card-body">
            {% if session.date %}
              <p><strong>Date:</strong> {{ session.date }}</p>
            {% endif %}
            {% if session.time %}
              <p><strong>Time:</strong> {{ session.time }}</p>
            {% endif %}
            {% if session.speakers %}
              <p><strong>Speaker(s):</strong> 
                {% if session.speakers is iterable %}
                  {{ session.speakers | join(", ") }}
                {% else %}
                  {{ session.speakers }}
                {% endif %}
              </p>
            {% endif %}
            {% if session.description %}
              <p>{{ session.description }}</p>
            {% endif %}
            {% if session.room or session.location %}
              <p><strong>Location:</strong> {{ session.room or session.location }}</p>
            {% endif %}
            {% if session.zoom_link %}
              <p><a href="{{ session.zoom_link }}" class="btn btn-sm btn-primary" target="_blank">Join on Zoom</a></p>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </div>
  {% else %}
    <div class="alert alert-info" role="alert">
      <p>Schedule data is being loaded from ConfTool. Please check back soon.</p>
      <p>In the meantime, visit <a href="https://www.conftool.pro/ach2026/">ConfTool</a> to view the full schedule and register for sessions.</p>
    </div>
  {% endif %}
</div>

<style>
  .schedule-container {
    margin: 2rem 0;
  }
  
  .sessions-grid {
    display: grid;
    gap: 1.5rem;
  }
  
  .session-card {
    transition: all 0.3s ease;
  }
  
  .session-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .session-card .card-header {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }
</style>
