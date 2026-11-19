const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .leaflet-container { background: \${theme === 'dark' ? '#242f3e' : '#ffffff'}; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([12.9716, 77.5946], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        var marker = null;
        map.on('click', function(e) {
          if (marker) {
            marker.setLatLng(e.latlng);
          } else {
            marker = L.marker(e.latlng).addTo(map);
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'marker',
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });
      </script>
    </body>
    </html>
`;

export default mapHtml;