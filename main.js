let counter = 1;

function removePilot(iframeId) {
    document.querySelector('#' + iframeId).remove();
    settingsToUrl();
}

function addPilot(pilotName, cameraDeviceIndex) {
    if (!race.started) {
        pilotName = pilotName || "Pilot1";
        let url = "video.html?pilotName=" + pilotName;
        if (cameraDeviceIndex) {
            url += "&cameraDeviceIndex=" + cameraDeviceIndex;
        }

        let addPilotButton = document.querySelector('.add-pilot-button');
        addPilotButton.insertAdjacentHTML('beforebegin',
            '<div class="pilot-video">\n' +
            '    <iframe id="video' + (counter++) + '" src="' + url + '" width="720" height="576"></iframe>\n' +
            '</div>');
        maximizeVideos();
    }
}

//We want to avoid vertical scrollbars for the whole <body> in order to record all race
//info via screen capture. I've failed to do it via CSS, so let's use JS resizing!
window.addEventListener('load', maximizeLapsPanel);
window.addEventListener('resize', maximizeLapsPanel);

function maximizeLapsPanel() {
    document.querySelector('.laps-panel').style.height = (window.innerHeight - 350) + 'px';
}

window.addEventListener('load', maximizeVideos);
window.addEventListener('resize', maximizeVideos);

function maximizeVideos() {
    //Videos are PAL so resolution and aspect ratio should be fixed
    let aspectRatio = 720/576;

    let videoHeight = (window.innerHeight - 50)/2;
    let videoWidth = videoHeight*aspectRatio;

    let iframes = document.querySelectorAll('.videos-panel > div > iframe');
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].height = videoHeight + 'px';
        iframes[i].width = videoWidth + 'px';
    }

    let plusButtonDivs = document.querySelectorAll('.add-pilot-button, .plus');
    for (let i = 0; i < plusButtonDivs.length; i++) {
        plusButtonDivs[i].style.height = videoHeight + 'px';
        plusButtonDivs[i].style.width = videoWidth + 'px';
        plusButtonDivs[i].style.fontSize = videoHeight*0.9 + 'px';
    }
}

