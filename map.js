// Mappa Leaflet interattiva - Castel Gandolfo & Lago Albano
// Marker con coordinate approssimative per il borgo e il cratere del lago
(function () {
  if (typeof L === 'undefined') return;
  var mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Centro sul cratere del lago (tra borgo e riva)
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([41.7495, 12.6510], 14);

  // Tile Carto Voyager - stile editoriale caldo, licenza CC-BY OpenStreetMap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Icone tematiche - colori dal design system
  function icon(color) {
    return L.divIcon({
      className: 'map-marker',
      html:
        '<div style="width:26px; height:26px; border-radius:50% 50% 50% 0; background:' +
        color +
        '; transform:rotate(-45deg); border:2px solid #F5EEDD; box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26]
    });
  }
  var COL = { luogo: '#B4441F', spiaggia: '#1F5F73', ristorante: '#8B4513', alloggio: '#2A5F3F' };

  var points = [
    // --- Luoghi principali (borgo) ---
    { lat: 41.7461, lng: 12.6512, color: COL.luogo, title: 'Palazzo Apostolico', body: 'Residenza estiva dei Papi. Museo aperto (verificare orari). Biglietto intero €11, ridotto €5. <a href="./cosa-vedere.html#palazzo-apostolico">Dettagli</a>.' },
    { lat: 41.7466, lng: 12.6517, color: COL.luogo, title: 'Piazza della Libertà', body: 'Piazza berniniana, ospita la Collegiata di San Tommaso e la prima cassetta postale al mondo (1820).' },
    { lat: 41.7455, lng: 12.6470, color: COL.luogo, title: 'Villa Barberini · Borgo Laudato Si\'', body: '55 ettari di giardini pontifici. Visita €26 intero / €15 ridotto. <a href="https://www.laudatosi.va/visite-aperte-al-pubblico/" target="_blank" rel="noopener">laudatosi.va</a>' },
    { lat: 41.7448, lng: 12.6558, color: COL.luogo, title: 'Belvedere Giovanni XXIII', body: 'Vista più fotografata del cratere. Aperto sempre, ingresso libero.' },
    { lat: 41.7523, lng: 12.6552, color: COL.luogo, title: 'Collegiata di San Tommaso da Villanova', body: 'Chiesa di Bernini (1658-1661), pala di Pietro da Cortona.' },

    // --- Spiagge e stabilimenti (lago) ---
    { lat: 41.7565, lng: 12.6395, color: COL.spiaggia, title: 'Vagea Lido', body: 'Sponda sud. Lettini + ombrellone da 15-20 euro. Bar e ristorante.' },
    { lat: 41.7600, lng: 12.6440, color: COL.spiaggia, title: 'Le Ninfe', body: 'Sponda est. Solarium in erba, beach volley, chiosco.' },
    { lat: 41.7530, lng: 12.6350, color: COL.spiaggia, title: 'Tropicana Lido', body: 'La spiaggia sabbiosa più estesa. Animazione musicale.' },
    { lat: 41.7620, lng: 12.6485, color: COL.spiaggia, title: 'Le Lunette', body: 'Stabilimento discreto sulla sponda nord.' },
    { lat: 41.7585, lng: 12.6510, color: COL.spiaggia, title: 'Mad Village By Lagolandia', body: 'Complesso con piscina, ristorante, area giochi.' },

    // --- Ristoranti (verificati nella guida) ---
    { lat: 41.7458, lng: 12.6533, color: COL.ristorante, title: 'Ristorante Pagnanelli', body: 'Cucina tradizionale con terrazza sul cratere. <a href="./dove-mangiare.html">Dettagli</a>.' },
    { lat: 41.7463, lng: 12.6501, color: COL.ristorante, title: 'La Perla del Lago', body: 'Panorama sul lago, cucina di pesce e specialità dei Castelli.' },
    { lat: 41.7469, lng: 12.6515, color: COL.ristorante, title: 'Bucci', body: 'Ristorante storico del borgo, sala interna e piccola terrazza.' },
    { lat: 41.7472, lng: 12.6522, color: COL.ristorante, title: 'Antico Ristorante Pagnanelli', body: 'Cucina romana e dei Castelli, cantina di pregio.' },
    { lat: 41.7460, lng: 12.6495, color: COL.ristorante, title: 'Osteria Sora Maria', body: 'Trattoria familiare, cucina povera del borgo.' },

    // --- Alloggi selezionati (borgo e lago) ---
    { lat: 41.7466, lng: 12.6510, color: COL.alloggio, title: 'Hotel Castelvecchio', body: 'Hotel 4 stelle nel borgo storico. <a href="./dove-dormire.html">Dettagli</a>.' },
    { lat: 41.7454, lng: 12.6528, color: COL.alloggio, title: 'Hotel Antico Sogno', body: 'Piccolo hotel di charme con vista sul lago.' },
    { lat: 41.7480, lng: 12.6540, color: COL.alloggio, title: 'B&B Al Palazzetto', body: 'Bed & breakfast nel cuore del borgo, colazione italiana.' },
    { lat: 41.7440, lng: 12.6485, color: COL.alloggio, title: 'Villa del Cardinale', body: 'Residenza panoramica su Villa Barberini.' },
    { lat: 41.7590, lng: 12.6440, color: COL.alloggio, title: 'Casa sul Lago', body: 'Casa vacanza direttamente affacciata sul cratere.' }
  ];

  var group = L.featureGroup();
  points.forEach(function (p) {
    var m = L.marker([p.lat, p.lng], { icon: icon(p.color), title: p.title });
    m.bindPopup(
      '<div style="font-family:Inter, system-ui, sans-serif; max-width:220px">' +
        '<strong style="display:block; font-size:0.95rem; color:#28251D; margin-bottom:4px">' + p.title + '</strong>' +
        '<div style="font-size:0.85rem; line-height:1.45; color:#4A4A45">' + p.body + '</div>' +
      '</div>'
    );
    m.addTo(map);
    group.addLayer(m);
  });

  map.fitBounds(group.getBounds().pad(0.15));

  // Sblocca la rotella al focus, ma non subito (evita scroll accidentali durante navigazione)
  map.on('focus', function () { map.scrollWheelZoom.enable(); });
  map.on('blur', function () { map.scrollWheelZoom.disable(); });
})();
