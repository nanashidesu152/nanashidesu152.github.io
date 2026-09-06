class myWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        
        const inputSamples = inputs[0][0];
        console.log(inputSamples);
    }
}

registerProcessor('processor', myWorkletProcessor);