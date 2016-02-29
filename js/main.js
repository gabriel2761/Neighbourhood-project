function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(-33.856657, 151.215270),
	    zoom: 13
	});

	var AppViewModel = function() {
		this.keyword = ko.observable('');
		this.markers = ko.observableArray([]);
		this.previousResults = ko.observableArray([]);
	};

	AppViewModel.prototype.addMarker = function(title, lat, lng) {
		this.markers().push(new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			title: title
		}));
	};

	AppViewModel.prototype.setMarkers = function(markers) {
		for (var i = 0; i < markers().length; i++) {
			if (this.previousResults.indexOf(markers()[i]) === -1) markers()[i].setMap(map);
		}
		// markers().forEach(function(marker) {
		// 	if () marker.setMap(map);
		// });
	};

	AppViewModel.prototype.clearMarkers = function(results) {
		this.markers().forEach(function(marker) {
			if (results().indexOf(marker) === -1) marker.setMap(null);
		});
	};

	AppViewModel.prototype.search = function() {
		var results = ko.observableArray([]);
		for (var i = 0; i < this.markers().length; i++) {
			if (this.markers()[i].title.toLowerCase().indexOf(this.keyword().toLowerCase()) !== -1) {
				results().push(this.markers()[i]);
			}
		}
		this.clearMarkers(results);
		this.setMarkers(results);
		this.previousResults = results;
		return results;
	};

	var viewModel = new AppViewModel();

	viewModel.addMarker('Pyrmont', -33.8665, 151.1956);
	viewModel.addMarker('Art Gallery of NSW' ,-33.868791, 151.217413);
	viewModel.addMarker('Luna Park', -33.847677, 151.209699);
	viewModel.addMarker('Toronga Zoo', -33.839200, 151.240775);
	viewModel.addMarker('Opera House', -33.856657, 151.215270);

	ko.applyBindings(viewModel);
}


