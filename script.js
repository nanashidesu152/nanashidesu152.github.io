const rec = document.getElementById("rec");
rec.addEventListener("click", recStart);

async function recStart() {

    let mediaStream;
    
    try{
        mediaStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    } catch(err) {
        console.log(err);
    }
    

    const audioContext = new AudioContext({sampleRate: 48000});

    const source = this.audioContext.createMediaStreamSource(mediaStream);

    const worklet = audioContext.audioWorklet;
    await worklet.addModule("./processor.js").then(() => {
        const processNode = new AudioWorkletNode(audioContext, 'processor');

        source.connect(processNode);
    });
}