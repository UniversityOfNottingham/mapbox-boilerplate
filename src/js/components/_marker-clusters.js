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

  // Create a marker cluster group and a layer of map points.
  var points = L.markerClusterGroup();
  var pointsLayer = L.geoJson(mapPoints);

  // Add the points to the map and set the bounds.
  points.addLayer(pointsLayer);
  map.addLayer(points);
  map.fitBounds(points.getBounds());
}


module.exports = {
  cluster: markerCluster
};
