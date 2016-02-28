
var Location = function(name, lat, lng) {
	this.name = name;
	this.lat = lat;
	this.lng = lng;
};

var locations = [
	new Location('Pyrmont', -33.8665, 151.1956),
	new Location('Art Gallery of NSW' ,-33.868791, 151.217413),
	new Location('Luna Park', -33.847677, 151.209699),
	new Location('Toronga Zoo', -33.839200, 151.240775),
	new Location('Opera House', -33.856657, 151.215270)
];

function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(-33.856657, 151.215270),
	    zoom: 13
	});

	locations.forEach(function(location) {
		new google.maps.Marker({
			position: new google.maps.LatLng(location.lat, location.lng),
			map: map,
			title: location.name
		});
	});

}

var AppViewModel = function() {
	this.locations = ko.observableArray(locations);
	this.keyword = ko.observable('Pyrmont');

	this.search = function() {
		var result = ko.observableArray([]);
		for (var i = 0; i < locations.length; i++) {
			if (locations[i].name.toLowerCase().indexOf(this.keyword().toLowerCase()) != -1) {
				result.push(locations[i]);
			}
		}
		return result;
	};
};

ko.applyBindings(new AppViewModel());

