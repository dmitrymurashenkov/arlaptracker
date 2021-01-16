function addPilot() {
    var pilotVideos = document.querySelectorAll('.pilot-video');
    var lastVideo = pilotVideos[pilotVideos.length - 1];
    lastVideo.insertAdjacentHTML('afterend',
        '<div class="pilot-video">\n' +
        '    <iframe src="video.html" width="720" height="576"></iframe>\n' +
        '</div>');

}

//We want to avoid vertical scrollbars for the whole <body> in order to record all race
//info via screen capture. I've failed to do it via CSS, so let's use JS resizing!
window.addEventListener('load', maximizeLapsPanel)
window.addEventListener('resize', maximizeLapsPanel);

function maximizeLapsPanel() {
    document.querySelector('.laps-panel').style.height = (window.innerHeight - 390) + 'px';
}
