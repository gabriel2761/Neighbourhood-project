var AppViewModel = function() {
	this.name = ko.observable('Hello, World');
};

ko.applyBindings(new AppViewModel());