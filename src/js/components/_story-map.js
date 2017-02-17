var L = require('mapbox.js'),
    smoothScroll = require('../utilities/_smooth-scroll')
    mapPoints = require('../data/_story-map'),
    mq = require('../data/_media-queries.json');


function sherlockMap() {
  var mapContainer = document.querySelector('#map'), // Select the map container.
      map = _initMap(), // Initialise the map and get the map object back.
      mapHeight = mapContainer.clientHeight, // Get the height of the map.
      narrative = document.getElementById('js-narrative'), // Narrative column.
      narrativeHeight = narrative.clientHeight, // Get the height of the narratice column.
      sectionLink = sections = document.querySelectorAll('.js-section'), // Clickable sections.
      sectionsLength = sections.length, // Number of sections available.
      smallScreenWidth = 600, // Width here we change to single column view.
      scrollDuration = 1000, // How long automatic scrolling should take.
      isScrolling = false, // Define is scrolling is happening automatically.
      activeSection, // Make a new variable to store the ID of the active section.
      newActiveSection, // Make a new variable to store the ID of the 'new' active section as we scroll.
      isSingleColumn = !window.matchMedia(mq.small).matches; // This the single column (small screen) view?


  // Objects to contain the marker options.
  function _mapIcon(iconSize, className, html) {
    return {
      iconSize,
      className,
      html
    }
  };
  var icon = _mapIcon(null, 'map-marker', null);
  var activeIcon = _mapIcon(null, 'map-marker is-active', null);


  function _initMap() {
    // Set the access token to get tiles from mapbox.
    L.mapbox.accessToken = 'pk.eyJ1IjoibW9hcy11b24iLCJhIjoiY2l5bGpnbHZnMDA0YjJ3anJ0NzMwdTFrbiJ9.oaFP-ohA9RqY10RmqCeGeA';

    // Create the map inside a div with an id of 'map'.
    return L.mapbox.map(mapContainer, 'mapbox.dark', {
      zoomControl: false,
      scrollWheelZoom: false
    });
  }


  // Create a feature layer on the map.
  var pointsLayer = L.mapbox.featureLayer().addTo(map);

  // Define the icon for each point and set on the map.
  pointsLayer.on('layeradd', function(e) {
    icon.html = e.layer.feature.properties.id;
    e.layer.setIcon(L.divIcon(icon));
  });
  pointsLayer.setGeoJSON(mapPoints);


  // Set the bounds of the map to contain the data in the loaded GeoJSON for the fiest time.
  map.fitBounds(pointsLayer.getBounds());


  function _resetMap() {
    // Reset the map position using in a fancy animated way.
    map.flyToBounds(pointsLayer.getBounds());

    // Ensure there is no active map pin.
    pointsLayer.eachLayer(function(layer) {
      // Remove the active class from all map markers.
      icon.html = layer.feature.properties.id;
      layer.setIcon(L.divIcon(icon));
    });
  }


  function _scrollToSection(htmlId) {
    // We are scrolling.
    isScrolling = true;

    // Define how far we are scrolling.
    var scrollPadding = (htmlId === 'cover') ? 0 : 50,
        topScrollOffset = (isSingleColumn) ? mapHeight : 0;

    // Scroll smoothly to element.
    smoothScroll.scroll('#' + htmlId, scrollDuration, topScrollOffset + scrollPadding);

    // Set as active section
    _setActiveSection(htmlId);

    // We are not scrolling, after the scroll duraration.
    setTimeout(function() {
      isScrolling = false;
    }, scrollDuration)
  }


  function _setActiveSection(newActiveSection) {

    // If the section trying to made active is already active, stop.
    if (newActiveSection === activeSection) {
      return;
    }

    // If there is an active section, remove the is-active class.
    if (activeSection) {
      document.getElementById(activeSection).classList.remove('is-active');
    }

    // If the section being activated is the cover, clear the active section and reset the map.
    if (newActiveSection === 'cover') {
      activeSection = null;
      _resetMap();
      return;
    }

    // Add the is-active class to the new active section and update the active section.
    document.getElementById(newActiveSection).classList.add('is-active');
    activeSection = newActiveSection;

    pointsLayer.eachLayer(function(layer) {

      // Remove the active class from all map markers, put the ID back in the icon object.
      icon.html = layer.feature.properties.id;
      layer.setIcon(L.divIcon(icon));
      if (layer.feature.properties.htmlId === newActiveSection) {

        // Go to the section marker at the zoom level defined in the GeoJSON, or 16 if undefined.
        map.flyTo(layer.getLatLng(), layer.feature.properties.zoom || 16);

        // Set the marker to active for new active section, but the ID in the activeIcon object.
        activeIcon.html = layer.feature.properties.id;
        layer.setIcon(L.divIcon(activeIcon));
      }
    });
  }


  // Redefine variables on resize
  window.addEventListener('resize', function() {
    mapHeight = mapContainer.clientHeight;
    narrativeHeight = narrative.clientHeight;
    isSingleColumn = !window.matchMedia(mq.small).matches;
  });


  // Listen for clicks on narrative and scroll to the clicked section.
  for (var i = 0; i < sectionLink.length; i++) {
    sectionLink[i].addEventListener('click', function() {
      _scrollToSection(this.id);
    });
  }


  // Listen for clicks on markers and scroll to the clicked section.
  pointsLayer.eachLayer(function(layer) {
    layer.addEventListener('click', function() {
      _scrollToSection(layer.feature.properties.htmlId);
    });
  });


  // Listen for scrolling, set the active section IF the scrolling isn't automatic.
  window.addEventListener('scroll', function() {

    // Since we have click events that trigger scrolling, only do this if we aren't automatically sctolling already.
    if (!isScrolling) {

      // Iterate through the sections backwards so we get the topmost section in the viewport.
      for (var i = sectionsLength - 1; i >= 0; i--) {
        var rect = sections[i].getBoundingClientRect();

        // Set the point at which a section becomes active. Must be entirely in the narrative, taking into account single column view on small screens.
        if (((isSingleColumn && rect.top >= mapHeight) || (!isSingleColumn && rect.top >= 0)) && rect.top <= narrativeHeight) {
          if (sections[i].id != newActiveSection)
            newActiveSection = sections[i].id;
        }
      };
      _setActiveSection(newActiveSection);
    }
  });
}


module.exports = {
  sherlock: sherlockMap
};
