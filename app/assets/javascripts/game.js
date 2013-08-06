
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
			i = 10;
			var test = setInterval(function() {
				Street.distanceCalculate(i);
				console.log("-----------------------------------------------------------------------");
				if (i > 50) {
					clearInterval(test);
				}
				i++;
			}, 5)
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
			console.log(globals.currentID);
			
			var distance = Street.distanceBetween(globals.currentlatLng, globals.endlatLng);
			Street.distanceCalculate(distance);
		},
		distanceCalculate: function(distance) {

			// 4 sets of 255 colour changes
			// 1020 steps

			var totalDistance = Street.distanceBetween(globals.startlatLng, globals.endlatLng);
			var scale = totalDistance + (0.25 * totalDistance);

			var percentage = (distance / scale);

			if (percentage > 1) { percentage = 1; }
			else if (percentage < 0) { percentage = 0.01; }

			var steps = 1020;
			var currentSteps = steps * percentage;
			if (currentSteps >= 765) {
				var r = 0;
				var g = 255 - (currentSteps - 765);
				var b = 255;
			}
			else if (currentSteps < 765 && currentSteps >= 510) {
				var r = 0;
				var g = 255;
				var b = 255 - (765 - currentSteps);
			}
			else if (currentSteps < 510 && currentSteps >= 255) {
				var r = (510 - currentSteps);
				var g = 255;
				var b = 0;
			}
			else if (currentSteps < 255) {
				var r = 255;
				var g = currentSteps;
				var b = 0;
			}
			console.log(currentSteps);
			// console.log("rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ",1)");
			$(".logo").css("background","rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ",1)");


			//$("div").css("background", "rgba(2,34,34,1)");
		},
		setupGame: function() {

			globals.startID = "sbtgs2BPsQ6FQZNHLTZwcQ";
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
