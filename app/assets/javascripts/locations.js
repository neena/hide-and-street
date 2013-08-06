//Generating locations
$(document).ready(function(){
	var endLocation = new google.maps.LatLng($('#endpoint #lat').val(),$('#endpoint #lng').val());
	var helper = new google.maps.StreetViewService();
	var endLocationLatLong = helper.getPanoramaByLocation(endLocation,50);
	console.log(endLocationLatLong);
});