var settings = {
    markerSizeMeters: 0.17,
    minMarkerDistanceMeters: 1.5,
    minLapTimeSeconds: 5,
    recordVideo: true
}

var cameraDevices = [];

window.addEventListener('load', (event) => {
    document.querySelector("#markerSizeMeters").value = settings.markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = settings.minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = settings.minLapTimeSeconds;
    document.querySelector("#recordVideo").checked = settings.recordVideo;

    applySettings();
});

function applySettings() {
    //todo disable settings propagation during race
    settings.markerSizeMeters = document.querySelector("#markerSizeMeters").value;
    settings.minMarkerDistanceMeters = document.querySelector("#minMarkerDistanceMeters").value;
    settings.minLapTimeSeconds = document.querySelector("#minLapTimeSeconds").value;
    settings.recordVideo = document.querySelector("#recordVideo").checked;
}