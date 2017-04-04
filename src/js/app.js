if (document.body.className.match('story-map')) {
  require('./components/_story-map').sherlock();
}

if (document.body.className.match('marker-clusters')) {
  require('./components/_marker-clusters').cluster();
}
