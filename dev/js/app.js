'use strict';



define(['../libs/knockout/knockout.min',
        './AppViewModel',
        '../libs/bootstrap/js/bootstrap.min',
        './interactions',
        'domReady!'], 
        function(ko, avm, bootstrap, interactions) {
    let appViewModel = new avm();
    ko.applyBindings(appViewModel);


  google.maps.event.addDomListener(window, 'resize', function() {
    let map = appViewModel.mapHandler.map;
    let center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center); 
  });
});

