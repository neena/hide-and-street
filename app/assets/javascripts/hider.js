$(document).ready(function(){
	var center = new google.maps.LatLng(52.48947,-1.886322);
	var mapOptions = {
	    center: center,
	    zoom: 7,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById('location-map'), mapOptions);
	$('#hide-button').click(function(){
		if (typeof map.getStreetView().getPano() !== undefined) {
			$('#challenge_pano').val(map.getStreetView().getPano());
			$('#new_challenge').submit();
		}
		else {
			alert("Please choose a location!")
		}
	});
});
