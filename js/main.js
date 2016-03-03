function mapError() {
	$('#map').append('<div class="map-error"><h3>Google Maps has failed to load</h3><div>');
}

function initMap() {
	// Info window for markers to display information
	var infoWindow = new google.maps.InfoWindow();

	/**
	 * Initiates the map, center of map is set to a hardcoded location
	 * @type {google}
	 */
	var map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(-33.856657, 151.215270),
	    zoom: 13
	});

	/**
	 * @class Initiates class to be watched with knockout js.
	 */
	var AppViewModel = function() {
		this.keyword = ko.observable('');
		this.markers = ko.observableArray([]);
		this.results = ko.observableArray([]);
	};

	/**
	 * Creates a marker based on the geographic information, adds an event
	 * listener, and pushes it to the array.
	 * @param {String} title location name
	 * @param {Number} lat   latitude
	 * @param {Number} lng   longitude
	 */
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

	/**
	 * Sets the markers to the map, using the array given. Markers are
	 * checked if they already exist on the map before appending.
	 * @param {array} markers Contains an array of markers
	 */
	AppViewModel.prototype.setMarkers = function(markers) {
		for (var i = 0; i < markers().length; i++) {
			if (this.results.indexOf(markers()[i]) === -1) markers()[i].setMap(map);
		}
	};

	/**
	 * Clears the markers from the map, using the array given. If marker
	 * does not exist in the array, then it is removed from the map
	 * @param  {array} results Array of marker from search results
	 */
	AppViewModel.prototype.clearMarkers = function(results) {
		this.markers().forEach(function(marker) {
			if (results().indexOf(marker) === -1) marker.setMap(null);
		});
	};

	/**
	 * Search algorithm for finding locations based on a keyword string
	 * passed into search. The results are sorted and passed to the view
	 * through knockout. Sorting the results are based of the characters
	 * closest to the beginning of each word, and word closest to the
	 * beggining of the title of the location.
	 *
	 * @return {Array} List of locations matching keyword
	 */
	AppViewModel.prototype.search = function() {
		var self = this,
			keyword = self.keyword().toLowerCase();
			results = ko.observableArray([]);

		// Finds the markers with the location names matching the keyword
		self.markers().forEach(function(marker) {
			if (marker.title.toLowerCase().indexOf(keyword) !== -1) {
				results().push(marker);
			}
		});

		// Sorts the array based on the priority of the keyword closest to
		// the beginning of each word and location title.
		results().sort(function(a, b) {

			// splits the words in each location name
			var first = a.title.toLowerCase().split(' '),
				second = b.title.toLowerCase().split(' ');

			// variables that will be used to compare results with a
			// lower number having a higher priority
			var	aLowestChar,
				bLowestChar,
				aLowestWord,
				bLowestWord;

			// Finds the lowest index of a character in every word
			first.forEach(function(word) {
				if ((aLowestChar === undefined && word.indexOf(keyword) != -1) ||
					((word.indexOf(keyword) < aLowestChar) && (word.indexOf(keyword) != -1))) {
					aLowestChar = word.indexOf(keyword);
					aLowestWord = first.indexOf(word);
				}
			});

			// Finds the lowest index of a character in every word
			second.forEach(function(word) {
				if ((bLowestChar === undefined && word.indexOf(keyword) != -1) ||
					((word.indexOf(keyword) < bLowestChar) && (word.indexOf(keyword) != -1))) {
					bLowestChar = word.indexOf(keyword);
					bLowestWord = second.indexOf(word);
				}
			});

			// returns the marker with the title that has the keyword closest
			// to the beggining of any of it's word. If they have the same index, then
			// the word matching closest the the beggining of the title with take priority.
			return (aLowestChar < bLowestChar) ? -1 : (aLowestChar > bLowestChar) ? 1 :
				(aLowestWord < bLowestWord) ? -1 : (aLowestWord > bLowestChar) ? 1 : 0;
		});

		this.clearMarkers(results);
		this.setMarkers(results);
		this.results = results;
		return results;
	};

	/**
	 * Calls the listener function of a Marker
	 * @param  {Number} index Item position in listview
	 */
	AppViewModel.prototype.click = function(index) {
		this.getInfo(this.results()[index()]);
	};

	/**
	 * Fired when marker is selected. Opens an info window on the map
	 * and gets information about the location from Wikipedia to
	 * display to the user.

	 * @param  {[type]} marker [description]
	 * @return {[type]}        [description]
	 */
	AppViewModel.prototype.getInfo = function(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 1450);

		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json',
			dataType: 'jsonp',
		}).done(function(result) {
			infoWindow.setContent('<h2>'+result[0]+'</h2><p>'+result[2][0]+'</p><a href="'+result[3][0]+'">Wikipedia</a>');
				infoWindow.open(map, marker);
		}).fail(function(jqXHR, textStatus) {
			infoWindow.setContent('Unable to retrieve data');
				infoWindow.open(map, marker);
		});

	};

	var viewModel = new AppViewModel();

	// Hardcoded locations to display
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

	// Sort the array based on the title of the marker
	viewModel.markers().sort(function(a, b) {
    	return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
	});

	ko.applyBindings(viewModel);
}


