$(document).ready(function(){
	var center = new google.maps.LatLng(42.345573,-71.098326);
	var mapOptions = {
	    center: center,
	    zoom: 14,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById('location-map'), mapOptions);
	$('#hide-button').click(function(){
		alert(map.getStreetView().getPano());
	});
});
