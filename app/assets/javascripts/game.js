
$(document).ready(function() {
	
	if (typeof(Number.prototype.toRad) === "undefined") {
	  	Number.prototype.toRad = function() {
	    	return this * Math.PI / 180;
	  	}
	}



	globals = {}
	var Street = {
		init: function() {
			// Set up varibles & maps
			Street.setupGame();
		},
		bindEvents: function() {
			google.maps.event.addListener(globals.panorama, 'pano_changed', Street.panoChanged);
		},
		compareIDs: function() {
			if (globals.currentID == globals.endID) {
				// You are on the spot
			}
		},
		panoChanged: function() {

			globals.currentID = globals.panorama.getPano();
			globals.currentlatLng = globals.panorama.getPosition();

			Street.compareIDs();

			Street.distanceBetween(globals.currentlatLng, globals.endlatLng);
		},
		setupGame: function() {

			globals.startID = "Wfr9hxmNdnNs7TeScyBfJg";
			Street.getPanoIDLocation(globals.startID, function(callback) {
				globals.startlatLng = callback;
			});

			globals.endID = "pFytalyiJWo3L7Ya9e4eEg";
			Street.getPanoIDLocation(globals.endID, function(callback) {
				globals.endlatLng = callback;
			});

			
			Street.getPanoIDLocation(globals.startID, Street.makeMap)

		},
		getPanoID: function(lat, lng, callback) {
			var sv = new google.maps.StreetViewService();
			var position = new google.maps.LatLng(lat, lng);
			sv.getPanoramaByLocation(position, 50, function(data) {
				var pano = data.location.pano;
				callback(pano);
			});

		},
		getPanoIDLocation: function(id, callback) {
			var sv = new google.maps.StreetViewService();
			var item = sv.getPanoramaById(id, function(data) {
				var pano = data.location.latLng;
				callback(pano);
			});
		},
		makeMap: function(location) {
			// Create new Google Map with position

			// From this, build street view item
			var panoramaOptions = {
			    position: location,
			    zoomControl: false,
			    enableCloseButton: false,
			    addressControl: false,
  				panControl: false,
			    pov: {
			      heading: 34,
			      pitch: 10
			    }
			};
			
			// Show Street View item
			globals.panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'),panoramaOptions);
			globals.currentID = globals.panorama.getPano();
			globals.currentlatLng = globals.panorama.getPosition();

			Street.bindEvents();


			globals.panorama.setPosition(location);

		},
		distanceBetweenCrow: function(start, end) {	
			return Math.ceil(google.maps.geometry.spherical.computeDistanceBetween(start, end));
		},
		distanceBetweenGoogle: function(start, end) {
			var distance = this;
			var request = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + start.lb + "," + start.mb + "&destinations=" + end.lb + "," + end.mb + "&mode=driving&sensor=false"
			var result = $.ajax({
				url: request,
				datatype: 'json',
				async: false
			}).responseText;
			return result;
		},
		distanceBetween: function(start, end) {
			if (typeof start !== undefined && end !== undefined) { 
				var distance = 1;
				var result = $.parseJSON(Street.distanceBetweenGoogle(start, end));
				if (result.rows[0].elements[0].status == "OK") {
					distance = result.rows[0].elements[0].distance.value;

				}
				else {
					distance = Street.distanceBetweenCrow(start, end);
				}
				
				return distance;

			}
		},

		getNearestRoad: function(lat, lng) {


			// Replace with function for nearest Street View

			/*
			if (typeof lat !== undefined && lng !== undefined) {
				
				var directionsService = new google.maps.DirectionsService();
				var position = new google.maps.LatLng(lat, lng);

			    var request = {
			        origin:position, 
			        destination:position,
			        travelMode: google.maps.DirectionsTravelMode.DRIVING
			    };

			    directionsService.route(request, function(response, status) {
			      	if (status == google.maps.DirectionsStatus.OK) {
			      		var road = response.routes[0].legs[0].start_location;
			      	}
			      	else {
			      		// Request new position from backend
			      	}
			    });
				
			}
			else {
				console.log("getNearestRoad: lat, lng not set");
			}

			*/

		}
	}
	Street.init();
})
