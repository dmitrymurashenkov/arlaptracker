var settings = {
    markerSizeMeters: 0.17,
    minMarkerDistanceMeters: 1.5,
    minLapTimeSeconds: 5,
    recordVideo: true,
    coundownMinSeconds: 3,
    coundownMaxSeconds: 3
}

var cameraDevices = [];

window.addEventListener('load', (event) => {
    document.querySelector("#markerSizeMeters").value = settings.markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = settings.minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = settings.minLapTimeSeconds;
    document.querySelector("#recordVideo").checked = settings.recordVideo;
    document.querySelector("#coundownMinSeconds").value = settings.coundownMinSeconds;
    document.querySelector("#coundownMaxSeconds").value = settings.coundownMaxSeconds;

    applySettings();
});

function applySettings() {
    settings.markerSizeMeters = document.querySelector("#markerSizeMeters").value;
    settings.minMarkerDistanceMeters = document.querySelector("#minMarkerDistanceMeters").value;
    settings.minLapTimeSeconds = document.querySelector("#minLapTimeSeconds").value;
    settings.recordVideo = document.querySelector("#recordVideo").checked;
    settings.coundownMinSeconds = document.querySelector("#coundownMinSeconds").value;
    settings.coundownMaxSeconds = document.querySelector("#coundownMaxSeconds").value;
}