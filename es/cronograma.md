---
title: Cronograma
layout: page
templateEngineOverride: njk,md
---

{# Esta página muestra el cronograma de la conferencia obtenido de la API de ConfTool #}

<div class="schedule-container">
  {% if conftool.error %}
    <div class="alert alert-warning" role="alert">
      <strong>⚠️ No se puede cargar el cronograma:</strong> {{ conftool.error }}
      <p>Por favor visita <a href="https://www.conftool.pro/ach2026/">ConfTool</a> para ver el cronograma completo.</p>
    </div>
  {% elif conftool.sessions and conftool.sessions.length > 0 %}
    <p class="text-muted">Última actualización: {{ conftool.fetchedAt | dateFilter }}</p>
    
    <div class="sessions-grid">
      {% for session in conftool.sessions %}
        <div class="session-card card mb-3">
          <div class="card-header">
            <h5>{{ session.title or session.name }}</h5>
          </div>
          <div class="card-body">
            {% if session.date %}
              <p><strong>Fecha:</strong> {{ session.date }}</p>
            {% endif %}
            {% if session.time %}
              <p><strong>Hora:</strong> {{ session.time }}</p>
            {% endif %}
            {% if session.speakers %}
              <p><strong>Presentador(es):</strong> 
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
              <p><strong>Ubicación:</strong> {{ session.room or session.location }}</p>
            {% endif %}
            {% if session.zoom_link %}
              <p><a href="{{ session.zoom_link }}" class="btn btn-sm btn-primary" target="_blank">Unirse a Zoom</a></p>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </div>
  {% else %}
    <div class="alert alert-info" role="alert">
      <p>Los datos del cronograma se están cargando desde ConfTool. Por favor, vuelva a intentar pronto.</p>
      <p>Mientras tanto, visita <a href="https://www.conftool.pro/ach2026/">ConfTool</a> para ver el cronograma completo y registrarte para las sesiones.</p>
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
