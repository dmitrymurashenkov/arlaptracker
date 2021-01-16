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
            dropdownElement.dispatchEvent(new Event('change'));

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
            video: {deviceId: {exact: devicesDropdown.value}},
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
        window.frameElement.parentElement.remove();
    }
}