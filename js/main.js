function initMap() {
	var infoWindow = new google.maps.InfoWindow();

	var map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(-33.856657, 151.215270),
	    zoom: 13
	});

	var AppViewModel = function() {
		this.keyword = ko.observable('');
		this.markers = ko.observableArray([]);
		this.results = ko.observableArray([]);
	};

	AppViewModel.prototype.addMarker = function(title, lat, lng) {
		var self = this;
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			title: title
		});
		marker.addListener('click', function() {self.getInfo(marker);});
		this.markers().push(marker);
	};

	AppViewModel.prototype.setMarkers = function(markers) {
		for (var i = 0; i < markers().length; i++) {
			if (this.results.indexOf(markers()[i]) === -1) markers()[i].setMap(map);
		}
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
		this.results = results;
		return results;
	};

	AppViewModel.prototype.click = function(index) {
		this.getInfo(this.results()[index()]);
	};

	AppViewModel.prototype.getInfo = function(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 1450);
		var wiki_url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json';
		$.ajax({
			url: wiki_url,
			dataType: 'jsonp',
			success: function(result) {
				infoWindow.setContent('<h2>'+result[0]+'</h2><p>'+result[2][0]+'</p><a href="'+result[3][0]+'">Wikipedia</a>');
				infoWindow.open(map, marker);
			},
			error: function(jqXHR, status, error) {
				infoWindow.setContent('Failed to retrieve data');
				infoWindow.open(map, marker);
			}
		});

	};

	var viewModel = new AppViewModel();

	viewModel.addMarker('Museum of Contemporary Art Australia', -33.859881, 151.208903);
	viewModel.addMarker('Art Gallery of New South Wales' ,-33.868791, 151.217413);
	viewModel.addMarker('Luna Park Sydney', -33.847677, 151.209699);
	viewModel.addMarker('Taronga Zoo', -33.843078, 151.241928);
	viewModel.addMarker('Sydney Opera House', -33.856657, 151.215270);

	ko.applyBindings(viewModel);
}


