var L = require('mapbox.js');
var mapPoints = require('../data/_marker-clusters');

require('leaflet.markercluster');


function markerCluster() {
  var mapContainer = document.querySelector('#map'); // Select the map container.
  var map = _initMap(); // Initialise the map and get the map object back.

  function _initMap() {
    // Set the access token to get tiles from mapbox.
    L.mapbox.accessToken = 'pk.eyJ1IjoibW9hcy11b24iLCJhIjoiY2l5bGpnbHZnMDA0YjJ3anJ0NzMwdTFrbiJ9.oaFP-ohA9RqY10RmqCeGeA';

    // Create the map inside a div with an id of 'map'.
    return L.mapbox.map(mapContainer, 'mapbox.dark');
  }

  // Create a layer for our pins and plot them from GeoJSON.
  var pointsLayer = L.mapbox.featureLayer().addTo(map);
  pointsLayer.setGeoJSON(mapPoints);

  // Set the bounds of the map to contain the data in the loaded GeoJSON.
  map.fitBounds(pointsLayer.getBounds());

}


module.exports = {
  cluster: markerCluster
};
