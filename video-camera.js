var camerasLoaded = false;

window.addEventListener('load', function () {
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
            if (firstCamera) {
                alert('No cameras found - please connect USB FPV receiver!');
            }
            dropdownElement.insertAdjacentHTML('beforeend', '<option value="">Remove pilot</option>');
            camerasLoaded = true;
            urlToVideoSettings();
            window.parent.settingsToUrl();
            //ThreeJS will take selected camera
            initThreeJS();
        })
        .catch(function (err) {
            console.log('Failed to list available camera devices', err);
            alert(console.log('Failed to list available camera devices: ' + err));
        });
}

function onCameraSelected() {
    let devicesDropdown = document.querySelector('#cameraDevice');

    let cameraChanged = false;
    if (devicesDropdown.value) {
        queueMicrotask(() => {
            //Reload whole iframe to apply changes
            window.location.href = window.parent.buildIframeUrl(
                document.querySelector('#pilotName').value,
                document.querySelector('#cameraDevice').selectedIndex
            );
        })
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
}