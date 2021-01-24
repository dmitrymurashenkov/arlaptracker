var camerasLoaded = false;

window.addEventListener('arjs-video-loaded', (event) => {
    loadCameraDevices(document.querySelector('#cameraDevice'));
});

function loadCameraDevices(dropdownElement) {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {

            let firstCamera = true;
            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                if (device.kind == 'videoinput') {
                    let selected = '';
                    if (firstCamera) {
                        selected = 'selected';
                        firstCamera = false;
                    }
                    dropdownElement.insertAdjacentHTML('beforeend', '<option ' + selected + ' value="' + device.deviceId + '">' + device.label + '</option>');
                }
            }
            dropdownElement.insertAdjacentHTML('beforeend', '<option value="">Remove pilot</option>');
            camerasLoaded = true;
            urlToVideoSettings();
            //Seems if we call urlToVideoSettings() then no need to dispatch event
            //dropdownElement.dispatchEvent(new Event('change'));
        })
        .catch(function (err) {
            console.log('Failed to list available camera devices', err);
            alert(console.log('Failed to list available camera devices: ' + err));
        });
}

function onCameraSelected() {
    let devicesDropdown = document.querySelector('#cameraDevice');

    var arjsVideo = document.querySelector("#arjs-video");

    var oldStream = arjsVideo.srcObject;
    oldStream.getTracks().forEach(function (track) {
        track.stop();
    });

    if (devicesDropdown.value) {
        var constraints = {
            audio: false,
            video: {
                deviceId: {
                    exact: devicesDropdown.value
                },
            },
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function success(stream) {
                arjsVideo.srcObject = stream;

                //reinit arjs
                var event = new CustomEvent("camera-init", {stream: stream});
                window.dispatchEvent(event);
            });
    }
    else {
        window.parent.removePilot(window.frameElement.id);
    }
    window.parent.settingsToUrl();
}

function urlToVideoSettings() {
    var searchParams = new URLSearchParams(window.location.search);

    let pilotName = searchParams.get("pilotName");
    let cameraDeviceIndex = searchParams.get("cameraDeviceIndex");

    if (pilotName && pilotName !== "") {
        document.querySelector('#pilotName').value = pilotName;
    }
    if (cameraDeviceIndex && cameraDeviceIndex !== "") {
        let cameraSelect = document.querySelector('#cameraDevice');
        //There is always Remove pilot option in the list even if no cameras present
        if (cameraSelect.length > 1 && cameraDeviceIndex < cameraSelect.length - 1) {
            cameraSelect.selectedIndex = cameraDeviceIndex;
        }
    }
    onCameraSelected();
}