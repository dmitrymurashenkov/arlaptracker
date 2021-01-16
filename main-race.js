var race = {
    startTime: null,
    laps: []
}

//API definition for 'race.laps' property
let lapModel = {
    pilot: 'Pilot1',
    lapNumber: 3,
    time: 5.142,
    split: 10.323
}

function toggleRace() {
    if (!race.startTime) {
        if (checkPilotNamesUnique()) {
            startRecord(buildRecordFileName(), function () {
                race.startTime = new Date();
                race.laps = [];
                initStartTime(race.startTime);

                let lapTableRows = document.querySelectorAll('.laps-table-data-row');
                for (let i = 0; i < lapTableRows.length; i++) {
                    lapTableRows[i].remove();
                }

                document.querySelector('.start-race-button').innerHTML = "Stop race";
                document.querySelector('.start-race-button').classList.add("stop-race-button");
            });
        }
    } else {
        stopRecord();

        race.startTime = null;
        race.laps = [];

        document.querySelector('.start-race-button').innerHTML = "Start race";
        document.querySelector('.start-race-button').classList.remove("stop-race-button");
    }
}

function buildRecordFileName() {
    let pilotNamesString = '';
    //Record start date doesn't match actual race start date
    let recordStartDate = new Date();
    let iframes = document.querySelectorAll('.pilot-video > iframe');
    for (let i = 0; i < iframes.length; i++) {
        let pilotName = iframes[i].contentWindow.document.querySelector('#pilotName').value;
        pilotNamesString += pilotName + '-';
    }
    return "race-" + pilotNamesString + recordStartDate.toLocaleDateString() + "-" + recordStartDate.toLocaleTimeString() + ".webm"
}

function checkPilotNamesUnique() {
    let pilotNames = [];
    let iframes = document.querySelectorAll('.pilot-video > iframe');
    for (let i = 0; i < iframes.length; i++) {
        let pilotName = iframes[i].contentWindow.document.querySelector('#pilotName').value;
        if (pilotNames.includes(pilotName)) {
            alert('Pilot names must be unique!');
            return false;
        }
        else {
            pilotNames.push(pilotName);
        }
    }
    return true;
}

function initStartTime(raceStartTime) {
    let videoFrames = document.querySelectorAll('iframe');
    for (let i = 0; i < videoFrames.length; i++) {
        videoFrames[i].contentWindow.currentLapStartTime = raceStartTime;
        videoFrames[i].contentWindow.currentLapNumber = 1;
    }
}

function drawRaceTime() {
    if (race.startTime) {
        let raceTime = (new Date().getTime() - race.startTime.getTime()) / 1000;
        document.querySelector('.race-time').innerHTML = formatRaceTime(raceTime);
    }
}

function formatRaceTime(raceTimeSeconds) {
    var hours   = Math.floor(raceTimeSeconds / 3600);
    var minutes = Math.floor((raceTimeSeconds - (hours * 3600)) / 60);
    var seconds = raceTimeSeconds - (hours * 3600) - (minutes * 60);
    seconds = seconds.toFixed(3);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

setInterval(drawRaceTime, 31);

function drawLaps() {
    let displayedLaps = document.querySelectorAll('.laps-table-data-row').length;
    for (let i = displayedLaps; i < race.laps.length; i++) {
        let lapToDraw = race.laps[i];

        let lapsTable = document.querySelector('.lap-times > tbody');

        lapsTable.innerHTML +=
            '<tr class="laps-table-data-row">\n' +
            '   <td class="lap-pilot">' + lapToDraw.pilot + '</td>\n' +
            '   <td class="lap-number">' + lapToDraw.lapNumber + '</td>\n' +
            '   <td class="lap-time">' + lapToDraw.time + '</td>\n' +
            '   <td class="lap-split">' + lapToDraw.split + '</td>\n' +
        '</tr>';

        document.querySelector('#lap-finished-audio').play();
    }
}

setInterval(drawLaps, 100);