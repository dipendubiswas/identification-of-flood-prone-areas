// Initialize map
const map = L.map('map').setView([21.734791, 88.112761], 11);

// Base layers
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM, Developed by Dipendu Biswas' });
const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri Satellite Image, Developed by Dipendu Biswas' }).addTo(map);

const baseMaps = {
  "OpenStreetMap": osm,
  "Esri Satellite": esriSat
};
L.control.layers(baseMaps).addTo(map);

// Marker clustering
const markers = L.markerClusterGroup();
map.addLayer(markers);

// Feature group for drawings
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Draw control
const drawControl = new L.Control.Draw({
  edit: { featureGroup: drawnItems },
  draw: { circle: false, circlemarker: false }
});
map.addControl(drawControl);

// Chart.js setup
const ctx = document.getElementById('summaryChart').getContext('2d');
const summaryChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Flood', 'Dark Spot'],
    datasets: [{
      label: 'Counts',
      data: [0, 0],
      backgroundColor: ['blue', 'red']
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

// Update chart counts
function updateChart() {
  let flood = 0, dark = 0;
  drawnItems.eachLayer(layer => {
    const type = layer.feature?.properties?.issueType?.toLowerCase();
    if (type === 'flood') flood++;
    if (type === 'dark spot') dark++;
  });
  summaryChart.data.datasets[0].data = [flood, dark];
  summaryChart.update();
}

// On feature created
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;

  const areaName = prompt("Enter Area Name:");
  const type = prompt("Type of Issue (flood/dark spot):");
  const notes = prompt("Observation Notes:");

  layer.feature = {
    type: "Feature",
    properties: { areaName, issueType: type, notes }
  };

  if (type?.toLowerCase() === 'flood') {
    layer.setStyle?.({ color: 'blue' });
  } else if (type?.toLowerCase() === 'dark spot') {
    layer.setStyle?.({ color: 'red' });
  }

  layer.bindPopup(`
    <b>${areaName}</b><br/>
    Type: ${type}<br/>
    Notes: ${notes}
  `);

  drawnItems.addLayer(layer);

  if (layer instanceof L.Marker) markers.addLayer(layer);

  updateChart();
});

// Export GeoJSON
document.getElementById('export').addEventListener('click', () => {
  const data = drawnItems.toGeoJSON();
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "features.geojson";
  a.click();
});

// Reset chart
document.getElementById('reset').addEventListener('click', () => {
  summaryChart.data.datasets[0].data = [0, 0];
  summaryChart.update();
});

// 📍 Sentinel WMS Logic
let sentinelLayer = null;
const sentinelBBox = [
  [21.571121, 87.824427], // SW
  [21.930816, 88.44833]   // NE
];

const sentinelDates = {
  "2020-03-01": "2020-03-01/2020-03-31",
  "2025-03-01": "2025-03-01/2025-03-31"
};

// Show loader
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Hide loader
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Load Sentinel Layer
function updateSentinelLayer(date) {
  if (sentinelLayer) {
    map.removeLayer(sentinelLayer);
    sentinelLayer = null;
  }

  if (!date) {
    console.log("No Sentinel date selected — layer removed.");
    return;
  }

  const timeRange = sentinelDates[date];
  if (!timeRange) {
    console.warn("Selected date has no configured time range.");
    return;
  }

  map.fitBounds(sentinelBBox);
  showLoader();

  sentinelLayer = L.tileLayer.wms(
    "https://services.sentinel-hub.com/ogc/wms/fa1c8af3-fd9b-4baf-a007-c51de0dde728", {
      layers: "2_FALSE_COLOR",
      time: timeRange,
      tileSize: 512,
      format: "image/png",
      transparent: true,
      attribution: "&copy; Sentinel Hub",
      zIndex: 10
    }
  );

  sentinelLayer.on("load", () => {
    console.log(`Sentinel layer for ${date} loaded.`);
    hideLoader();
  });

  sentinelLayer.on("tileerror", () => {
    console.log("Error loading Sentinel tiles.");
    hideLoader();
  });

  sentinelLayer.addTo(map);
}

// Initial load if value exists
const initialDate = document.getElementById("sentinelDate").value;
if (initialDate) updateSentinelLayer(initialDate);

// Listen for date changes
document.getElementById("sentinelDate").addEventListener("change", (e) => {
  const selectedDate = e.target.value;
  updateSentinelLayer(selectedDate);
});
