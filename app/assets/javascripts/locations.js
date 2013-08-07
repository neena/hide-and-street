//Generating locations
$(document).ready(function(){
	var endLocation = new google.maps.LatLng($('#endpoint #lat').text(),$('#endpoint #lng').text());
	var helper = new google.maps.StreetViewService();
	helper.getPanoramaByLocation(endLocation,50, function(data){
		var endLocationLatLng = data.location.latLng;
		var endLocationID = data.location.pano;
		var distance = Math.random()*100+100; //Start point is 100 to 200m from end
		var angle = Math.random()*360;
		helper.getPanoramaByLocation(startLocation,50, function(data){
			var startLocationLatLng = data.location.latLng;
			var startLocationID = data.location.pano;
		});
	});
});

