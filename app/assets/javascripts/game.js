
$(document).ready(function() {
	
	if (typeof(Number.prototype.toRad) === "undefined") {
	  	Number.prototype.toRad = function() {
	    	return this * Math.PI / 180;
	  	}
	}

	$heat = $("#heat");
	$num = $("#num");

	globals = {};
	var Street = {
		init: function() {
			// Set up varibles & maps
			Street.getNearestRoad();
	
		},
		bindEvents: function() {
			google.maps.event.addListener(globals.panorama, 'position_changed', Street.panoChanged);
		},
		compareIDs: function() {
			if (globals.currentID == globals.endID) {
				// You are on the spot
				alert("You win");
				$heat.css("background","rgba(255,0,0,1)");
				$num.html("0");
			}
		},
		panoChanged: function(location) {
			globals.currentID = globals.panorama.getPano();
			globals.currentlatLng = globals.panorama.getPosition();

			Street.compareIDs();
			
			var distance = Street.distanceBetween(globals.currentlatLng, globals.endlatLng);
			Street.distanceCalculate(distance);
		},
		distanceCalculate: function(distance) {

			// 4 sets of 255 colour changes
			// 1020 steps

			var totalDistance = globals.totalDistance;
			var scale = totalDistance + (0.25 * totalDistance);

			var percentage = (distance / scale);

			if (percentage > 1) { percentage = 1; }
			else if (percentage < 0) { percentage = 0.01; }


			var steps = 1020;
			var currentSteps =  (steps * percentage);
			
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



			$heat.css("background","rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ",1)");

			var previous = Number($num.html());
			$num.html(currentSteps);
			
			if (previous < distance) {
				var timer = setInterval(function() {
					$num.html(previous);
					if (Number(previous) == Number(distance)) {
						clearInterval(timer);
					}
					previous++;
				}, 1);
			}
			else if (previous >= distance) {
				var timer = setInterval(function() {
					$num.html(previous);
					if (previous == distance) {
						clearInterval(timer);
					}
					previous--;
				}, 1);
			}

		},
		setupGame: function() {
			globals.totalDistance = Street.distanceBetween(globals.startlatLng, globals.endlatLng);
			Street.makeMap(globals.startlatLng);
			i = 0;
		},
		getPanoID: function(position, callback) {
			var sv = new google.maps.StreetViewService();
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
		getRandomStartpoint: function(endLocation, callback) {
			var helper = new google.maps.StreetViewService();
			helper.getPanoramaByLocation(endLocation, 50, function(data){
				
			globals.endlatLng = data.location.latLng;
			globals.endID = data.location.pano;

			var distance = Math.random()*100+100; //Start point is 100 to 200m from end
			var angle = Math.random()*360;

			var startLocation = new google.maps.geometry.spherical.computeOffset(globals.endlatLng, distance, angle);
			helper.getPanoramaByLocation(startLocation,50, function(data){
				if (data !== null) {
					globals.startlatLng = data.location.latLng;
					globals.startID = data.location.pano;
					Street.setupGame();
				}
			});

			});
		},
		getNearestRoad: function(lat, lng) {

			var lat = Number($('#lat').html());
			var lng = Number($('#lng').html());

			var endLocation = new google.maps.LatLng(lat, lng);
			
			Street.getRandomStartpoint(endLocation, function(callback) {
				Street.setupGame();
			});
		}
	}
	Street.init();
})
