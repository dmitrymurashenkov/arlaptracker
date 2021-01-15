var markerSizeMeters = 0.17;
var minMarkerDistanceMeters = 1.5;
var minLapTimeSeconds = 5;
var pilotName = 'Pilot1';

var raceStartTime;

var laps = [];
var currentLapStartTime;

var videoRecordBlobs;
var mediaRecorder;

function toMeters(value) {
    //Although a-frame declares to have all sizes in meters - actually they are in marker sizes
    //so we have to scale manually
    //
    //For simplicity we always round to 2 fraction digits
    return (value * markerSizeMeters).toFixed(2);
}

AFRAME.registerComponent('listendistance', {
    init: function () {

        var marker = this.el;

        this.text = marker.querySelector(":scope > a-text");

        marker.addEventListener('markerLost', function () {
            if (raceStartTime) {
                let distanceToMarker = toMeters(marker.object3D.position.length());
                console.log('marker lost ' + distanceToMarker)
                if (distanceToMarker < minMarkerDistanceMeters) {
                    //We were close to marker - seems we've just finished our lap
                    let split = new Date();
                    let lapTimeSeconds = (split.getTime() - currentLapStartTime.getTime()) / 1000;
                    if (lapTimeSeconds > minLapTimeSeconds) {
                        laps.push(lapTimeSeconds);
                        console.log('Lap finished ' + lapTimeSeconds)
                        currentLapStartTime = new Date();

                        var lapsTable = document.querySelector('.lap-times > tbody');

                        lapsTable.innerHTML +=
                            '<tr class="laps-table-data-row">\n' +
                            '   <td class="lap-number">' + laps.length + '</td>\n' +
                            '   <td class="lap-time">' + lapTimeSeconds + '</td>\n' +
                            '   <td class="lap-split">' + (split.getTime() - raceStartTime.getTime()) / 1000 + '</td>\n' +
                            '</tr>';

                        document.querySelector('#lap-finished-audio').play();

                    }
                }
            }
        });
    },
    tick: function (time, timeDelta) {
        var distance = (this.el.object3D.position.length() * markerSizeMeters).toFixed(2);
        this.text.setAttribute('value', distance + 'm');
    }
});

window.addEventListener('load', (event) => {
    document.querySelector("#markerSizeMeters").value = markerSizeMeters;
    document.querySelector("#minMarkerDistanceMeters").value = minMarkerDistanceMeters;
    document.querySelector("#minLapTimeSeconds").value = minLapTimeSeconds;
    document.querySelector("#pilotName").value = pilotName;

    applySettings();
});

function applySettings() {
    //todo disable settings propagation during race
    markerSizeMeters = document.querySelector("#markerSizeMeters").value;
    minMarkerDistanceMeters = document.querySelector("#minMarkerDistanceMeters").value;
    minLapTimeSeconds = document.querySelector("#minLapTimeSeconds").value;
    pilotName = document.querySelector("#pilotName").value;

    var areas = document.querySelectorAll('a-marker > a-box');
    for (var i = 0; i < areas.length; i++) {
        areas[i].setAttribute('width', minMarkerDistanceMeters / markerSizeMeters);
        areas[i].setAttribute('height', minMarkerDistanceMeters / markerSizeMeters);
        areas[i].setAttribute('depth', minMarkerDistanceMeters / markerSizeMeters);
    }
}

function toggleRace() {
    if (!raceStartTime) {
        startRecord(function () {
            raceStartTime = new Date();
            laps = [];

            var lapTableRows = document.querySelectorAll('.laps-table-data-row');
            for (let i = 0; i < lapTableRows.length; i++) {
                lapTableRows[i].remove();
            }

            currentLapStartTime = new Date();
            document.querySelector('.start-race-button').innerHTML = "Stop race";
            document.querySelector('.start-race-button').style.background = "orange";
        });
    } else {
        stopRecord();

        raceStartTime = null;
        currentLapStartTime = null;
        document.querySelector('.start-race-button').innerHTML = "Start race";
        document.querySelector('.start-race-button').style.background = "lightgreen";
    }
}

function startRecord(callback) {
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

            var options = buildRecordingOptions();
            try {
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
                return;
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
                a.download = "race-" + pilotName + "-" + recordStartTime.toISOString() + ".webm";
                a.click();
                window.URL.revokeObjectURL(url);
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
