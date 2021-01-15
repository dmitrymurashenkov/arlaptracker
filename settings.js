var settings = {
    markerSizeMeters: 0.17,
    minMarkerDistanceMeters: 1.5,
    minLapTimeSeconds: 5,
    pilotName: 'Pilot1'
}

window.addEventListener('load', (event) => {
    document.querySelector("#markerSizeMeters").value = settings.markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = settings.minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = settings.minLapTimeSeconds;
    document.querySelector("#pilotName").value = settings.pilotName;

    applySettings();
});

function applySettings() {
    //todo disable settings propagation during race
    settings.markerSizeMeters = document.querySelector("#markerSizeMeters").value;
    settings.minMarkerDistanceMeters = document.querySelector("#minMarkerDistanceMeters").value;
    settings.minLapTimeSeconds = document.querySelector("#minLapTimeSeconds").value;
    settings.pilotName = document.querySelector("#pilotName").value;

    var areas = document.querySelectorAll('a-marker > a-box');
    for (var i = 0; i < areas.length; i++) {
        areas[i].setAttribute('width', settings.minMarkerDistanceMeters / settings.markerSizeMeters);
        areas[i].setAttribute('height', settings.minMarkerDistanceMeters / settings.markerSizeMeters);
        areas[i].setAttribute('depth', settings.minMarkerDistanceMeters / settings.markerSizeMeters);
    }
}