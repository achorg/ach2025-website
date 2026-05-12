---
title: Grupos Regionales
layout: page
---

<p>ACH 2026 explora cómo creamos y colaboramos en momentos de exigencia en el tema de la conferencia <em>Emergence/ia</em>. Los grupos regionales apoyan eventos más pequeños y localizados vinculados a la conferencia general, facilitando el intercambio de conocimiento, la construcción de comunidad y el acceso ampliado en la comunidad de Humanidades Digitales.</p>

<p>Para preguntas, contacte a ACH en <strong>conference [at] ach [dot] org</strong>. Todos los grupos se rigen por el <a href="/es/politicas/codigo-de-conducta/">Código de Conducta de ACH</a>.</p>

<div id="hubs-map"></div>

<script>
(function () {
  // Dynamically load Leaflet CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);

  // Dynamically load Leaflet JS, then initialize map in onload callback
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  script.crossOrigin = '';
  script.onload = function () {
    var map = L.map('hubs-map', { scrollWheelZoom: false }).setView([37.5, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var goldIcon = L.divIcon({
      className: 'hub-marker',
      html: '<div class="hub-marker-pin"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14]
    });

    var hubs = [
      {
        id: 'hub-midwest',
        name: 'Medio Oeste – Macalester College',
        location: 'St. Paul, Minnesota',
        lat: 44.9393,
        lng: -93.1028,
        contact: '<a href="mailto:aquigley@macalester.edu">aquigley@macalester.edu</a>'
      },
      {
        id: 'hub-midatlantic',
        name: 'Medio Atlántico – Universidad de Pennsylvania',
        location: 'Filadelfia, Pennsylvania',
        lat: 39.9522,
        lng: -75.1932,
        contact: '<a href="mailto:heider@upenn.edu">heider@upenn.edu</a>'
      },
      {
        id: 'hub-texas',
        name: 'Texas – Arte Público Press / USLDH',
        location: 'Houston, Texas',
        lat: 29.7631,
        lng: -95.3698,
        contact: '<a href="mailto:lgauthereau@uh.edu">lgauthereau@uh.edu</a>'
      },
      {
        id: 'hub-socal',
        name: 'Sur de California – UC Irvine',
        location: 'Irvine, California',
        lat: 33.6405,
        lng: -117.8443,
        contact: '<a href="https://forms.gle/j7uWaqBJjPnyyFs9A">Formulario de interés</a>'
      },
      {
        id: 'hub-florida',
        name: 'Florida / Sureste – Universidad de Florida',
        location: 'Gainesville, Florida',
        lat: 29.6436,
        lng: -82.3549,
        contact: '<a href="mailto:clcarrdi@ufl.edu">clcarrdi@ufl.edu</a>'
      }
    ];

    hubs.forEach(function (hub) {
      var marker = L.marker([hub.lat, hub.lng], { icon: goldIcon }).addTo(map);
      marker.bindPopup(
        '<strong>' + hub.name + '</strong><br>' +
        hub.location + '<br>' +
        hub.contact + '<br>' +
        '<a href="#' + hub.id + '" class="hub-popup-link">Leer más &darr;</a>'
      );
    });
  };
  document.head.appendChild(script);
})();
</script>

<hr>

<div id="hub-midwest" class="hub-blurb">
  <h3>Medio Oeste – Macalester College</h3>
  <p class="hub-location"><i class="bi bi-geo-alt-fill"></i> St. Paul, Minnesota</p>
  <p>Habiendo resistido los efectos de la Operación Metro Surge, las Ciudades Gemelas están en una posición única para albergar la conferencia de este año, centrada en <em>emergence/ia</em>. Macalester College, ubicado en St. Paul, Minnesota, inició el semestre de primavera en un estado de emergencia, con profesores, personal, estudiantes y vecinos de la comunidad participando de forma encubierta en distintas formas de activismo: patrullaje, huelgas y establecimiento de canales de ayuda mutua. El semestre exigió una atención particular y continua al cuidado comunitario. Los servicios digitales resultaron fundamentales para este trabajo, pero también limitaron la comunicación en otras formas, planteando dilemas relacionados con la privacidad y la seguridad. Como grupo regional, buscamos ofrecer un espacio comunitario seguro para ver la conferencia ACH de este año. Además, tendremos la oportunidad de escuchar a estudiantes que crearon historias digitales para el Laboratorio Nacional de Historias Cívicas de Project Pericles. Tres estudiantes colaboraron con organizaciones locales (el Centro Comunitario Hallie Q. Brown, el Lake Street Council y el Rondo Center of Diverse Expressions) para documentar de forma ética las historias de comunidades afectadas por la persecución migratoria.</p>
  <p class="hub-contact">Contacto: Dra. Aisling Quigley, Bibliotecaria DLA y Directora de Programa — <a href="mailto:aquigley@macalester.edu">aquigley@macalester.edu</a></p>
</div>

<div id="hub-midatlantic" class="hub-blurb">
  <h3>Medio Atlántico – Universidad de Pennsylvania</h3>
  <p class="hub-location"><i class="bi bi-geo-alt-fill"></i> Filadelfia, Pennsylvania</p>
  <p>Invitamos a estudiantes, profesores y a todas las personas interesadas en la investigación digital a unirse a nosotros en la Biblioteca Van Pelt de la Universidad de Pennsylvania para el grupo regional ACH 2026 del "área de Filadelfia" en el Medio Atlántico. Organizado en colaboración con el Departamento de Investigación de Datos y Beca Digital de las Bibliotecas Penn, el Price Lab for Digital Humanities, el Centro de Humanidades Digitales de la Universidad de Princeton y el Loretta C. Duckworth Scholars Studio de la Universidad de Temple, este grupo será un espacio para ver y reflexionar colectivamente sobre la conferencia ACH 2026 en un entorno local y colegial. Damos una cálida bienvenida a asistentes de las numerosas universidades de la región metropolitana de Filadelfia e invitamos especialmente a profesionales de entornos no universitarios —museos, galerías, bibliotecas y otras instituciones culturales— a unirse para un debate enriquecedor.</p>
  <p>Tenga en cuenta que, si bien la watch party conjunta es gratuita y abierta a todos, cada participante puede registrarse por separado en la conferencia principal ACH 2026 para aprovechar al máximo todos los eventos.</p>
  <p class="hub-contact">Registro: <a href="https://www.library.upenn.edu/events/ach-2026-regional-hub">library.upenn.edu/events/ach-2026-regional-hub</a> &mdash; Preguntas: Cynthia Heider — <a href="mailto:heider@upenn.edu">heider@upenn.edu</a></p>
</div>

<div id="hub-texas" class="hub-blurb">
  <h3>Texas – Arte Público Press / Centro de Humanidades Digitales Latino de EE.UU.</h3>
  <p class="hub-location"><i class="bi bi-geo-alt-fill"></i> Houston, Texas</p>
  <p>Ubicado en Houston, Texas, este grupo regional organizado por el Centro de Humanidades Digitales Latino de EE.UU. (USLDH) en Arte Público Press reunirá a profesores, estudiantes, archivistas y miembros de la comunidad para una watch party del discurso magistral, una visita guiada y una discusión. El evento incluirá una watch party del discurso magistral de la conferencia ACH, seguida de una visita guiada a Arte Público Press donde se mostrarán proyectos digitales del USLDH y se demostrará cómo el centro forma a estudiantes para trabajar con datos culturales mediante metodologías éticas y centradas en la comunidad. El programa extenderá el tema de la conferencia, <em>Emergence/ia</em>, a un espacio local, conectando las humanidades digitales con la recuperación archivística y la preservación comunitaria latina en EE.UU. Situado en una de las áreas metropolitanas latinas más grandes y diversas del país, el grupo destacará datos bilingües, materiales de archivo comunitario y alianzas con educadores y organizaciones culturales locales.</p>
  <p class="hub-contact">Los cupos son limitados. Contacto: Dra. Lorena Gauthereau — <a href="mailto:lgauthereau@uh.edu">lgauthereau@uh.edu</a></p>
</div>

<div id="hub-socal" class="hub-blurb">
  <h3>Sur de California – UC Irvine</h3>
  <p class="hub-location"><i class="bi bi-geo-alt-fill"></i> Irvine, California</p>
  <p>Únase a nosotros de forma virtual o en el campus de la Universidad de California, Irvine, el lunes 29 de junio, para una discusión post-conferencia sobre lo que nos ha inspirado y aprendido de las sesiones, el discurso magistral y las presentaciones creativas de ACH 2026. Esta discusión facilitada irá seguida de un espacio de construcción comunitaria donde compartiremos lo que está ocurriendo en nuestros respectivos campus y lo que imaginamos para el futuro, con tiempo para conectar con posibles colaboradores e intercambiar información. Organizado por el <a href="https://www.humanities.uci.edu/dhx">Digital Humanities Exchange</a> de UCI.</p>
  <p class="hub-contact">Regístrese mediante el <a href="https://forms.gle/j7uWaqBJjPnyyFs9A">formulario de interés</a>.</p>
</div>

<div id="hub-florida" class="hub-blurb">
  <h3>Florida / Sureste – Universidad de Florida</h3>
  <p class="hub-location"><i class="bi bi-geo-alt-fill"></i> Gainesville, Florida</p>
  <p>Organizado en Gainesville, Florida, el Centro de Humanidades y la Esfera Pública de la Universidad de Florida convocará un grupo regional presencial para humanistas digitales de Florida y el Sureste. Realizado en el recién inaugurado Laboratorio de Humanidades Digitales de UF, este grupo incluirá watch parties de los discursos magistrales y paneles de ACH 2026, junto con discusiones facilitadas y oportunidades de networking informal. La programación destacará el trabajo emergente en humanidades públicas y ambientales, investigación multilingüe y práctica digital comprometida con la comunidad, con especial atención a estudiantes y académicos en etapas tempranas de su carrera. Este grupo regional ofrece un espacio acogedor para vincular las comunidades regionales de HD con la conferencia virtual más amplia de ACH.</p>
  <p class="hub-contact">Contacto: Dra. Clarissa Carr, Especialista en Beca Digital de CHPS — <a href="mailto:clcarrdi@ufl.edu">clcarrdi@ufl.edu</a></p>
</div>
