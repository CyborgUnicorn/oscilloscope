
(function() {

	'use strict';

	var ScreenController = function($scope) {
	
		$scope.data = $scope.oscilloscope;

	};

	angular.module('oscilloscope').controller('ScreenController', ScreenController);

})();
