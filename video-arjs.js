function toMeters(value) {
    //Although a-frame declares to have all sizes in meters - actually they are in marker sizes
    //so we have to scale manually
    //
    //For simplicity we always round to 2 fraction digits
    return (value * window.parent.settings.markerSizeMeters).toFixed(2);
}

//Seems there is a bug in AR.js that depending on device camera fov the distance to object is calculated
// incorrectly, see https://github.com/AR-js-org/AR.js/issues/36.
//
//The behavior is very weird actually - if we set box size equal to marker - it is rendered of equal size no
//matter what. But position and distance from camera can be different by 2 times depending on camera device
//used. So the question is - if the positions differ that much then why is box rendered equal to marker?
//
//To counter that we introduce our additional scaling. This coefficient taken from Mobula6 camera Runcam nano 3,
//but Tarsier and Ant work correctly with this value and have measured distance difference within 10%.
//
//NOTE! that this must only be used when dealing with position and not box sizes! No idea why!
//
//TODO test with different cameras to check if this coefficient is suitable
function heuristicScale(meters) {
    let heuristicScale = 0.5;
    return meters*heuristicScale;
}

var visibleMarkers = [];

AFRAME.registerComponent('finishmarker', {
    init: function () {
        var marker = this.el;

        marker.addEventListener('markerFound', function () {
            visibleMarkers.push(marker);
        });

        marker.addEventListener('markerLost', function () {
            visibleMarkers = visibleMarkers.filter(item => item !== marker)
            //Since we have several different markers and each may stop being
            //recognized in the process - we need to wait till they all go away
            //and treat this moment as passing the finish line.
            //
            //If there is one marker printed several times - AR.js treats it as one
            //and will recognized only one of the two (one that is larger or better
            //visible) and will only emit lost event when both are not recognized.
            if (visibleMarkers.length === 0) {
                checkLapFinished(marker);
            }
        });
    },
});

//Show distance to detected marker
AFRAME.registerComponent('showdistance', {
    init: function () {
        var marker = this.el;

        this.textEl = marker.querySelector(":scope > a-text");
    },
    tick: function (time, timeDelta) {
        var distance = heuristicScale(this.el.object3D.position.length() * window.parent.settings.markerSizeMeters).toFixed(2);
        if (this.el.object3D.visible) {
            this.textEl.setAttribute('value', distance + 'm');
        }
    }
});

function resizeFinishBox() {
    var areas = document.querySelectorAll('a-marker > a-box');
    let sideLength = window.parent.settings.minMarkerDistanceMeters / window.parent.settings.markerSizeMeters;
    for (let i = 0; i < areas.length; i++) {
        areas[i].setAttribute('width', sideLength);
        areas[i].setAttribute('height', sideLength);
        areas[i].setAttribute('depth', sideLength);
    }
}

//Polling for simplicity
setInterval(resizeFinishBox, 1000);