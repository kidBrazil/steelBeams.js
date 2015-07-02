//
//      ____  _       __
//     / __ \(_)___  / /_  __
//    / / / / / __ \/ / / / /
//   / /_/ / / /_/ / / /_/ /
//  /_____/_/ .___/_/\__, /
//         /_/      /____/
//
// Diply.com - Go For A dip
// sidebarNAvCtrl.js - Sidebar Ad Scroller Version - 1.2
// Created By - Lucas Moreira (lucasm@goviralinc.com)
// --------------------------------------------------
//
// This script controls the scrolling behaviour on the vertical sidebar
// nav. To utilize this script simply include a div with the ID of
// #scroll-w-m within the confines of .right-sidebar.
//
//---------------------------------------------------

//Diply.com -
//By: Lucas Moreira




/**
 * THIS IS PORTED FROM LIVE. ANIMATION ON AUTHOR BLOCK HAS BEEN
 * REMOVED UNTIL WE KNOW WHY ADS COLLIDE BECAUSE OF IT
 */


$(document).ready(function() {
    //If not present, Ignore
    if ($('#scroll-w-m').offset() == null) return;

    //Global Variables
    var scrollDiv           = document.getElementById("scroll-w-m"),
        stopDiv             = document.getElementById("footer-stop"),
        sidebarDiv          = document.getElementsByClassName("right-sidebar")[0],
    //Token marks wether the div is moving. False = not moving | True = moving with scroll | Null = Parked.
        positionToken       = false,
    // Used to flag wether or not the animation is running on the Home/End Keys
        running             = false,
    // Token marks wether the user is scrolling up or down.
        directionToken      = null,
    //Stores the scroll top value so it can be compared against the new one and determine direction.
        oldTop              = 0,
    //Original starting position for the scroll div.
        originalPosition    = scrollDiv.getBoundingClientRect().top;

    //Configuration of Spacing--------------------------------------------------------------
    var topPadding      = 120,
        bottomPadding   = 30;

    //Keyboard [ Home || End ] - Catch Case --------------------------------------- [ START ]
    $(document).keydown(function(e) {
        // Variables --------------------------------------------------------------
        var key             = null,
            body            = document.body,
            html            = document.documentElement,
        //Ratio determines speed of scroll Smaller numbers are faster. Don't go under 0.1
            ratio           = 0.1,
            duration        = null,
            startTimer      = null,
            startPosition   = (document.documentElement.scrollTop || body.scrollTop),
            bottomPosition  = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

        // Utilities --------------------------------------------------------------

        // Thanks Mr Penner - http://robertpenner.com/easing/
        // Ease In-Out Function..
        function easeInOutQuad( t, b, c, d ) {
            t /= d / 2;
            if ( t < 1 ) return c / 2 * t * t + b;
            t--;
            return -c / 2 * ( t * ( t -2 ) - 1 ) + b;
        }

        // Animations Loop -------------------------------------------------------------
        // Some Code borrowed from Elevator.js - https://github.com/tholman/elevator.js
        function escalatorLoop( timeStamp ) { //Time is passed by the RequestAnimationFrame
            //Set Timer...
            if ( !startTimer ) {
                startTimer = timeStamp;
            }

            // calculate Elapsed Time.
            var timeElapsed = timeStamp - startTimer,
            // Ease the numbers with the Above function.
                easedAnimation = easeInOutQuad(timeElapsed, startPosition, bottomPosition, duration);

            //Force scroll the window to this position...
            window.scrollTo(0, easedAnimation);

            //is the animation still running?
            if( timeElapsed < duration ) {
                animation = requestAnimationFrame(escalatorLoop);
            }

            //After Animation Reset all things...
            else {
                startTimer      = null;
                startPosition   = null;
                running         = false;
            }
        }

        // Functions ---------------------------------------------------------------
        var escalator = {

            //Responds to - Home Key
            goingUp: function () {

                if(running) {
                    return;
                }
                startPosition   = (document.documentElement.scrollTop || body.scrollTop);
                duration = startPosition * ratio;
                bottomPosition = -startPosition;
                requestAnimationFrame( escalatorLoop );
            },
            //responds to End Key
            goingDown: function () {

                if(running) {
                    return;
                }
                startPosition   = (document.documentElement.scrollTop || body.scrollTop);
                duration = ((bottomPosition - startPosition) * ratio);
                requestAnimationFrame( escalatorLoop );
            }//Going Down

        };
        //Escalator Function - End


        // Checks -----------------------------------------------------------------
        //Simple Check for IE...
        if(window.event){
            key = e.keyCode;
        }
        //Simple Check for Moz/Opera/Chrome...
        else if(e.which){
            key = e.which;
        }

        // Key Detection -----------------------------------------------------------
        //Home Key...
        if (key == 36){
            //prevent default scroll..
            e.preventDefault();
            //Call escalator..
            escalator.goingUp();
            running = true;
        }
        //End Key Pressed...
        else if (key == 35){
            //prevent default scroll..
            e.preventDefault();
            //Call escalator..
            escalator.goingDown();
            running = true;
        }

    });
    //Keyboard [ Home || End ] - Catch Case --------------------------------------- [ END ]


    //Scroll function.. where the magic happens.
    $(document).scroll(function (event) {

        var top             = $(window).scrollTop(),
        //Objects w/ client rect.
            scrollObject    = scrollDiv.getBoundingClientRect(),
            stopObject      = stopDiv.getBoundingClientRect(),
            sidebarObject   = sidebarDiv.getBoundingClientRect();

        //Determine scroll direction, Up or Down.
        if (top > oldTop) {
            oldTop = top;
            directionToken = true;
        }//Are we moving down?
        else if(top < oldTop){
            oldTop = top;
            directionToken = false;
        }//Than we must be moving up!


        //User Is Scrolling Down --------------------------------------------------------------------------
        if(directionToken === true){
            //User scrolling down and reaches the Ad.
            if(top >= (originalPosition - topPadding )&& positionToken === false){
                $(scrollDiv).css({
                    "position" : "fixed",
                    "top" : topPadding + "px",
                    "bottom" : ""
                });

                positionToken = true;
            }
            //Scrolling Ad hit's the top of the footer.
            else if(scrollObject.bottom >= (stopObject.top + bottomPadding) &&  positionToken === true){
                $(scrollDiv).css({
                    "position"  : "absolute",
                    "top"       : "",
                    "bottom"    : bottomPadding + "px"
                });
                //Parked By footer.
                positionToken = null;
            }
        }//IF USER SCROLLING DOWN...

        //User Scrolling Up --------------------------------------------------------------------------------
        else{
            //User returns Passed the footer and passed the top of the object.
            if(scrollObject.top >= topPadding &&  positionToken === null){
                $(scrollDiv).css({
                    "position" : "fixed",
                    "top" : topPadding + "px",
                    "bottom" : ""
                });

                //Moving...
                positionToken = true;
            }
            //User approaches the original position and parks the Ad.
            if(top < (originalPosition - 60)&& positionToken === true){
                $(scrollDiv).css({
                    "position" : "relative",
                    "top" : "",
                    "bottom" : ""
                });

                //Not moving anymore..
                positionToken = false;
            }
        }//IF USER SCROLLING UP...

    });// Scroll Function End - DESKTOP VERSION
});



