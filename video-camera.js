window.addEventListener('load', (event) => {
    loadCameraDevices(document.querySelector('#cameraDevice'));
});

function loadCameraDevices(dropdownElement) {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                if (device.kind == 'videoinput') {
                    dropdownElement.insertAdjacentHTML('beforeend', '<option value="' + device.deviceId + '">' + device.label + '</option>')
                }
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
        });
}