function addPilot() {
    var pilotVideos = document.querySelectorAll('.pilot-video');
    var lastVideo = pilotVideos[pilotVideos.length - 1];
    lastVideo.insertAdjacentHTML('afterend',
        '<div class="pilot-video">\n' +
        '    <iframe src="video.html" width="720" height="576"></iframe>\n' +
        '</div>');
    maximizeVideos();
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

