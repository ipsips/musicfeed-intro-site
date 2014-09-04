'use strict'

/*//////////////////////////////

    Phone route & controller
    
    /phone

//////////////////////////////*/



//``````````````````````````````
//  Configure the route
//
angular.module('app').config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/phone',
    {
        templateUrl: '/angular/routes/phone/phone.html',
        controller: 'PhoneController'
    });

}]);



//``````````````````````````````
//  The controller
//
angular.module('appControllers').controller('PhoneController', ['$scope', '$q', '$timeout', '$animate', 'appGlobals', function( $scope, $q, $timeout, $animate, appGlobals ) {

    $scope.showVideo = false;


    $scope.panes = [{
        text:  'Discover new music as soon as\n\
                your friends and favorite artists\n\
                post it on the web'
    },{
        text:  'Listen to tracks and watch videos\n\
                directly in your feed'
    },{
        text:  'Heart your biggest faves and share\n\
                your love for the music'
    },{
        text:  'Remove tracks you dont like so\n\
                musicfeed can learn your preferences'
    }];


}]);


