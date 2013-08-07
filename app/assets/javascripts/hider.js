$(document).ready(function(){

	$hide_button = $('#hide-button');
	var center = new google.maps.LatLng(42.345573,-71.098326);
	var mapOptions = {
	    center: center,
	    zoom: 14,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById('location-map'), mapOptions);
	$hide_button.click(function(){
		if (typeof map.getStreetView().getPano() !== undefined) {
			$('#challenge_pano').val(map.getStreetView().getPano());
			$('#new_challenge').submit();
		}
		else {
			alert("Please choose a location!")
		}
	});

	var thePanorama = map.getStreetView();
	google.maps.event.addListener(thePanorama, 'visible_changed', function() {
	    if (thePanorama.getVisible()) {
	    	$hide_button.show();
	    } 
	    else {
	    	$hide_button.hide();
	    }
	});
});
