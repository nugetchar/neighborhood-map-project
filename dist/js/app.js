
define(['../libs/knockout/knockout.min','../libs/bootstrap/js/bootstrap.min','./AppViewModel','./interactions','domReady!'],function(ko,bootstrap,avm,interactions){'use strict';var appViewModel;var firebase=new Firebase("https://neighborhood.firebaseio.com/");firebase.child("locations").on("value",function(snapshot){var locations=snapshot.val();appViewModel=new avm(locations);ko.applyBindings(appViewModel);interactions();});google.maps.event.addDomListener(window,'resize',function(){var map=appViewModel.mapHandler.map;var center=map.getCenter();google.maps.event.trigger(map,'resize');map.setCenter(center);});});