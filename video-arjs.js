function toMeters(value) {
    //Although a-frame declares to have all sizes in meters - actually they are in marker sizes
    //so we have to scale manually
    //
    //For simplicity we always round to 2 fraction digits
    return (value * window.parent.settings.markerSizeMeters).toFixed(2);
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
        var distance = (this.el.object3D.position.length() * window.parent.settings.markerSizeMeters).toFixed(2);
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