
(function() {

	'use strict';

	angular.module('oscilloscope').factory('lazerRainbow', function() {

		var listeners = [];

		var connector = {
			connect: function() {
				now.connect();
			},
			disconnect: function() {
				now.disconnect();
			},
			onData: function(callback) {
				listeners.push(listener);
			}
		};

		now.data = function(data) {
			listeners.forEach(function(callback) {
				callback(data.frames);
			});
		};

		return connector;
	});

})();