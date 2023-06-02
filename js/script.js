const url =
  "https://opensheet.elk.sh/1PnOhL_PM_Q5RRdREONf2I0Ni-OKBUj9nijPQzOkruhw/DataBrute";
const miKollectAttribution =
  '&copy; <a href="https://www.mikollect.com">miKollect</a> ';
// Tiles
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
const cartoCdn = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
);
const EsriAerial = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
const Stamen_Terrain = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abcd",
    minZoom: 0,
    maxZoom: 18,
    ext: "png",
  }
);
const googleHybrid = L.tileLayer(
  "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  {
    minZoom: 2,
    maxZoom: 19,
    id: "google.hybrid",
  }
);
const googleSatellite = L.tileLayer(
  "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    minZoom: 2,
    maxZoom: 19,
    id: "google.satellite",
  }
);

const clusterMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

const mapCenter = [6.3895043, 2.4307995];
const myMap = L.map("theMap", { center: mapCenter, zoom: 16, layers: [osm] });
var featureGroup = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
}).addTo(myMap);
var baseMaps = {
  OpenStreetMap: osm,
  "Carto CDN": cartoCdn,
  "Google Satellite": googleSatellite,
  "Google Hybride": googleHybrid,
  "Esri Aerial": EsriAerial,
  Stamen: Stamen_Terrain,
};

var overlayMaps = {
  "Données Collectées": featureGroup,
};

const layerControl = L.control.layers(baseMaps, overlayMaps, {
  collapsed: false,
  sortLayers: true,
});
layerControl.addTo(myMap);

// Making a marker with a custom icon
/*const myIcon = L.icon({
  iconUrl: "iss200.png",
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});
let marker = L.marker([0, 0], { icon: myIcon }).addTo(myMap);*/
//let firstTime = true;

const fetchData = async () => {
  try {
    const reponseAPI = await fetch(url);
    const data = await reponseAPI.json();
    if (data) {
      console.log(data);
      showOnMap(data);
    }
  } catch (error) {
    console.error(error);
  }
};

const showOnMap = (data) => {
  data.map((item) => {
    var marker = L.marker([
      item._localisation_latitude,
      item._localisation_longitude,
    ]);
    marker.bindPopup(
      `<h1 class='text-xl'>${item.Degets_causes}</h1><br>${item.Origine}<br><img src=${item.Photo_environnement_URL}>`
    );
    featureGroup.addLayer(marker);
  });
};

fetchData();

// Legend
//var legend = L.control({ position: "bottomright" });
// legend.addTo(myMap);
setInterval(fetchData, 80000);

// Scale
const scale = new L.control.scale({
  metric: true,
  imperial: true,
  maxWidth: 100,
  updateWhenIdle: true,
  position: "bottomleft",
});
scale.addTo(myMap);
// Fullscreen
const setFullscreen = new L.Control.Fullscreen({
  title: {
    false: "View Fullscreen",
    true: "Exit Fullscreen",
  },
});
myMap.addControl(setFullscreen);

// Minimap
var miniMap = new L.Control.MiniMap(osm, {
  toggleDisplay: true,
  zoomLevelOffset: -3,
  width: 300,
  height: 200,
}).addTo(map);
// const miniMap = new L.Control.MiniMap(osm, { toggleDisplay: true });
miniMap.addTo(myMap);
