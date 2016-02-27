
function initMap() {

	var locations = {
		pyrmont: new google.maps.LatLng(-33.8665, 151.1956),
		artGallery: new google.maps.LatLng(-33.868791, 151.217413),
		lunaPark: new google.maps.LatLng(-33.847677, 151.209699),
		torongaZoo: new google.maps.LatLng(-33.839200, 151.240775),
		operaHouse: new google.maps.LatLng(-33.856657, 151.215270)
	};

	map = new google.maps.Map(document.getElementById('map'), {
		center: locations.operaHouse,
	    zoom: 14
	});

	for (var location in locations) {
		new google.maps.Marker({
			position: locations[location],
			map: map,
			title: location
		});
		console.log(location);
	}

}
