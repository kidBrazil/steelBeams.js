
// Created By - Lucas Moreira (lucasm@goviralinc.com)
// --------------------------------------------------
// [Purpose]
// This is a handy little script to create a sidebar that
// will scroll with the user and come to a rest at a pre-determined
// spot. Usually the footer. This script was designed to work with [FlexBox].
//
// [Overview]
// The script works by collecting boundingRct properties on the sidebar,
// the footer [STOP], and the div we want to scroll to determine the ammount
// of pixels it can travel. The script contains catches for
// Keyboard [Home/End], scroll direction and easing for the animations.
//
// [Requirements]
// -Jquery for some faster dom manipulation.
// -Flexbox based layout.
//---------------------------------------------------


$(document).ready(function() {
    //If not present, Ignore
    if ($('#scroll-me').offset() == null) return;

    // Elements-------------------------------
    var scrollDiv           = document.getElementById("scroll-me"),
        stopDiv             = document.getElementById("footer-stop"),
        sidebarDiv          = document.getElementsByClassName("sidebar")[0];

    // Tokens/Flags --------------------------
    //Token marks wether the div is moving. False = not moving | True = moving with scroll | Null = Parked.
    var positionToken       = false,
    // Used to flag wether or not the animation is running on the Home/End Keys
        running             = false,
    //If True - Enables Keyboard [Home/End] Key smoothing - Overrides default browser behavior.
        keyboardSmoothing   = true,
    //Do not touch this flag...
        killScrollFn        = false,
    // Token marks wether the user is scrolling up or down.
        directionToken      = null;

    //Data Storage ---------------------------
    //Stores the scroll top value so it can be compared against the new one and determine direction.
    var oldTop              = 0,
    //Original starting position for the scroll div.
        originalPosition    = scrollDiv.getBoundingClientRect().top;

    //Configuration of Spacing---------------
    var topPadding      = 20,
        bottomPadding   = 20;

    //Keyboard [ Home/End ] ---------------------------------------------- [ START ]
    $(document).keydown(function(e) {
        //Keyboard Smoothing Enabled or Disabled?
        if(!keyboardSmoothing){
            if(!killScrollFn){
                killScrollFn = true;
            }
            return;
        }

        // Variables ------------------------------
        var key             = null,
            body            = document.body,
            html            = document.documentElement,
        //Ratio determines speed of scroll Smaller numbers are faster. Don't go under 0.1
            ratio           = 0.3,
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

        // Animations Loop --------------------------------------------------------
        // Code borrowed from Elevator.js - https://github.com/tholman/elevator.js
        // and edited for my purposes.
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
            goingUp:function(){
                if(running){
                    return;
                }
                startPosition   = (document.documentElement.scrollTop || body.scrollTop);
                duration        = startPosition * ratio;
                bottomPosition  = -startPosition;
                requestAnimationFrame( escalatorLoop );
            },
            //responds to - End Key
            goingDown:function(){
                if(running){
                    return;
                }
                startPosition   = (document.documentElement.scrollTop || body.scrollTop);
                duration        = ((bottomPosition - startPosition) * ratio);
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
        else{
            return;
        }

    });
    //Keyboard [ Home || End ] - Catch Case --------------------------------------- [ END ]


    //Scroll function.. where the magic happens.
    $(document).scroll(function (event) {

        //Kill Scroll Function due to Home/End?
        if (killScrollFn){
            //Flip the safety back..
            killScrollFn = false;
            //Lock the div back in place
            $(scrollDiv).css({
                "position" : "relative",
                "top" : "",
                "bottom" : "",
                "width" : ""
            });
            return;
        }

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
                    "bottom" : "",
                    "width" : sidebarObject.width +"px"
                });

                positionToken = true;
            }
            //Scrolling Ad hit's the top of the footer.
            else if(scrollObject.bottom >= (stopObject.top + bottomPadding) &&  positionToken === true){
                $(scrollDiv).css({
                    "position"  : "absolute",
                    "top"       : "",
                    "bottom"    : bottomPadding + "px",
                    "width" : sidebarObject.width +"px"
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
                    "bottom" : "",
                    "width" : sidebarObject.width +"px"
                });

                //Moving...
                positionToken = true;
            }
            //User approaches the original position and parks the Ad.
            if(top < (originalPosition - 60)&& positionToken === true){
                $(scrollDiv).css({
                    "position" : "relative",
                    "top" : "",
                    "bottom" : "",
                    "width" : ""
                });

                //Not moving anymore..
                positionToken = false;
            }
        }//IF USER SCROLLING UP...

    });// Scroll Function End - DESKTOP VERSION
});



