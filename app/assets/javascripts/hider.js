$(document).ready(function(){
	$hide_button = $('#hide-button');
	if ($hide_button.length > 0){
		var center = new google.maps.LatLng(52.48947,-1.886322);
		var mapOptions = {
		    center: center,
		    zoom: 7,
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
	}

});
