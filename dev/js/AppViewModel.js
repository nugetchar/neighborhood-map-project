/*jslint esversion: 6 */

// Main viewmodel class
define(['../libs/knockout/knockout.min', 'jquery', './DomHandler', './Marker'], function(ko, jq, dh, mk) {
	//We must place it there so it only affects that function
	'use strict';
	
	/**
	 * @class AppViewModel Prototype
	 */
	function AppViewModel(locations){

		//==================   Private attributes
		let self = this;


		/**
		 * @property map handler
		 * @type {MapHandler}
		 */
		let mapHandler = new MapHandler();
	    mapHandler.markers = [];

	    //Boolean so we know when at least one location couldn't be found on Wikipedia
	    let errorLocation = false;

		/**
		 * @brief Get bounds regarding the locations array and their long lat
		 * This function is private
		 * @return google.maps.LatLngBounds
		 */
		let getBounds = function(){
			let bounds;
			let sw, ne;
			let location;
			let l;

			l = self.locations.length;
			//First we get the array sorted by latitude
			//Then we get it sorted by longitude
			self.locations.sort(function(a,b){
				return (a.lat - b.lat);
			}).sort(function(a,b){
				return (a.lng - b.lng);
			});
			location = self.locations[0];
			sw = {lat: location.lat, lng: location.lng};
			location = self.locations[l - 1];
			ne = {lat: location.lat, lng: location.lng};

			bounds = new google.maps.LatLngBounds(sw, ne);
			return bounds;
		};


		/**
		 * @brief Ask the DOM Handler to put the focus on the input text
		 * This function is private
		 */
		let focusOnInput = function(){
			self.domHandler.focusOnInput();
		};


		/**
		 * @brief as the Wikipedia API gives us an object which the 'extract' field is under a field
		 * with a variable name, we need this function in order to retrieve the 'extract' field
		 * @param obj JSON Object
		 * @param key the key
		 * @return an array of Objects containing directly the 'extract' field
		 */
		let getObjects = function(obj, key){
			var objects = [];
			for (var i in obj) {
			    if (!obj.hasOwnProperty(i)) continue;
			    if (typeof obj[i] === 'object') {
			        objects = objects.concat(getObjects(obj[i], key));
			    } else if (i === key) {
			        objects.push(obj);
			    }
			}
			return objects;
		};

		/**
		 * @brief retrieve a location's description
		 * @param  {[type]} location the location
		 * @param  {[type]} marker   a marker (from our custom prototype)
		 * @param  {[type]} self_    the AppViewModel instance
		 */
		let retrieveLocationDesc = function(title, marker, self_){
			let str = ['https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=',
						title, '&format=json&exintro=1'].join('');
			let extract;
			// Using jQuery
			jq.ajax({
			    url:  str ,
			    dataType: 'jsonp',
			    crossDomain: true,
			    type: 'POST',
			    headers: { 'Api-User-Agent': 'Example/1.0' }
			}).done((data) => {
			    	//We only take the first 240 characters and then put a link to see more
			    	extract = getObjects(data, 'extract')[0].extract.substring(0, 240);
			    	extract +=  '...<hr><em><a href="https://en.wikipedia.org/wiki/' +
			    				title +
			    				'" target="_blank">See more on Wikipedia</a></em>';
					marker.infoWindow = new google.maps.InfoWindow({content: extract});
			}).fail((error) => {
			    	if(!self_.errorLocation){
			        	self_.errorLocation = true;
			        	alert('Some data couldn\'t be retrieved. Maybe refresh the page or try later ?');
			    	}
			});
		};

		/**
		 * @brief initialize the AppViewModel
		 * @param  self_
		 */
		let initializeViewModel = function(self_){
			//initialize map
			let center_ = {lat:self_.locations[0].lat, lng:self_.locations[0].lng};
			mapHandler.initMap(center_, getBounds());
		    

			let infowindow;
  			let gMarker, marker;
			self_.locations.forEach((val, i, t)=>{
				gMarker = new google.maps.Marker({
					position: {lat:val.lat, lng:val.lng},
					map: self_.mapHandler.map,
					title: val.name,
					animation: null
				});
				//We create a Marker, based on our own prototype, so we can
				//encapsulate both the google map marker and the infoWindow
				marker = new mk(gMarker, infowindow);
				//We retrieve the location description
				retrieveLocationDesc(val.name, marker, self_);

				self_.mapHandler.markers.push(marker);

				//Finally, we ask our Marker to add a listener
				marker.addListenerOnMarker('click',
					self_.mapHandler.handleClickMarker.bind(self_.mapHandler, marker));
			});

			//We sort the locations array by names
			self_.locations.sort(function(a,b){
				let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
				if(nameA < nameB){
					return -1;
				}
				if(nameA > nameB){
					return 1;
				}
				return 0;
			});

			//We also sort the markers array by names
			self_.mapHandler.markers.sort(function(a,b){
				let nameA=a.marker.title.toLowerCase(), nameB=b.marker.title.toLowerCase();
				if(nameA < nameB){
					return -1;
				}
				if(nameA > nameB){
					return 1;
				}
				return 0;
			});
		};

		//========== GETTERS
		self.__defineGetter__('mapHandler', function(){
	        return mapHandler;
	    });
	    

	    //===== PROPERTIES AND FUNCTIONS

		/**
		 * @property the domHandler handles all the DOM manipulations
		 * which are not done with knockout (like jquery)
		 * @type {DomHandler}
		 */
		self.domHandler = new dh();


		/**
		 * @property input for the updating of the locations list.
		 * @type ko.observable
		 */
		self.searchTerms = ko.observable('');

		/**
		 * @property locations
		 * @type array of objects
		 */
		self.locations = locations;
		self.locations.forEach((val, i, t) => {
			val.visible = ko.observable(true);
		});
		self.listLocations = ko.observableArray(self.locations);

		/**
		 * @brief handle click on a location in the ListView
		 * @return {void}
		 */
		self.handleClickOnLocation = function(data, event){
			let t = self.mapHandler.markers;
			//We retrieve the correct marker, and then we activate it
			for(let i=0, l=t.length; i<l; i++){
				if(t[i].marker.title === data.name){
					self.mapHandler.toggleInfo(t[i]);
					self.mapHandler.toggleBounce(t[i].marker);
				} else {
					self.mapHandler.toggleInfo(t[i], true);
				}
			}
			focusOnInput();
		};

		//=============== TREATMENTS
		initializeViewModel(self);
	}


    /**
     * @brief locationContainsString check if a location name contains a given string
     * @param  {string} location the location
     * @param  {string} string the strong
     * @return {boolean} TRUE or FALSE
     */
	AppViewModel.prototype.locationContainsString = function(location, string){
    	let len = string.length;
    	let res = false;
    	if(location.name.length >= len) {
			res = (location.name.toLowerCase().indexOf(string.toLowerCase()) > -1);
    	} else {
    		res = false;
    	}
    	return res;
	};

	/**
	 * @brief apply filter on the locations list
	 * @return {void}
	 */
	AppViewModel.prototype.filterLocations = function(data, event){
		this.locations.forEach((location, index, array) => {
			if(this.locationContainsString(location, this.searchTerms())){
				location.visible(true);
				this.showMarker(index);
			} else {
				location.visible(false);
				this.hideMarker(index);
			}
		});
	};


	AppViewModel.prototype.showMarker = function(index){
		this.mapHandler.showMarker(index);
	};

	AppViewModel.prototype.hideMarker = function(index){
		this.mapHandler.hideMarker(index);
	};

	/**
	 * @class MapHandler
	 */
	function MapHandler(){
		let self = this;

		let map;

	    this.__defineGetter__('map', function(){
	        return map;
	    });

	    this.__defineSetter__('map', function(map_){
	        map = map_;
	    });


	    self.markers = [];
	}

	/**
	 * @brief init map
	 * @return {map}
	 */
	MapHandler.prototype.initMap = function(center_, bounds){
	  // Create a map object and specify the DOM element for display.
	  this.map = new google.maps.Map(document.getElementById('map'), {
	    //center: center_,
	    scrollwheel: true,
	    zoom: 2,
	    rotateControl: true,
	    streetViewControl: false,
	    zoomControl: true
	  });
	  this.map.fitBounds(bounds);
	};

	/**
	 * @brief toggleBounce to animate a marker
	 * @param  {[Marker]} marker [a marker on the map]
	 */
	MapHandler.prototype.toggleBounce = function(gMarker){
		if (gMarker.getAnimation() !== null) {
			gMarker.setAnimation(null);
		} else {
			gMarker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(() => {
				this.toggleBounce(gMarker);
			}, 1500);
		}
	};


	MapHandler.prototype.handleClickMarker = function(marker){
		this.toggleInfo(marker);
		if(this.isInfoWindowOpened(marker.infoWindow)){
			this.toggleBounce(marker.marker);
			this.markers.forEach((val, i, t) => {
				if(val !== marker){
					this.toggleInfo(val, true);
				}
			});
		}
	};

	MapHandler.prototype.toggleInfo = function(marker, closeIt){
		let shouldClose = (closeIt !== undefined && closeIt !== null) ? closeIt : this.isInfoWindowOpened(marker.infoWindow);

		if(shouldClose){
			marker.infoWindow.close();
		} else {
			marker.infoWindow.open(this.map, marker.marker);
		}

	};

	MapHandler.prototype.isInfoWindowOpened = function(infoWindow){
		return (infoWindow.map !== null && infoWindow.map !== undefined);
	};

	MapHandler.prototype.showMarker = function(index) {
		this.markers[index].marker.setMap(this.map);
	};

	MapHandler.prototype.hideMarker = function(index) {
		this.markers[index].marker.setMap(null);
	};
    return AppViewModel;
});
