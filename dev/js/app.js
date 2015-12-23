'use strict';



define(['../libs/knockout/knockout.min',
    './AppViewModel',
    '../libs/bootstrap/js/bootstrap.min',
    'domReady!'], 
    function(ko, avm, bootstrap) {
    var appViewModel = new avm();
    ko.applyBindings(appViewModel);


  google.maps.event.addDomListener(window, 'resize', function() {
    var map = appViewModel.mapHandler.map;
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center); 
  });
});

