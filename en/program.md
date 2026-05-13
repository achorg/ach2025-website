---
title: Program Overview
layout: page
---

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>

<p>ACH 2026 brings together <strong>41 presentations</strong> across <strong>20 sessions</strong>, with participants joining from timezones spanning the Americas, Europe, the Middle East, South Asia, and East Asia. Use this page to explore themes, sessions, and the full program.</p>

<div class="viz-stats">
  <div class="viz-stat"><span class="viz-num">41</span><span class="viz-label">Papers</span></div>
  <div class="viz-stat"><span class="viz-num">20</span><span class="viz-label">Sessions</span></div>
  <div class="viz-stat"><span class="viz-num">12+</span><span class="viz-label">Timezones</span></div>
  <div class="viz-stat"><span class="viz-num">3</span><span class="viz-label">Conference Days</span></div>
</div>

<div class="viz-section">
  <h3>Conference Themes</h3>
  <p class="viz-caption">Keyword frequency across all accepted papers — reflecting the core conversations of ACH 2026.</p>
  <canvas id="keywordsChart" height="340"></canvas>
</div>

<div class="viz-section">
  <h3>Sessions at a Glance</h3>
  <p class="viz-caption">Number of papers per session.</p>
  <canvas id="panelsChart" height="420"></canvas>
</div>

<div class="viz-section viz-two-col">
  <div class="viz-col-main">
    <h3>Global Reach</h3>
    <p class="viz-caption">Presenter locations by timezone region.</p>
    <canvas id="geoChart"></canvas>
  </div>
  <div class="viz-col-legend" id="geoLegend"></div>
</div>

<div class="viz-section">
  <h3>Browse the Program</h3>
  <div class="viz-filters">
    <input id="vizSearch" type="search" placeholder="Search by title, author, or keyword…" aria-label="Search papers">
    <select id="vizPanel" aria-label="Filter by session">
      <option value="">All sessions</option>
    </select>
  </div>
  <div id="vizCards" class="viz-cards"></div>
  <p id="vizNoResults" class="viz-noresults" hidden>No papers match your search.</p>
</div>

<script>
const PAPERS = [{"panel": "Digital Infrastructures 1", "id": "167", "title": "Language as Infrastructure: From Manuscript to Deep Learning", "authors": "Ghosh, Arjun", "keywords": ["multilingualism", "digital humanities", "language infrastructure", "deep learning OCR", "South Asian scripts"], "timezone": "UCT+4"}, {"panel": "Digital Infrastructures 1", "id": "153", "title": "Emergency Digitisation, Emergent Standards: Documenting AI Limits in Multilingual Cultural Heritage", "authors": "KALITA, UDDIPANA", "keywords": ["Responsible AI", "digital cultural heritage", "multilingualism", "knowledge infrastructures", "digitisation policy"], "timezone": "UTC+5:30"}, {"panel": "Digital Infrastructures 1", "id": "201", "title": "Leveraging Sparse Visual Data for Historical Insight: Forensic Reconstructions of Wartime Exhibitions in WWII China", "authors": "Du, Lin (1); Le, Brandon (2); Kong, Deqian (2)", "keywords": ["computer vision", "super resolution", "visual reconstruction", "exhibition", "spectatorship"], "timezone": "UTC+8"}, {"panel": "Data Sovereignty", "id": "103", "title": "How to Explain Indigenous Soil to a Blind Satellite: Atmospheric Noise as Digital Honey and Hauntological Mediumâ€”A Critical Approach to Decolonial DH Practice", "authors": "Tsai, Meng-Chieh", "keywords": ["Decolonial Digital Humanities", "Sonification", "Indigenous Data Sovereignty", "Hauntology", "InSAR"], "timezone": "UTC+7"}, {"panel": "Data Sovereignty", "id": "144", "title": "Data Colonialism as Epistemic Emergency: Large Language Models and Linguistic Sovereignty of Indigenous Communities", "authors": "Kwok, Jenny C.Y.", "keywords": ["Data colonialism", "Large Language Models", "Indigenous data sovereignty", "minority languages", "cultural preservation"], "timezone": "UTC+1"}, {"panel": "Data Sovereignty", "id": "198", "title": "Emergent Digital Humanities: Meme Scholarship from the Global South as Method", "authors": "Jyoti, Jyoti", "keywords": ["Digital Humanities", "Global South", "Meme Studies", "Performativity", "Platform Infrastructures", "Multilingual Digital Cultures"], "timezone": "UTC+05:30"}, {"panel": "Accessibility and Sustainability in the Archive", "id": "109", "title": "Sustainability and Accessibility at the University of Nebraska-Lincoln's CDRH", "authors": "Chambers, Erin Kay; Dalziel, Karin; Dewey, William; Gray, Nicole; Tunink, Greg", "keywords": ["sustainability", "accessibility", "preservation", "strategic planning"], "timezone": "UTC-5"}, {"panel": "Accessibility and Sustainability in the Archive", "id": "173", "title": "The Archive ENDURS: Accessible Archives and Title II", "authors": "Kemper, Cori; Muller, Jacob; Boyles, Christina", "keywords": ["archives", "accessibility", "usability", "ADA", "multilingual"], "timezone": "UTC-4"}, {"panel": "Accessibility and Sustainability in the Archive", "id": "199", "title": "DH Moves Toward Shared Accountability for Digital Accessibility", "authors": "Herrmann, Amalia", "keywords": ["access", "disability", "pedagogy"], "timezone": "UTC-7"}, {"panel": "Community-Engaged DH Practices", "id": "105", "title": "Digital Ethnography and/as Digital Humanities", "authors": "Vigilante, Nic", "keywords": ["ethnography", "reflexivity", "emergence", "methodology", "pedagogy"], "timezone": "UTC-4"}, {"panel": "Community-Engaged DH Practices", "id": "170", "title": "The Anti-Racist Digital Research Institute: Sharing Five Years of Practice and Building What Comes Next", "authors": "Topham, Kate; Bauer, Joe; Carruthers, Matthew; Thiels, John; Zephir, Stephanie", "keywords": ["Anti-Racist Praxis", "Project Support", "Digital Scholarship Pedagogy", "Community-Engaged practices"], "timezone": "UTC-4"}, {"panel": "Community-Engaged DH Practices", "id": "157", "title": "Sensing Revolutions: Reframing Protest through Critical, Multisensory Digital Humanities", "authors": "Ismail, Mariam (1); Maria ArÄƒÅŸ, Roxana (2)", "keywords": ["Digital Storytelling", "Ethnography", "Public Pedagogy", "Critical Digital Humanities", "Multisensory Protest"], "timezone": "UTC-4"}, {"panel": "Computational Textual Analysis", "id": "128", "title": "Detecting a “Crazy Rich Asians” Effect: Computational Text Analysis of Malaysian Anglophone Novels", "authors": "Thong, Carmen", "keywords": ["computational literary studies", "postcolonial literature", "Southeast Asia"], "timezone": "UTC-7"}, {"panel": "Computational Textual Analysis", "id": "145", "title": "Imperatives to Care-Centered Data Annotation: A Case Study in Asian American Literature", "authors": "Zou, Zhihui (1); Hayes, Matthew (2); Karumuri, Shreya (1); Curaming, Liam Roj (3); Chen, Qiren (3); Gordon, Julia (1); Hao, Mingkang (1)", "keywords": ["NER", "NLP", "minority literature", "data annotation", "ethical research"], "timezone": "UTC-7 and UTC-4"}, {"panel": "Computational Textual Analysis", "id": "161", "title": "Minimal Computing in the Age of AI: Toward Principles for Sustainable and Accountable Systems in LAM Institutions", "authors": "Perez, Paul Jason; Lee, Benjamin Charles Germain", "keywords": ["Minimal Computing", "Sustainable AI", "AI in LAM"], "timezone": "UTC-7"}, {"panel": "Multilingual DH and Transcription", "id": "129", "title": "Emergence and Linguistic Memory in Latin American Digital Humanities: A Discourse on Corpus Analysis and Language Models in Tomás Carrasquilla", "authors": "Cárdenas Arenas, Julio César", "keywords": ["Digital Humanities; Latin American Digital Humanities; Corpus Linguistics; AI and Cultural Heritage; Multilingual Text Analysis"], "timezone": "UTC-5"}, {"panel": "Multilingual DH and Transcription", "id": "195", "title": "From Scribe to Server: Exploring AI-Supported Workflows for Nahuatl Transcription", "authors": "Pieck, Regina; Wiles, Simon; Daedal, Quinn", "keywords": ["Nahuatl", "Transkribus", "manuscripts"], "timezone": "UTC-7"}, {"panel": "Multilingual DH and Transcription", "id": "147", "title": "\"I Have a Voice\": Collaborative Speech Synthesis Development for the Passamaquoddy Language", "authors": "Nic Corcrain, Muireann", "keywords": ["Passamaquoddy", "speech synthesis technology", "data sovereignty", "meaningful collaboration"], "timezone": "UTC"}, {"panel": "Digital Mapping as Method and Practice", "id": "124", "title": "Integrating corpus and geospatial analysis for Digital Borderlands In the Classroom", "authors": "Smith, Garrett; Froehlich, Heather", "keywords": ["mapping", "corpus analysis", "pedagogy"], "timezone": "UTC-6"}, {"panel": "Digital Mapping as Method and Practice", "id": "181", "title": "Mapping State Repression through Social Network Analysis", "authors": "Ross, Jennifer", "keywords": ["Social Network Analysis", "Policing", "Government", "Social Justice", "Activism"], "timezone": "UTC-4"}, {"panel": "Digital Mapping as Method and Practice", "id": "122", "title": "Finding and Founding in Times of Emegencia: Mapping the Black Digital and Public Humanities Across the Americas", "authors": "Godfrey, Mollie", "keywords": ["Black Digital Humanities", "Afro-Latinx Studies", "Mapping", "Collaboration", "Global"], "timezone": "UTC-4"}, {"panel": "Media, Film, and Screenplay Analytics", "id": "138", "title": "No Deep Learning Required: tidylens for Sustainable Corpus-Level Film Analysis", "authors": "Siddiqui, Nabeel", "keywords": ["minimal computing", "computational", "film analysis", "tidy data", "access", "equity"], "timezone": "UTC-4"}, {"panel": "Media, Film, and Screenplay Analytics", "id": "171", "title": "Segmentation as Meaning: Scene-Level Semantic Search Across 2,154 American Screenplays", "authors": "Root, James", "keywords": ["computational film studies", "semantic search", "screenplay analysis", "digital humanities", "cultural analytics"], "timezone": "UTC-7"}, {"panel": "Media, Film, and Screenplay Analytics", "id": "104", "title": "Emerging Technologies, Environmental Trade-offs, and Open Access: AI-Powered OCR for Historical Diplomatic Archives", "authors": "Martin-Schreiber, Vincent (1); Mathieu, Florian (2); Macarios, Jasmin (1)", "keywords": ["Optical Character Recognition", "Digital Archives", "Artificial Intelligence", "Environmental Computing", "Open Science"], "timezone": "UTC+2 and UTC-4"}, {"panel": "Digital Infrastructures 2", "id": "179", "title": "DisappearingDH: A dataset for longitudinal study of digital humanities lifecycles", "authors": "Fenlon, Katrina; Wise, Nikki; Deng, Ximeng", "keywords": ["Sustainability", "digital preservation", "maintenance", "endings", "cultural heritage"], "timezone": "UTC-4"}, {"panel": "Digital Infrastructures 2", "id": "141", "title": "Hybrid Minimal Computing: Sequencing Relational Infrastructure for Postcolonial Digital Humanities", "authors": "Risam, Roopika (1); Folsom, Jamie (2); Sempere, Anindita Basu (3)", "keywords": ["Pan-Africanism", "minimal computing", "postcolonial digital humanities", "hybrid infrastructure"], "timezone": "UTC-4"}, {"panel": "Digital Infrastructures 2", "id": "146", "title": "The Proof is in the Pudding: Structural Experimentation as Close Reading Strategy in the Age of LLMs", "authors": "Marchesini, Manuela (1); Franchi, Stefano (2)", "keywords": ["AI and Close reading", "Algorithmic criticism", "19th century Italian literature", "Structural experimentation", "Deformance"], "timezone": "UTC+2"}, {"panel": "Surveillance, Law, and User Agency", "id": "119", "title": "“Your Card has been Declined”: How Fintech App Communication Shapes User Agency During Transaction Failures.", "authors": "Odedeyi, Toluwani", "keywords": ["Fintech", "App Communication", "User Agency", "Algorithm", "Transactions"], "timezone": "UTC-4"}, {"panel": "Surveillance, Law, and User Agency", "id": "120", "title": "CV Dazzle and Anti-Surveillance Aesthetics and the Future of the Law of Surveillance", "authors": "Weinstein, Lior", "keywords": ["Surveillance", "Law and Humanities"], "timezone": "UTC+3‎"}, {"panel": "Surveillance, Law, and User Agency", "id": "131", "title": "Toward a Ritual Analytics: Emergency Response, Cultural Circulation, and Care under Platform Capitalism", "authors": "Bateman, Micah", "keywords": ["social media", "cultural analytics", "ritual", "data methods", "critical DH"], "timezone": "UTC-5"}, {"panel": "Environmental DH & Ecological Modeling", "id": "165", "title": "Tracking \"Adivasiyat\": Digital Collections and Emergent Identities", "authors": "Singh, Amardeep", "keywords": ["South Asia", "Indigenity", "Ecology", "Identity", "Activism"], "timezone": "UTC-4"}, {"panel": "Environmental DH & Ecological Modeling", "id": "166", "title": "How a River Became a Joke: Modeling Mentions of the L.A. River in The L.A. Times", "authors": "Miller, Dez", "keywords": ["topic modeling", "newspapers", "rivers", "ecology"], "timezone": "UTC-4"}, {"panel": "Reimagining Historical Datasets", "id": "159", "title": "This Beautiful Sisterhood of Books: An Emergent Response Using Historical Data", "authors": "Howard, Jacquelyne; Adams, Kate", "keywords": ["New Orleans World's Fair", "Database", "Digital Collection", "Crowd-sourcing", "Exhibits", "Publishing"], "timezone": "UTC-5"}, {"panel": "Reimagining Historical Datasets", "id": "188", "title": "Reimagining the Global Medieval Sourcebook", "authors": "Martin, Nino; Daedal, Quinn", "keywords": ["minimal computing", "static site generation", "Drupal", "sustainability"], "timezone": "UTC-7"}, {"panel": "Reimagining Historical Datasets", "id": "117", "title": "Beyond the Searchable PDF: Unlocking Structured Data from Historical Directories", "authors": "Smith, Sean", "keywords": ["Digital Humanities", "Digital Librarianship", "Historical Preservation", "Data Extraction", "Experiential Learning"], "timezone": "UTC-5"}, {"panel": "Synesthetic Arts", "id": "152", "title": "Positioning Electronic literature as an Emerging Creative Industry in the Majority World: A Comparative Analysis with Video Games and Digital Arts", "authors": "Desai, Mehulkumar", "keywords": ["Electronic literature", "Creative industries", "Creative economy", "Indian Consortium for Interactive Digital Narrative (ICIDN)"], "timezone": "UTC+05:30"}, {"panel": "Synesthetic Arts", "id": "154", "title": "Data-driven Selection of Oral History Collections for Close Listening and Watching in the Age of AI: Interviewer-interviewee Dynamics in Holocaust Testimonies", "authors": "Toth, Gabor Mihaly (1); Laib, Mohamed (2); Bothe, Alina (3); Winkler, Christina (3); Horath, Julia (3); Pruski, Cedric (2); Da Silveira, Marcos (2); Ma, Marcus (4); Narayanan, Shrikanth (4)", "keywords": ["oral history", "Holocaust", "close and distant reading"], "timezone": "UTC+2"}, {"panel": "Synesthetic Arts", "id": "184", "title": "Responding to Environmental Emergencies: A Low-Carbon Eco-Computational Study of Indian and American Eco-Theatre", "authors": "Bhimjyani, Simran", "keywords": ["Digital Environmental Humanities (DEH)", "IDEH", "Eco-theatre", "Low-carbon DH", "environmental emergency"], "timezone": "UTC+05:30"}, {"panel": "Critiques and Uses of Generative AI", "id": "155", "title": "From Virtual Ifta’ to AI Islam: Analyzing the Emergence and Impact of AI Fatwa Generators", "authors": "Stanton, Andrea", "keywords": ["digital Islam", "GenAI", "fatwa generator"], "timezone": "UTC-6"}, {"panel": "Critiques and Uses of Generative AI", "id": "194", "title": "A Multimodal Pipeline for the Analysis of Mosaik: Integrating Panel Segmentation, OCR, and Generative AI for the GDR Archive", "authors": "Cheng, Peter (1); Zhong, Matt (2)", "keywords": ["Panel Segmentation", "Multimodal Pipeline", "GDR Bildgeschichte", "Generative AI Reverse Prompting", "Scene & Object Classification"], "timezone": "UTC-7"}, {"panel": "Critiques and Uses of Generative AI", "id": "168", "title": "Zooniverse Platform Recommendations for Machine Learning-Engaged Crowdsourcing", "authors": "Blickhan, Samantha (1); Burgess, Hillary K. (2)", "keywords": ["crowdsourcing", "ai", "ethics", "policy", "machine learning"], "timezone": "UTC-5"}];

/* ── Charts ─────────────────────────────────────────── */
const GOLD   = '#F6C500';
const NAVY   = '#1C1832';
const GRAY   = '#5D5D60';
const LIGHT  = '#f0f0f0';

Chart.defaults.font.family = "'Open Sans', sans-serif";
Chart.defaults.color = GRAY;

// Keywords chart
(function() {
  const labels = ["digital humanities", "minimal computing", "sustainability", "pedagogy", "multilingualism", "indigenous data sovereignty", "accessibility", "access", "ethnography", "mapping", "activism", "cultural analytics", "ecology", "language infrastructure", "deep learning ocr", "south asian scripts", "responsible ai", "digital cultural heritage"];
  const values = [4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];
  const ctx = document.getElementById('keywordsChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: values.map((v,i) => i < 4 ? GOLD : '#C8A000'),
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} paper${ctx.parsed.x !== 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: LIGHT },
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Number of papers' }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        }
      }
    }
  });
})();

// Panels chart
(function() {
  const labels = ["Digital Infrastructures 1", "Data Sovereignty", "Accessibility and Sustainability in the Archive", "Community-Engaged DH Practices", "Computational Textual Analysis", "Multilingual DH and Transcription", "Digital Mapping as Method and Practice", "Media, Film, and Screenplay Analytics", "Digital Infrastructures 2", "Surveillance, Law, and User Agency", "Reimagining Historical Datasets", "Synesthetic Arts", "Critiques and Uses of Generative AI", "Environmental DH & Ecological Modeling"];
  const values = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2];
  const ctx = document.getElementById('panelsChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: NAVY,
        hoverBackgroundColor: GOLD,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} paper${ctx.parsed.x !== 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: LIGHT },
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Number of papers' }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
})();

// Geography doughnut
(function() {
  const labels = ["Gulf", "South Asia", "East Asia", "SE Asia", "Europe", "Americas (Central)", "Americas (East)", "Americas (West)", "Multiple/Unknown", "UTC/Unknown", "Americas (Mountain)"];
  const values = [1, 4, 1, 1, 3, 6, 12, 7, 3, 1, 2];
  const palette = ['#F6C500','#1C1832','#5D5D60','#A0845C','#3B4B7A',
                   '#8B7355','#2E6B7A','#7A2E5C','#4A7A2E','#7A4A2E'];
  const ctx = document.getElementById('geoChart');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: palette.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      cutout: '55%',
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 14, padding: 12, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed} presenter${ctx.parsed !== 1 ? 's' : ''}`
          }
        }
      }
    }
  });
})();

/* ── Program browser ─────────────────────────────────── */
(function() {
  const cards  = document.getElementById('vizCards');
  const search = document.getElementById('vizSearch');
  const select = document.getElementById('vizPanel');
  const none   = document.getElementById('vizNoResults');

  // Populate panel filter
  const panels = [...new Set(PAPERS.map(p => p.panel))].sort();
  panels.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  function render() {
    const q  = search.value.toLowerCase();
    const pf = select.value;
    const filtered = PAPERS.filter(p => {
      const matchPanel = !pf || p.panel === pf;
      const matchQ = !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q));
      return matchPanel && matchQ;
    });
    cards.innerHTML = '';
    none.hidden = filtered.length > 0;
    filtered.forEach(p => {
      const div = document.createElement('div');
      div.className = 'viz-card';
      div.innerHTML = `
        <div class="viz-card-panel">${p.panel}</div>
        <div class="viz-card-title">${p.title}</div>
        <div class="viz-card-authors">${p.authors}</div>
        ${p.keywords.length ? '<div class="viz-card-kws">' + p.keywords.map(k => `<span class="viz-kw">${k}</span>`).join('') + '</div>' : ''}
      `;
      cards.appendChild(div);
    });
  }

  search.addEventListener('input', render);
  select.addEventListener('change', render);
  render();
})();
</script>
