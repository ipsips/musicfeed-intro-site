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


    var //  bright sampled from:
        //  developer.apple.com/library/iOS/documentation/userexperience/conceptual/mobilehig/ColorImagesText.html
        //
        /*colors = [
            '#fe2d55', // red
            '#47cc5e', // green
            '#ffcc02', // yellow
            '#5ac8fa', // blue
        ],*/
        //  above with adjusted brightness 50%
        //
        colors = [
            '#7f162a', // red
            '#23662f', // green
            '#7f6601', // yellow
            '#2d647d', // blue
        ],
        numColors = colors.length,
        incomingTimer, incomingInt,
        playTimer, playInt,
        loveTimer, loveInt,
        removeTimer, removeInt;


    $scope.tracks = [];

    //  have 8 tracks first
    //
    for ( var i = 0; i < 8; i++ )
        $scope.tracks.push( { new: false, color: colors[ i % numColors ] } );


    //``````````````````````````````
    //  SCENE 1
    //
    //  prepend new tracks,
    //  pick colors in backwards order
    //
    function incomingTrack() {
        $scope.$apply(function(){

            var firstColorIndex = colors.indexOf( $scope.tracks[ 0 ].color ),
                colorIndex = firstColorIndex==0 ? ( numColors - 1 ) : ( firstColorIndex - 1 );

            $scope.tracks[0].new = false;
            $scope.tracks.unshift( { new: true, color: colors[ colorIndex ] } );
            $scope.tracks.pop();

        });
    }


    //``````````````````````````````
    //  SCENE 2
    //
    //  scroll a bit, pick a track,
    //  trigger play click,
    //  spring out the mini-player,
    //  start playng
    //
    $scope.showPlayer = false;
    $scope.isPlaying = false;

    function playTrack() {
        $scope.$apply(function(){

            $scope.tracks[0].new = false;

            digFeed().then( function(){

                $timeout(function() {
                    
                    if ( $scope.currentPane !== 1 )
                        return;

                    $scope.tracks[0].play = true;
                    restartPlayer();

                }, 300 ); // wait a lil after scroll & tap to play

            });

        });
    }

    function restartPlayer() {
        
        if ( $scope.showPlayer )
            replayTrack();

        else
            $timeout(function() {
                    
                if ( $scope.currentPane !== 1 )
                    return;

                if ( $scope.showPlayer )
                    replayTrack();

                else {
                    $scope.showPlayer = true;
                    $timeout(function() {
                        replayTrack();
                    }, 350); // need to wait after popUpPlayer animation (i guess because nested ng-if)
                }

            }, 300 ); // wait jus a little after play-tap
        
    }

    function replayTrack() {
                    
        if ( $scope.currentPane !== 1 )
            return;
        
        //  remove & insert progressbar
        //  to reinit css animation
        //
        if ( $scope.isPlaying )
            $scope.$apply( function(){ $scope.isPlaying = false; } );

        $scope.$apply( function(){ $scope.isPlaying = true; } );

    }

    function digFeed() {

        var tracksToScroll = 2,
            deferred = $q.defer(),
            firstTrack = angular.element('#feed li').eq(0);

        //  simulate feed scroll
        //  by css-animating top margin
        //  of first track in feed
        //
        $animate.addClass( firstTrack, 'scrolling',

            //  remove the first track(s)
            //  and prepend new one(s)
            //  once animation finishes
            //
            function() {

                $scope.tracks.splice( 0, tracksToScroll );

                var lastColorIndex = colors.indexOf( $scope.tracks[ $scope.tracks.length-1 ].color );

                for (
                    var i = lastColorIndex + 1;
                        i < ( lastColorIndex + 1 + tracksToScroll );
                        i++
                )
                    $scope.tracks.push( { new: false, color: colors[ i % numColors ] } );
                
                //  done digging
                deferred.resolve();
            
            }
        );


        return deferred.promise;

    }



    //``````````````````````````````
    //  SCENE 3
    //
    //  
    function loveTrack() {
        $scope.$apply(function(){

            digFeed().then( function(){

                $timeout(function() {
                    
                    if ( $scope.currentPane !== 2 )
                        return;
                    
                    $scope.tracks[0].loved = true;

                }, 300 ); // wait a lil after scroll & tap to love

            });

        });
    }



    //``````````````````````````````
    //  SCENE 4
    //
    //  


    $scope.$watch('currentPane', function( currPane, prevPane ){

        //  enter/leave SCENE 1
        //
        if ( currPane == 0 )
            incomingTimer = setTimeout( function() { 
                incomingTrack();
                incomingInt = setInterval( incomingTrack, 3000 );
            }, 1550 ); // minimum 1500 = digFeed animation duration

        if ( prevPane == 0 ) {
            clearTimeout( incomingTimer );
            clearInterval( incomingInt );
        }


        //  enter/leave SCENE 2
        //
        if ( currPane == 1 ) {
            playTimer = setTimeout( function() { 
                playTrack();
                playInt = setInterval( playTrack, 6000 );
            }, 1550 ); // minimum 1500 = digFeed animation duration
        }

        if ( prevPane == 1 ) {
            clearTimeout( playTimer );
            clearInterval( playInt );
            $scope.showPlayer = false;
            $scope.isPlaying = false;
        }


        //  enter/leave SCENE 3
        //
        if ( currPane == 2 ) {
            loveTimer = setTimeout( function() { 
                loveTrack();
                loveInt = setInterval( loveTrack, 4000 );
            }, 1550 ); // minimum 1500 = digFeed animation duration
        }

        if ( prevPane == 2 ) {
            clearTimeout( loveTimer );
            clearInterval( loveInt );
        }


        //  enter/leave SCENE 4
        //
        if ( currPane == 3 ) {}

        if ( prevPane == 3 ) {}

    });


}]);


