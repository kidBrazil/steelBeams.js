// SteelBeams.js
// - Created By: Lucas Moreira - @BasedBrazilian
//
//--------------------------------------------------------------------------------------------------------
// [ DEPENDENCIES ]
// - Jquery - Latest is fine
// - Flexbox Layout helps...
//--------------------------------------------------------------------------------------------------------
// [ PURPOSE ]
// This script allows you to set a given div to scroll with the user once it is reached and then stop
// scrolling once it hits a div below it. This is extremely useful on websites with sidebars where
// you wish to display a piece of content to the user as they scroll down your page BUT you don't want
// the div to occlude over some other piece of content such as the footer or another sidebar item competing
// for space.
//---------------------------------------------------------------------------------------------------------
// [ How It works ]
// - <div id="#scroll-with-user"> original position & dimensions is captured
// - <div id="#stop-here"> with Id of #stop-here position & dimensions is captured
// - as the user scrolls passed the target <div> of #scroll-with-user the <div> will become fixed and scroll down
// -
$(document).ready(function() {
    //If not present, Ignore
    if ($('#scroll-w-m').offset() == null) return;

    //Global Variables
    var scrollDiv           = document.getElementById("scroll-w-m"),
        stopDiv             = document.getElementById("footer-stop"),
        sidebarDiv          = document.getElementsByClassName("right-sidebar")[0],
    //Token marks wether the div is moving. False = not moving | True = moving with scroll | Null = Parked.
        positionToken       = false,
    // Token marks wether the user is scrolling up or down.
        directionToken      = null,
    //Stores the scroll top value so it can be compared against the new one and determine direction.
        oldTop              = 0,
    //Original starting position for the scroll div.
        originalPosition    = scrollDiv.getBoundingClientRect().top;

    //Configuration of Spacing
    var topPadding      = 120,
        bottomPadding   = 30;


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

