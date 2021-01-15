function addPilot() {
    var pilotVideos = document.querySelectorAll('.pilot-video');
    var lastVideo = pilotVideos[pilotVideos.length - 1];
    lastVideo.insertAdjacentHTML('afterend',
        '<div class="pilot-video">\n' +
        '    <iframe src="video.html" width="720" height="576"></iframe>\n' +
        '</div>');

}