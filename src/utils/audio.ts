// Web Audio API Synth Engine for real-time sound generation
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientNode: GainNode | null = null;
  private synthIntervals: number[] = [];
  private oscillators: OscillatorNode[] = [];

  constructor() {
    // Lazy loaded on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    this.initCtx();

    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  getMutedState(): boolean {
    return this.isMuted;
  }

  // Interaction sounds
  playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playTransition() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playStartup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(165, this.ctx.currentTime);
    
    osc1.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.2);
    osc2.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 1.5);
    osc2.stop(this.ctx.currentTime + 1.5);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.03, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  }

  // Procedural Background Ambient Drone
  private startAmbient() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopAmbient();

    this.ambientNode = this.ctx.createGain();
    this.ambientNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientNode.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 2.0); // Soft fade-in
    this.ambientNode.connect(this.ctx.destination);

    // Chords definition (low drone notes: C2, G2, C3, E3, A2)
    const baseFreqs = [65.41, 98.00, 130.81, 164.81, 110.00];

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientNode) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add a slow LFO to modulate volume/gain for ambient wave feel
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.05 + idx * 0.02; // Very slow speed
      lfoGain.gain.value = 0.004;

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      filter.type = 'lowpass';
      filter.frequency.value = 400;

      gain.gain.value = 0.015;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientNode);

      osc.start();
      lfo.start();
      
      this.oscillators.push(osc);
      this.oscillators.push(lfo);
    });

    // Periodically play a soft sweeping synth melody note in C minor pentatonic
    const melodyNotes = [261.63, 293.66, 311.13, 349.23, 392.00, 466.16, 523.25];
    const triggerMelody = () => {
      if (this.isMuted || !this.ctx || !this.ambientNode) return;
      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.004, this.ctx.currentTime + 1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4);

      // Delay/Echo effect
      delay.delayTime.value = 0.4;
      feedback.gain.value = 0.3;

      osc.connect(gain);
      gain.connect(this.ambientNode);
      
      // Delay feedback loop
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.ambientNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 5.0);
    };

    // Play initial note
    setTimeout(triggerMelody, 3000);
    // Loop melody
    const interval = window.setInterval(triggerMelody, 8000);
    this.synthIntervals.push(interval);
  }

  private stopAmbient() {
    // Fade out ambient gain
    if (this.ambientNode && this.ctx) {
      try {
        this.ambientNode.gain.setValueAtTime(this.ambientNode.gain.value, this.ctx.currentTime);
        this.ambientNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      } catch (e) {}
    }

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.oscillators = [];

      this.synthIntervals.forEach(interval => clearInterval(interval));
      this.synthIntervals = [];

      if (this.ambientNode) {
        try {
          this.ambientNode.disconnect();
        } catch (e) {}
        this.ambientNode = null;
      }
    }, 600);
  }
}

export const audio = new AudioEngine();
export default audio;
