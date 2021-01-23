var settings = {
    markerSizeMeters: 0.16,
    minMarkerDistanceMeters: 1.5,
    minLapTimeSeconds: 5,
    recordVideo: true,
    coundownMinSeconds: 3,
    coundownMaxSeconds: 3
}

var cameraDevices = [];

window.addEventListener('load', (event) => {
    urlToSettings();
    displaySettings();
});

function displaySettings() {
    document.querySelector("#markerSizeMeters").value = settings.markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = settings.minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = settings.minLapTimeSeconds;
    document.querySelector("#recordVideo").checked = settings.recordVideo === true || settings.recordVideo === 'true';
    document.querySelector("#coundownMinSeconds").value = settings.coundownMinSeconds;
    document.querySelector("#coundownMaxSeconds").value = settings.coundownMaxSeconds;
}

function applySettings() {
    settings.markerSizeMeters = document.querySelector("#markerSizeMeters").value;
    settings.minMarkerDistanceMeters = document.querySelector("#minMarkerDistanceMeters").value;
    settings.minLapTimeSeconds = document.querySelector("#minLapTimeSeconds").value;
    settings.recordVideo = document.querySelector("#recordVideo").checked;
    settings.coundownMinSeconds = document.querySelector("#coundownMinSeconds").value;
    settings.coundownMaxSeconds = document.querySelector("#coundownMaxSeconds").value;

    settingsToUrl();
}

function settingsToUrl() {
    var searchParams = new URLSearchParams(window.location.search);

    searchParams.set("markerSizeMeters", settings.markerSizeMeters);
    searchParams.set("minMarkerDistanceMeters", settings.minMarkerDistanceMeters);
    searchParams.set("minLapTimeSeconds", settings.minLapTimeSeconds);
    searchParams.set("recordVideo", settings.recordVideo);
    searchParams.set("coundownMinSeconds", settings.coundownMinSeconds);
    searchParams.set("coundownMaxSeconds", settings.coundownMaxSeconds);

    let pilots = [];
    let iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
        let iframe = iframes[i];

        if (iframe.contentWindow.camerasLoaded) {
            let cameraDeviceSelect = iframe.contentDocument.querySelector('#cameraDevice');
            let pilotName = iframe.contentDocument.querySelector('#pilotName').value;
            let cameraDevice = (cameraDeviceSelect.selectedOptions.length === 0) ? "" : cameraDeviceSelect.selectedOptions[0].value;

            pilots.push(pilotName + ":" + cameraDevice);
        }
    }

    searchParams.set("pilots", pilots);

    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
}

function urlToSettings() {
    var searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("markerSizeMeters")) {
        settings.markerSizeMeters = searchParams.get("markerSizeMeters");
    }
    if (searchParams.get("minMarkerDistanceMeters")) {
        settings.minMarkerDistanceMeters = searchParams.get("minMarkerDistanceMeters");
    }
    if (searchParams.get("minLapTimeSeconds")) {
        settings.minLapTimeSeconds = searchParams.get("minLapTimeSeconds");
    }
    if (searchParams.get("recordVideo")) {
        settings.recordVideo = searchParams.get("recordVideo");
    }
    if (searchParams.get("coundownMinSeconds")) {
        settings.coundownMinSeconds = searchParams.get("coundownMinSeconds");
    }
    if (searchParams.get("coundownMaxSeconds")) {
        settings.coundownMaxSeconds = searchParams.get("coundownMaxSeconds");
    }

    if (searchParams.get('pilots')) {
        let pilots = searchParams.get('pilots').split(",");
        for (let i = 0; i < pilots.length; i++) {
            let pilot = pilots[i];
            if (pilot !== "") {
                let nameDevice = pilot.split(':');
                let pilotName = nameDevice[0];
                let cameraDevice = nameDevice.length > 1 ? nameDevice[1] : null;

                addPilot(pilotName, cameraDevice);
            }
        }
    }
    else {
        addPilot("Pilot1", null);
    }
}