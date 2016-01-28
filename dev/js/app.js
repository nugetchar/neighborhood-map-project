'use strict';



define(['../libs/knockout/knockout.min',
        './AppViewModel',
        '../libs/bootstrap/js/bootstrap.min',
        './interactions',
        'domReady!'], 
        function(ko, avm, bootstrap, interactions) {
    var appViewModel;

    //Contacting the database in order to retrieve locations
    var firebase = new Firebase("https://neighborhood.firebaseio.com/");
    firebase.child("locations").on("value", function(snapshot) {
        var locations = snapshot.val();
        appViewModel = new avm(locations);
        ko.applyBindings(appViewModel);
    });

  google.maps.event.addDomListener(window, 'resize', function() {
    var map = appViewModel.mapHandler.map;
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center); 
  });
});

