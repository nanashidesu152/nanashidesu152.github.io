import {jsQR} from "./jsQR";

const showCode = document.getElementById("Code");
const readQR = document.getElementById("readQR");
const QR_wrapper = document.getElementById("QR_wrapper");

const video = document.getElementById('video');
let contentWidth;
let contentHeight;

readQR.onclick = () => {
    QR_wrapper.style.visibility = "visible";
    const media = navigator.mediaDevices.getUserMedia({audio: false, video: {width:640, height:480}})
        .then((stream) => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                contentWidth = video.clientWidth;
                contentHeight = video.clientHeight;
                canvasUpdate();
                checkImage();
            }
        }).catch((err) => {
            console.log(err);
        })
}



const cvs = document.getElementById('camera-canvas');
const ctx = cvs.getContext('2d',{willReadFrequently: true});
const canvasUpdate = () => {
    cvs.width = contentWidth;
    cvs.height = contentHeight;
    ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
    requestAnimationFrame(canvasUpdate);
}

const rectCvs = document.getElementById('rect-canvas');
const rectCtx = rectCvs.getContext('2d',{willReadFrequently: true});
const checkImage = () => {
    const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
    const code = jsQR(imageData.data, contentWidth, contentHeight);

    if (code) {
        drawRect(code.location);
        scanedCode(code);
    } else {
        rectCtx.clearRect(0, 0, contentWidth, contentHeight);
    }
    setTimeout(() => { checkImage(); }, 500);
}

const drawRect = (location) => {
    rectCvs.width = contentWidth;
    rectCvs.height = contentHeight;
    drawLine(location.topLeftCorner, location.topRightCorner);
    drawLine(location.topRightCorner, location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

const drawLine = (begin, end) => {
    rectCtx.lineWidth = 4;
    rectCtx.strokeStyle = "#F00";
    rectCtx.beginPath();
    rectCtx.moveTo(begin.x, begin.y);
    rectCtx.lineTo(end.x, end.y);
    rectCtx.stroke();
}

function scanedCode(code) {
    showCode.textContent = code.data;
    const stream = video.srcObject;
    stream.getTracks().forEach(track => {
        track.stop();
    });
    QR_wrapper.style.visibility = "hidden";
}