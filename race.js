var raceStartTime;

var laps = [];
var currentLapStartTime;

function toMeters(value) {
    //Although a-frame declares to have all sizes in meters - actually they are in marker sizes
    //so we have to scale manually
    //
    //For simplicity we always round to 2 fraction digits
    return (value * settings.markerSizeMeters).toFixed(2);
}

AFRAME.registerComponent('finishmarker', {
    init: function () {
        var marker = this.el;

        marker.addEventListener('markerLost', function () {
            checkLapFinished();
        });
    },
});

//Show distance to detected marker
AFRAME.registerComponent('showdistance', {
    init: function () {
        var marker = this.el;

        this.textEl = marker.querySelector(":scope > a-text");
    },
    tick: function (time, timeDelta) {
        var distance = (this.el.object3D.position.length() * settings.markerSizeMeters).toFixed(2);
        this.textEl.setAttribute('value', distance + 'm');
    }
});

function checkLapFinished() {
    if (raceStartTime) {
        let distanceToMarker = toMeters(marker.object3D.position.length());
        console.log('marker lost ' + distanceToMarker)
        if (distanceToMarker < settings.minMarkerDistanceMeters) {
            //We were close to marker - seems we've just finished our lap
            let split = new Date();
            let lapTimeSeconds = (split.getTime() - currentLapStartTime.getTime()) / 1000;
            if (lapTimeSeconds > settings.minLapTimeSeconds) {
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
}

function toggleRace() {
    if (!raceStartTime) {
        startRecord("race-" + settings.pilotName + "-" + new Date().toISOString() + ".webm", function () {
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