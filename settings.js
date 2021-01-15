var settings = {
    markerSizeMeters: 0.17,
    minMarkerDistanceMeters: 1.5,
    minLapTimeSeconds: 5,
    pilotName: 'Pilot1',
    cameraDevice: null
}

var cameraDevices = [];

window.addEventListener('load', (event) => {
    document.querySelector("#markerSizeMeters").value = settings.markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = settings.minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = settings.minLapTimeSeconds;
    document.querySelector("#pilotName").value = settings.pilotName;

    applySettings();

    loadCameraDevices(document.querySelector('#cameraDevice'));
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

function loadCameraDevices(dropdownElement) {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            console.log('Got devices!', devices);

            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                if (device.kind == 'videoinput') {
                    cameraDevices.push(device);
                    dropdownElement.insertAdjacentHTML('beforeend', '<option value="' + device.deviceId + '">' + device.label + '</option>')
                }
            }

            if (cameraDevices.length == 0) {
                alert('No camera devices found - please connect USB video receiver!');
            }
        })
        .catch(function (err) {
            console.log('Failed to list available camera devices', err);
            alert(console.log('Failed to list available camera devices: ' + err));
        });
}

function onCameraSelected() {
    let devicesDropdown = document.querySelector('#cameraDevice');
    console.log('New camera selected', devicesDropdown.value);

    var arjsVideo = document.querySelector("#arjs-video");

    var oldStream = arjsVideo.srcObject;
    oldStream.getTracks().forEach(function (track) {
        track.stop();
    });


    var constraints = {
        audio: false,
        video: { deviceId: { exact: devicesDropdown.value } },
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function success(stream) {
            arjsVideo.srcObject = stream;

            //reinit arjs
            var event = new CustomEvent("camera-init", { stream: stream });
            window.dispatchEvent(event);

            // document.body.addEventListener("click", function () {
            //     arjsVideo.play();
            // });
    });
}

function getDevice(deviceId) {
    for (let i = 0; i < cameraDevices; i++) {
        let device = cameraDevices[i];
        if (device.deviceId == deviceId) {
            return device;
        }
    }
}