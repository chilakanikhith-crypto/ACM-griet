// Web Audio API Sound Synthesizer for Algorithm Visualizations

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  playTone(frequency = 440, type = 'sine', duration = 0.08, volume = 0.04) {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  playCompare(val, maxVal = 100) {
    const freq = 200 + (val / maxVal) * 600;
    this.playTone(freq, 'triangle', 0.06, 0.03);
  }

  playSwap(val, maxVal = 100) {
    const freq = 300 + (val / maxVal) * 800;
    this.playTone(freq, 'sawtooth', 0.09, 0.04);
  }

  playVisit(nodeIndex, totalNodes = 10) {
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
    const freq = notes[nodeIndex % notes.length];
    this.playTone(freq, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    if (!this.isEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.15, 0.05);
      }, idx * 70);
    });
  }
}

export const sound = new SoundEngine();
