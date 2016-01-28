// Main viewmodel class
define([], function() {
	/**
	 * @class DomHandler Prototype
	 */
	function Marker(googleMarker, infoWindow){
		var self = this;

		self.marker = googleMarker;
		self.infoWindow = infoWindow;
	}


	Marker.prototype.addListenerOnMarker = function(eventName, callback) {
		this.marker.addListener(eventName, callback);
	};
    return Marker;
});
