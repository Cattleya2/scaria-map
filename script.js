const url =
  "https://opensheet.elk.sh/1PnOhL_PM_Q5RRdREONf2I0Ni-OKBUj9nijPQzOkruhw/DataBrute";
const miKollectAttribution =
  '&copy; <a href="https://www.mikollect.com">miKollect</a> ';
// Tiles
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
const cartoCdn = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
);
const EsriAerial = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

const clusterMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

const mapCenter = [6.3895043, 2.4307995];
const myMap = L.map("theMap", { center: mapCenter, zoom: 16, layers: [osm] });
var featureGroup = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true
}).addTo(myMap);
var baseMaps = {
  OpenStreetMap: osm,
  "Carto CDN": cartoCdn,
  "Esri Aerial": EsriAerial
};
var overlayMaps = {
  "Data Brute": featureGroup
};
var layerControl = L.control.layers(baseMaps, overlayMaps, {}).addTo(myMap);

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
      item._localisation_longitude
    ]);
    marker.bindPopup(
      `<h1 class='text-xl'>${item.Degets_causes}</h1><br>${item.Origine}<br><img src=${item.Photo_environnement_URL}>`
    );
    featureGroup.addLayer(marker);
  });

  /* data.map((item) => {
   
    marker.bindPopup(
      `<h1 class='text-xl'>${item.Degets_causes}</h1><br>${item.Origine}<br><img src=${item.Photo_environnement_URL}>`
    );
  });*/
};

fetchData();

// Legend
//var legend = L.control({ position: "bottomright" });
// legend.addTo(myMap);
//setInterval(fetchData, 8000);