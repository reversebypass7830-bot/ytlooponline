declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
}

declare function registerProcessor(name: string, processor: typeof AudioWorkletProcessor): void;

class RLoopMicrophoneProcessor extends AudioWorkletProcessor {
  private readonly pcmSamples = 960;
  private pcm = new Int16Array(this.pcmSamples);
  private offset = 0;
  private levelTick = 0;

  process(inputs: Float32Array[][]): boolean {
    const input = inputs[0]?.[0];
    if (!input?.length) return true;

    let levelSum = 0;
    for (let index = 0; index < input.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, input[index]));
      levelSum += Math.abs(sample);
      this.pcm[this.offset] = Math.round(sample * 32767);
      this.offset += 1;
      if (this.offset !== this.pcmSamples) continue;

      const chunk = this.pcm.buffer;
      this.port.postMessage({ type: "pcm", buffer: chunk }, [chunk]);
      this.pcm = new Int16Array(this.pcmSamples);
      this.offset = 0;
    }

    this.levelTick += 1;
    if (this.levelTick % 10 === 0) {
      const level = Math.min(100, Math.round((levelSum / input.length) * 280));
      this.port.postMessage({ type: "level", level });
    }
    return true;
  }
}

registerProcessor("r-loop-microphone-capture", RLoopMicrophoneProcessor);