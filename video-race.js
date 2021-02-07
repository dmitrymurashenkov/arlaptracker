var currentLapStartTime;
var currentLapNumber;

function checkLapFinished(metersToMarker, lapFinishTime) {
    if (window.parent.race.startTime) {

        if (metersToMarker < window.parent.settings.minMarkerDistanceMeters) {
            //We were close to marker - seems we've just finished our lap
            let splitSeconds = (lapFinishTime - window.parent.race.startTime.getTime()) / 1000;
            let lapTimeSeconds = (lapFinishTime.getTime() - currentLapStartTime.getTime()) / 1000;

            if (lapTimeSeconds > window.parent.settings.minLapTimeSeconds) {
                let lap = {
                    pilot: document.querySelector('#pilotName').value,
                    lapNumber: currentLapNumber++,
                    split: splitSeconds,
                    time: lapTimeSeconds
                }
                window.parent.race.laps.push(lap);
                currentLapStartTime = new Date();
            }
        }
    }
}