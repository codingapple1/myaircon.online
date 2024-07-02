
class BrownNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastOut = 0.0;
  }


  process(inputs, outputs, parameters) {
    const output = outputs[0];
    for (let channel = 0; channel < output.length; channel++) {
      let outputChannel = output[channel];
      for (let i = 0; i < outputChannel.length; i++) {
        let white = Math.random() * 2 - 1;
        outputChannel[i] = (this.lastOut + (0.03 * white)) / 1.02;
        this.lastOut = outputChannel[i];
        outputChannel[i] *= 3.5;
      }
    }
    return true;
  }
}

registerProcessor('brown-noise-processor', BrownNoiseProcessor);



