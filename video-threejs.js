var markerRoots = [];

var consecutiveDetects = 0;
var markerLastDistance = null;
var markerLastSeenTime = new Date();
var pendingLapFinished = false;
let ticks = 0;

function toMeters(value) {
    return heuristicScale((value * window.parent.settings.markerSizeMeters)).toFixed(2);
}

function heuristicScale(meters) {
    return meters/2.7;
}

var threeRenderer;
var threeScene;

function initThreeJS() {

    let cameraDeviceId = document.querySelector('#cameraDevice').value;
    ARController.getUserMediaThreeScene({
        // maxARVideoSize: 320,
        maxARVideoSize: 640,
        deviceId: cameraDeviceId,
        cameraParam: 'lib/camera_para-iPhone 5 rear 640x480 1.0m.dat',
        onSuccess: function(arScene, arController, arCamera) {

            threeScene = arScene;

            document.body.className = arController.orientation;

            // arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
            arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO);

            threeRenderer = new THREE.WebGLRenderer({antialias: true});

            threeRenderer.setSize(arController.videoWidth, arController.videoHeight);

            document.querySelector('body').append(threeRenderer.domElement);
            //Default styles have fixed width-height
            threeRenderer.domElement.style = '';

            addMarker(arController, arScene, "markers/tinyviewplus-marker_00_main_a.patt", 0x0000ff);
            addMarker(arController, arScene, "markers/tinyviewplus-marker_01_main_b.patt", 0xFFB6C1);
            addMarker(arController, arScene, "markers/tinyviewplus-marker_02_main_c.patt", 0x00ff00);
            addMarker(arController, arScene, "markers/tinyviewplus-marker_03_main_d.patt", 0xffff00);

            var tick = function() {
                arScene.process();
                arScene.renderOn(threeRenderer);

                ticks++;

                checkMarkerLost();

                requestAnimationFrame(tick);
            };

            tick();

        }
    });

    delete window.ARThreeOnLoad;
}

function checkMarkerLost(markerRoot) {
    let anyVisible = false;
    let minDistance = 999999999;
    //We treat all markers as interchangeable - "at least one visible" semantics
    for (let i = 0; i < markerRoots.length; i++) {
        let markerRoot = markerRoots[i];
        if (markerRoot.visible) {
            anyVisible = true;
            let distance = metersToMarker(markerRoot);

            let distanceXY = toScreenPosition(markerRoot, threeScene.camera);
            markerRoot.distanceDiv.hidden = false;
            markerRoot.distanceDiv.style.left = distanceXY.x + "px";
            markerRoot.distanceDiv.style.top = distanceXY.y + "px";
            markerRoot.distanceDiv.style.top = distanceXY.y + "px";
            markerRoot.distanceDiv.innerHTML = distance + "m";

            if (distance < minDistance) {
                minDistance = distance;
            }
        }
        else {
            markerRoot.distanceDiv.hidden = true;
        }
    }

    if (anyVisible) {
        markerLastDistance = minDistance;
        markerLastSeenTime = new Date();
        pendingLapFinished = false;
        consecutiveDetects++;
        console.log('consecutiveDetects', consecutiveDetects)
    } else {
        //Markers are often erroneously found in fpv noise, so we try to avoid it by checking
        //that many frames saw marker recently. It's better to check that we saw same marker,
        //but in real cases usually we detect marker in only 1 in 50 noise frames, so it doesn't
        //matter. Min value should be 2, but for safety we start with 3 as the default.
        if (consecutiveDetects >= window.parent.settings.minFramesWithMarker) {
            //If we move camera marker can be missed in intermediate frame for a couple of ms,
            //but then be detected again. So we remember that we've just lost it and if it doesn't
            //reappear soon - we'll trigger lap finish check.
            pendingLapFinished = true;
            console.log('pendingLapFinished distance', markerLastDistance)
        }
        if (pendingLapFinished && (new Date().getTime() - markerLastSeenTime.getTime()) > 1000) {
            console.log('checkLapFinished')
            checkLapFinished(markerLastDistance, markerLastSeenTime);
            pendingLapFinished = false;
            markerLastDistance = 9999999999;
        }
        consecutiveDetects = 0;
    }
}

function metersToMarker(markerRoot) {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(markerRoot.matrixWorld);
    return toMeters(position.length());
}

function addMarker(arController, arScene, patternFile, color) {
    arController.loadMarker(
        patternFile,
        function(markerUID) {
            console.log('Loaded marker ' + markerUID + " from "+ patternFile);

            var markerRoot = arController.createThreeMarker(markerUID, 1);

            //todo only applied with iframe reload, but doesn't affect detection
            let boxSize = window.parent.settings.minMarkerDistanceMeters/window.parent.settings.markerSizeMeters;

            const geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize );
            const material = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0.5,
                transparent: true
            });

            var box = new THREE.Mesh(geometry, material);
            box.material.flatShading;
            box.position.z = 0.5;
            markerRoot.add(box);
            arScene.scene.add(markerRoot);

            markerRoots.push(markerRoot);

            var distanceDiv = document.createElement("div");
            distanceDiv.hidden = true;
            distanceDiv.style.position = 'fixed';
            distanceDiv.style.top = '0';
            distanceDiv.style.left = '0';
            distanceDiv.style.color = 'white';
            distanceDiv.style.fontSize = '50';
            distanceDiv.style.fontWeight = '600';
            distanceDiv.innerHTML = "Distance to marker here!";
            markerRoot.distanceDiv = distanceDiv;

            document.body.append(distanceDiv);
        }
    );
}

function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*threeRenderer.context.canvas.width;
    var heightHalf = 0.5*threeRenderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };

}