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
		var self = this,
			keyword = self.keyword().toLowerCase();
			results = ko.observableArray([]);

		self.markers().forEach(function(marker) {
			if (marker.title.toLowerCase().indexOf(keyword) !== -1) {
				results().push(marker);
			}
		});

		console.log('======================== Keyword: ' + keyword);
		results().sort(function(a, b) {
			var first = a.title.toLowerCase().split(' '),
				second = b.title.toLowerCase().split(' ');

			var	aLowestChar,
				bLowestChar,
				aLowestWord,
				bLowestWord;

			first.forEach(function(word) {
				if ((aLowestChar === undefined && word.indexOf(keyword) != -1) || ((word.indexOf(keyword) < aLowestChar) && (word.indexOf(keyword) != -1))) {
					aLowestChar = word.indexOf(keyword);
					aLowestWord = first.indexOf(word);
				}
			});

			second.forEach(function(word) {
				if ((bLowestChar === undefined && word.indexOf(keyword) != -1) || ((word.indexOf(keyword) < bLowestChar) && (word.indexOf(keyword) != -1))) {
					bLowestChar = word.indexOf(keyword);
					bLowestWord = second.indexOf(word);
				}
			});

			console.log(a.title + ' (char:' + aLowestChar + ') ' + b.title +' (char:' + bLowestChar + ')');
			console.log('word: ' + aLowestWord + ' word: ' + bLowestWord);

			return (aLowestChar < bLowestChar) ? -1 : (aLowestChar > bLowestChar) ? 1 :
				(aLowestWord < bLowestWord) ? -1 : (aLowestWord > bLowestChar) ? 1 : 0;
		});

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

		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json',
			dataType: 'jsonp',
			success: function(result) {
				infoWindow.setContent('<h2>'+result[0]+'</h2><p>'+result[2][0]+'</p><a href="'+result[3][0]+'">Wikipedia</a>');
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
	viewModel.addMarker('Bondi Beach', -33.891520, 151.276812);
	viewModel.addMarker('Westfield Sydney', -33.869898, 151.207694);
	viewModel.addMarker('The Star (casino)', -33.867998, 151.195245);
	viewModel.addMarker('Hyde Park, Sydney', -33.873103, 151.211276);
	viewModel.addMarker('Royal Botanic Gardens, Sydney', -33.869162, 151.215705);
	viewModel.addMarker('Westfield Bondi Junction', -33.891621, 151.250741);
	viewModel.addMarker('Darling Harbour', -33.873483, 151.200308);
	viewModel.addMarker('Queen Victoria Building', -33.871713, 151.206676);
	viewModel.addMarker('Sea Life Sydney Aquarium', -33.870009, 151.202205);
	viewModel.addMarker('The Rocks, Sydney', -33.858965, 151.207784);
	viewModel.addMarker('Chinatown, Sydney', -33.877632, 151.204641);
	viewModel.addMarker('Sydney Town Hall', -33.873209, 151.206593);
	viewModel.addMarker('Bronte Beach', -33.903269, 151.268455);
	viewModel.addMarker('Blue Mountains (New South Wales)', -33.652956, 150.442271);
	viewModel.addMarker('Manly Beach', -33.792175, 151.287564);


	viewModel.markers().sort(function(a, b) {
    	return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
	});

	ko.applyBindings(viewModel);
}


