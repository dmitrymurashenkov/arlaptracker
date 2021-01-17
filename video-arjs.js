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
//To counter that we introduce our additional scaling. This coefficient taken from Mobula6 camera Runcam nano 3.
//
//NOTE! that this must only be used when dealing with position and not box sizes! No idea why!
//
//TODO test with different cameras to check if this coefficient is suitable
function heuristicScale(meters) {
    let heuristicScale = 0.5;
    return meters*heuristicScale;
}

AFRAME.registerComponent('finishmarker', {
    init: function () {
        var marker = this.el;

        marker.addEventListener('markerLost', function () {
            checkLapFinished(marker);
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