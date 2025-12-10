export class AudioService {
  private ctx: AudioContext | null = null;
  // Store all active nodes for the ambience to stop them cleanly
  private ambienceNodes: AudioNode[] = [];
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public async initialize() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    this.startAmbience();
  }

  public startAmbience() {
    if (this.ambienceNodes.length > 0 || this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.2; // Overall volume
    masterGain.connect(ctx.destination);
    this.ambienceNodes.push(masterGain);

    // Layer 1: Deep Drone (Sawtooth + Lowpass)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 45; // Low F#

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 120; // Dark muffled sound

    // LFO to modulate filter (Breathing effect)
    const lfo1 = ctx.createOscillator();
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.15; // Slow breath
    const lfoGain1 = ctx.createGain();
    lfoGain1.gain.value = 50; // Modulate cutoff by +/- 50Hz

    lfo1.connect(lfoGain1);
    lfoGain1.connect(filter1.frequency);
    osc1.connect(filter1);
    filter1.connect(masterGain);

    osc1.start(t);
    lfo1.start(t);

    this.ambienceNodes.push(osc1, filter1, lfo1, lfoGain1);

    // Layer 2: Unsettling Texture (Detuned Sine)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 45.5; // Slight beat frequency against 45Hz
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.4;
    
    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);
    osc2.start(t);

    this.ambienceNodes.push(osc2, osc2Gain);

    // Layer 3: Ethereal Highs (filtered Triangle)
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 90; // Octave up
    const filter3 = ctx.createBiquadFilter();
    filter3.type = 'lowpass';
    filter3.frequency.value = 200;
    
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.1; // Subtle

    osc3.connect(filter3);
    filter3.connect(osc3Gain);
    osc3Gain.connect(masterGain);
    osc3.start(t);

    this.ambienceNodes.push(osc3, filter3, osc3Gain);
  }

  public stopAmbience() {
    this.ambienceNodes.forEach(node => {
        if (node instanceof OscillatorNode) {
            try { node.stop(); } catch (e) {}
        }
        node.disconnect();
    });
    this.ambienceNodes = [];
  }

  public playSummonSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Rising energy sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 1);
    gain.gain.linearRampToValueAtTime(0, t + 2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 2);
  }

  public playRevealSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    // A mystical chord
    const freqs = [220, 277.18, 329.63, 440]; // A major ish
    
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = f;
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1 - (i * 0.02), t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(t);
      osc.stop(t + 4);
    });
  }

  public playResetSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Falling pitch (suction effect)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.5);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    // Filter to make it sound like wind
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }
}

export const audioService = new AudioService();
