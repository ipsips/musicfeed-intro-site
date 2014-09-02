'use strict'

/*//////////////////////////////

	Home route & controller
	
	/

//////////////////////////////*/



//``````````````````````````````
//	Configure the route
//
angular.module('app').config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/',
	{
		templateUrl: '/angular/routes/home/home.html',
		controller: 'HomeController'
	});

}]);



//``````````````````````````````
//	The controller
//
angular.module('appControllers').controller('HomeController', ['$scope', 'appGlobals', function($scope, appGlobals) {

	

}]);


