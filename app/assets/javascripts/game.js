
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
		winGame: function() {

			var finalTime = Street.getTime();
			var time = finalTime - globals.startTime; // Time milliseconds 

			var steps = globals.steps; // Steps

			$("#winner").modal("show")
			$heat.css("background","rgba(255,0,0,1)");
			$num.html("0");
		},
		compareIDs: function() {
			if (globals.currentID == globals.endID) {
				// You are on the spot
				Street.winGame();
			}
		},
		panoChanged: function(location) {
			globals.steps++;

			globals.currentID = globals.panorama.getPano();
			globals.currentlatLng = globals.panorama.getPosition();

			Street.compareIDs();
			
			var distance = Street.distanceBetween(globals.currentlatLng, globals.endlatLng);
			Street.distanceCalculate(distance);
		},
		getTime: function() {
			var d = new Date();
			var n = d.getTime();
			return n;
		},
		setupGame: function() {
			globals.totalDistance = Street.distanceBetween(globals.startlatLng, globals.endlatLng);
			Street.makeMap(globals.startlatLng);

			globals.startTime = Street.getTime();
			globals.steps = 0;

			i = 0;
		},

		makeGradientColor: function(color1, color2, percent) {

			// http://stackoverflow.com/questions/8732401/how-to-figure-out-all-colors-in-a-gradient
		    var newColor = {};

		    function makeChannel(a, b) {
		        return(a + Math.round((b-a)*(percent/100)));
		    }

		    function makeColorPiece(num) {
		        num = Math.min(num, 255);   // not more than 255
		        num = Math.max(num, 0);     // not less than 0
		        var str = num.toString(16);
		        if (str.length < 2) {
		            str = "0" + str;
		        }
		        return(str);
		    }

		    newColor.r = makeChannel(color1.r, color2.r);
		    newColor.g = makeChannel(color1.g, color2.g);
		    newColor.b = makeChannel(color1.b, color2.b);
		    newColor.cssColor = "#" + 
		                        makeColorPiece(newColor.r) + 
		                        makeColorPiece(newColor.g) + 
		                        makeColorPiece(newColor.b);
		    return(newColor);
		},
		distanceCalculate: function(distance) {

			// 4 sets of 255 colour changes
			// 1020 steps

			var totalDistance = globals.totalDistance;
			var scale = totalDistance + (0.25 * totalDistance);

			var percentage = (distance / scale) * 100;

			if (percentage > 100) { percentage = 100; }
			else if (percentage < 0) { percentage = 0.01; }

			var yellow = {r:255, g:0, b:0};
			var blue = {r:0, g:0, b:255};

			var newColor = Street.makeGradientColor(yellow, blue, percentage);

			$heat.css("background-color", newColor.cssColor);

			var previous = Number($num.html());

			if (previous < distance) {
				var timer = setInterval(function() {
					$num.html(previous);
					if (Number(previous) >= Number(distance)) {
						clearInterval(timer);
					}
					previous++;
				}, 1);
			}
			else if (previous >= distance) {
				var timer = setInterval(function() {
					$num.html(previous);
					if (previous <= distance) {
						clearInterval(timer);
					}
					previous--;
				}, 1);
			}

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
				/*
				var result = $.parseJSON(Street.distanceBetweenGoogle(start, end));
				
				if (result.rows[0].elements[0].status == "OK") {
					distance = result.rows[0].elements[0].distance.value;

				}
				else {
					
					distance = Street.distanceBetweenCrow(start, end);
				}

				Using straight line due to problems with one way systems and all.
				
				*/

				distance = Street.distanceBetweenCrow(start, end);
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
				else {
					Street.getRandomStartpoint(endLocation);
				}
			});

			});
		},
		getNearestRoad: function(lat, lng) {

			var lat = Number($('#lat').html());
			var lng = Number($('#lng').html());
			var panoID = $.trim($('#panoid').html());

			if (panoID !== "") {
				console.log(panoID);
				Street.getPanoIDLocation(panoID, function(location) {
					console.log(location);
					Street.getRandomStartpoint(location, function(callback) {
						console.log("DONE");
					});
				})
			}
			else {
				var endLocation = new google.maps.LatLng(lat, lng);
				
				Street.getRandomStartpoint(endLocation, function(callback) {
					Street.setupGame();
				});
			}
		}
	}
	Street.init();
})
