var videoRecordBlobs;
var mediaRecorder;
var recordFilename;

//Before record is started - user is asked to select browser tab to record,
//and after that specified callback is invoked.
function startRecord(filename, callback) {
    recordFilename = filename;

    var displayMediaOptions = {
        video: {
            cursor: "never"
        },
        audio: false
    };

    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        .catch(err => {
            console.error("Error:" + err);
            return null;
        })
        .then(function (stream) {
            videoRecordBlobs = [];

            let recordStartTime = new Date();

            var options = buildRecordingOptions();
            try {
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
                return;
            }

            mediaRecorder.ondataavailable = saveRecordedBlob;
            mediaRecorder.start();

            callback();
        });
}

function stopRecord() {
    if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        mediaRecorder.stop();
        mediaRecorder = null;
    }
}

function buildRecordingOptions() {
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: 'video/webm;codecs=vp8,opus'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not supported`);
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not supported`);
                options = {mimeType: ''};
            }
        }
    }
    return options;
}


function saveRecordedBlob(event) {
    console.log('handleDataAvailable', event);
    if (event.data.size > 0) {
        videoRecordBlobs.push(event.data);
        saveRecordToFile();
    }
}

function saveRecordToFile() {
    var blob = new Blob(videoRecordBlobs, {
        type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = recordFilename;
    a.click();
    window.URL.revokeObjectURL(url);
}