
// Main viewmodel class
define(['../libs/knockout/knockout.min'], function(ko) {
	/**
	 * @class AppViewModel Prototype
	 */
	function AppViewModel(){
		var self = this;
		/**
		 * @property input for the updating of the locations list.
		 * @type ko.observable
		 */
		self.searchTerms = ko.observable('');

		/**
		 * @property locations
		 * @type array of objects
		 */
		self.locations = [
			{name:'Champetieres', 
				description:'Sympathique bourgade où il fait bon vivre',
			    lat: 45.518391,
    			lng: 3.694525,
    			visible: ko.observable(true)},
			{name:'Osny', 
				description:'This is home',
				lat: 49.069760,
    			lng: 2.063321,
    			visible: ko.observable(true)},
			{name:'Paris',  
				description:'This is also home',
				lat: 48.857031,
    			lng: 2.352018,
    			visible: ko.observable(true)},
    		{name:'New York',  
				description:'I\'ve been to New York, once. Best week-end ever.',
				lat: 40.714425,
    			lng: -73.994817,
    			visible: ko.observable(true)},
    		{name:'Fes',  
				description:'Fes is truly one of the most charming cities in the World',
				lat: 34.015706,
    			lng: -5.007921,
    			visible: ko.observable(true)},
			];

		/**
		 * @property map handler
		 * @type {MapHandler}
		 */
		var mapHandler = new MapHandler();

		//initialize map
		mapHandler.initMap({lat:self.locations[0].lat, lng:self.locations[0].lng});
	    
	    //Then place markers
	    
	    var markers = [];
		self.locations.forEach((val, i, t)=>{
			markers.push(new google.maps.Marker({
				position: {lat:val.lat, lng:val.lng},
				map: map,
				title:''
			}));
		});



	    self.__defineGetter__('mapHandler', function(){
	        return mapHandler;
	    });

	    /**
	     * @brief locationContainsString check if a location name contains a given string
	     * @param  {string} location the location
	     * @param  {string} string the strong
	     * @return {boolean} TRUE or FALSE
	     */
	    var locationBeginsWithString = function(location, string){
	    	var len = string.length;
	    	var res = false;
	    	if(location.name.length >= len) {
				res = (location.name.substring(0, len).toLowerCase() == string.toLowerCase());
	    	} else {
	    		res = false;
	    	}
	    	return res;
	    };

	    self.__defineGetter__('locationBeginsWithString', function(){
	    	return locationBeginsWithString;
	    });
	}

	/**
	 * @brief apply filter on the locations list
	 * @return {void}
	 */
	AppViewModel.prototype.filterLocations = function(data, event){
		this.locations.forEach((location, index, array) => {
			if(this.locationBeginsWithString(location, this.searchTerms())){
				location.visible(true);
			} else {
				location.visible(false);
			}
		});
	}

	AppViewModel.prototype.focusOnLocation = function(location){
		//TODO : 
	}


	/**
	 * @class MapHandler
	 */
	function MapHandler(){
		var self = this;

		var map;

	    this.__defineGetter__('map', function(){
	        return map;
	    });

	    this.__defineSetter__('map', function(map_){
	        map = map_;
	    });
	}

	/**
	 * @brief init map
	 * @return {map}
	 */
	MapHandler.prototype.initMap = function(center_){
	  // Create a map object and specify the DOM element for display.
	  self.map = new google.maps.Map(document.getElementById('map'), {
	    center: center_,
	    scrollwheel: true,
	    zoom: 2,
	    rotateControl: true,
	    streetViewControl: false,
	    zoomControl: true
	  });
	};

    return AppViewModel;
});
