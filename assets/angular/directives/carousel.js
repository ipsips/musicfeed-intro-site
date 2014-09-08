'use strict'

/*//////////////////////////////

    super simple carousel

    @see thecoded.com/swipe/examples/carousel.html
    @req hammer.js

//////////////////////////////*/



angular.module('appDirectives').directive('carousel', function() {

    if ( !Hammer )
        return console.error( 'missing Hammer.js' );

    function Carousel( $scope, $element, attributes ) {

        var numPanes = $scope.panes.length || attributes.numPanes || $element.find('>ul >li').length || 1,
            singlePaneOffset = -100 / numPanes,
            paneW = 0,
            mc = new Hammer.Manager(
                $element[0], {
                    preventDefault: true,
                    touchAction: 'none'
                }),
            panH = new Hammer.Pan({
                event: 'panh',
                direction: Hammer.DIRECTION_HORIZONTAL
            }),
            swipeH = new Hammer.Swipe({
                event: 'swipeh',
                direction: Hammer.DIRECTION_HORIZONTAL
            });

        mc.add( panH );
        mc.add( swipeH ).recognizeWith( panH );

        mc.on('swipeh panh', handleHammer );

        $scope.stripOffset = 0;
        $scope.currentPane = 0;
        $scope.bullets = [];

        for ( var i = 0; i < numPanes; i++ )
            $scope.bullets.push({ opacity: i==0 ? 1 : 0 });


        //  get single pane width in px for
        //  we need compare it to deltaX
        //
        function setPaneW() { paneW = $element[0].offsetWidth; };

        angular.element( document ).ready( setPaneW );
        angular.element( window ).on('load resize orientationchange', setPaneW );


        function showPane( index, animate ) {
            
            $scope.$apply(function(){
                $scope.currentPane = Math.max( 0, Math.min( index, numPanes-1 ) );
            });

            setStripPosition( -100 / numPanes * $scope.currentPane, animate );

        };


        function setStripPosition( percent, animate ) {

            // var leftPx = paneW * numPanes / 100 * percent;

            $element.find('>ul').toggleClass('animate', animate );

            $scope.$apply(function(){
                
                $scope.stripOffset = percent;

                setBullet( percent, animate );

            });

        };

        function setBullet( percent, animate ) {

            var progress = percent / singlePaneOffset,
                deviation = progress - $scope.currentPane;

            //  don't mess with neither
            //  first bullet when trying ← prev,
            //  last bullet when trying next →
            //
            if ( 0 > progress || progress > numPanes - 1 )
                return;

            $element.find('>nav').toggleClass('animate', animate );

            //  final == swipe / pan end
            if ( deviation == 0 )
                $scope.bullets.map( function( b, i ){
                    b.opacity = ( i == $scope.currentPane ? 1 : 0 );
                });

            //  pan ← prev / next →
            else {
                
                var destBulletOpacity = Math.abs( deviation ),
                    currBulletOpacity = 1 - destBulletOpacity;

                $scope.bullets[ $scope.currentPane ].opacity = currBulletOpacity;
                $scope.bullets[ $scope.currentPane + ( 0 < deviation ? 1 : -1 ) ].opacity = destBulletOpacity;

            }

        }


        function next() { return showPane( $scope.currentPane+1, true ); };
        function prev() { return showPane( $scope.currentPane-1, true ); };


        function handleHammer( evt ) {
            
            // console.debug( evt );

            switch( evt.type ) {

                case 'panh':

                    // console.debug( 'pan: '+( evt.offsetDirection == 4 ? 'next →' : '← prev') );
                    
                    var currentPaneOffset = singlePaneOffset * $scope.currentPane,
                        dragOffset = Math.max( singlePaneOffset, Math.min( -singlePaneOffset, ( 100 / paneW * evt.deltaX ) / numPanes ) );

                    //  resist first & last pane
                    //
                    if (
                        ( $scope.currentPane == 0          && evt.offsetDirection == 2 ) ||
                        ( $scope.currentPane == numPanes-1 && evt.offsetDirection == 4 )
                    )
                        dragOffset *= .2;

                    setStripPosition( currentPaneOffset + dragOffset );

                    // pan finished
                    //
                    if ( evt.isFinal ) {

                        //  more than 50% panned so
                        //  navigate to next/prev
                        //
                        if ( Math.abs( evt.deltaX ) > paneW/2 ) {
                        
                            if ( evt.offsetDirection == 4 )
                                next();

                            else
                                prev();

                        } else
                            showPane( $scope.currentPane, true );

                    }

                    break;

                case 'swipeh':

                    // console.debug( 'swipe: '+( evt.direction == 2 ? 'next →' : '← prev') );

                    //  cancel if more than 50% panned
                    //  to prevent navigating next/prev twice
                    //  
                    if ( Math.abs( evt.deltaX ) > paneW/2 )
                        break;

                    if ( evt.direction == 2 )
                        next();

                    if ( evt.direction == 4 )
                        prev();

            }
        
        };

    };
    
    return ({
        restrict: 'AEC',
        templateUrl: '/angular/partials/carousel.html',
        link: Carousel
    });

});
