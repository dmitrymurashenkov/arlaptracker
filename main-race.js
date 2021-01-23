var race = {
    started: false,
    startTime: null,
    countdownTimer: null,
    raceStartTimer: null,
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
    if (!race.started) {
        if (checkPilotNamesUnique()) {
            startRecord(buildRecordFileName(), startRaceWithCountdown);
        }
    } else {
        stopRecord();

        race.started = false;
        race.startTime = null;
        race.laps = [];
        if (race.countdownTimer) {
            clearInterval(race.countdownTimer);
            race.countdownTimer = null;
        }
        if (race.raceStartTimer) {
            clearTimeout(race.raceStartTimer);
            race.raceStartTimer = null;
        }

        document.querySelector('.start-race-button').innerHTML = "Start race";
        document.querySelector('.start-race-button').classList.remove("stop-race-button");
        enableSettingsEdit(true);
    }
}

function startRaceWithCountdown() {
    race.started = true;
    let lapTableRows = document.querySelectorAll('.laps-table-data-row');
    for (let i = 0; i < lapTableRows.length; i++) {
        lapTableRows[i].remove();
    }

    document.querySelector('.start-race-button').innerHTML = "Stop race";
    document.querySelector('.start-race-button').classList.add("stop-race-button");
    enableSettingsEdit(false);

    let countdownSeconds = Math.random() * (settings.coundownMaxSeconds - settings.coundownMinSeconds) + parseInt(settings.coundownMinSeconds);
    race.raceStartTimer = setTimeout(function () {
        clearInterval(race.countdownTimer);
        document.querySelector('#start-audio').play();

        race.startTime = new Date();
        race.laps = [];
        initStartTime(race.startTime);
    }, countdownSeconds*1000);

    race.countdownTimer = setInterval(function () {
        document.querySelector('#countdown-audio').play();
    }, 1000);

    document.querySelector('#countdown-audio').play();
}

function enableSettingsEdit(enable) {
    let inputs = document.querySelectorAll('.setting-panel > input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = !enable;
    }

    let iframes = document.querySelectorAll('.pilot-video > iframe');
    for (let i = 0; i < iframes.length; i++) {
        let pilotOptions = iframes[i].contentWindow.document.querySelectorAll('.video-option > input, select');
        for (let j = 0; j < pilotOptions.length; j++) {
            pilotOptions[j].disabled = !enable;
        }
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
    if (race.started) {
        if (race.startTime) {
            let raceTime = (new Date().getTime() - race.startTime.getTime()) / 1000;
            document.querySelector('.race-time').innerHTML = formatRaceTime(raceTime);
        }
        else {
            document.querySelector('.race-time').innerHTML = '00:00.000';
        }
    }
}

function formatRaceTime(raceTimeSeconds) {
    var minutes = Math.floor((raceTimeSeconds) / 60);
    var seconds = raceTimeSeconds - (minutes * 60);
    seconds = seconds.toFixed(3);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

setInterval(drawRaceTime, 31);

function drawLaps() {
    let displayedLaps = document.querySelectorAll('.laps-table-data-row').length;
    for (let i = displayedLaps; i < race.laps.length; i++) {
        let lapToDraw = race.laps[i];

        let lapsTable = document.querySelector('.lap-times > tbody');

        lapsTable.innerHTML +=
            '<tr class="laps-table-data-row">\n' +
            '   <td class="lap-pilot laps-column-pilot">' + lapToDraw.pilot + '</td>\n' +
            '   <td class="lap-number laps-column-number">' + lapToDraw.lapNumber + '</td>\n' +
            '   <td class="lap-time laps-column-time">' + lapToDraw.time + '</td>\n' +
            '   <td class="lap-split laps-column-split">' + formatRaceTime(lapToDraw.split) + '</td>\n' +
        '</tr>';

        document.querySelector('#lap-finished-audio').play();

        //Autoscroll laps table to bottom by default - hover mouse over table to prevent it
        if (!document.querySelector('.lap-times-scrollbox:hover')) {
            document.querySelector('.lap-times-scrollbox').scrollTop = document.querySelector('.lap-times-scrollbox').scrollHeight;
        }
    }
}

setInterval(drawLaps, 100);