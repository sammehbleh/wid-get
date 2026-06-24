// Procedurally generated ambient soundscapes via the Web Audio API.
// There are no licensed audio files bundled here — each category below is
// synthesized in-browser (filtered noise for textures like rain/cafe/night,
// generative chord pads for lofi/piano) so playback has no external asset
// or licensing dependency.
export const SOUND_CATEGORIES = [
  { id: "lofi", label: "Lofi Playlist" },
  { id: "rain", label: "Rain Sounds" },
  { id: "nature", label: "Nature Sounds" },
  { id: "whitenoise", label: "White Noise" },
  { id: "cafe", label: "Café Ambience" },
  { id: "piano", label: "Piano Music" },
  { id: "night", label: "Night Ambience" },
];

const CHORDS = [
  [261.63, 329.63, 392.0], // C major
  [220.0, 277.18, 329.63], // A minor
  [196.0, 246.94, 293.66], // G major (ish)
  [174.61, 220.0, 261.63], // F major
];

class AmbientEngine {
  ctx = null;
  master = null;
  analyser = null;
  nodes = [];
  timers = [];
  currentId = null;

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  getAnalyser() {
    this.ensureContext();
    return this.analyser;
  }

  setVolume(v) {
    if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  noiseBuffer(ctx, seconds = 3) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  noiseSource(ctx) {
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    src.loop = true;
    return src;
  }

  stop() {
    this.nodes.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        /* already stopped */
      }
    });
    this.timers.forEach(clearInterval);
    this.nodes = [];
    this.timers = [];
    this.currentId = null;
  }

  scheduleChordPad(ctx, { detune = 0, gain = 0.05, interval = 4000 } = {}) {
    const play = () => {
      const chord = CHORDS[Math.floor(Math.random() * CHORDS.length)];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq + detune;
        const g = ctx.createGain();
        g.gain.value = 0;
        osc.connect(g).connect(this.master);
        const now = ctx.currentTime;
        g.gain.linearRampToValueAtTime(gain, now + 1.5);
        g.gain.linearRampToValueAtTime(0, now + interval / 1000 - 0.5);
        osc.start(now);
        osc.stop(now + interval / 1000);
        this.nodes.push(osc, g);
      });
    };
    play();
    this.timers.push(setInterval(play, interval));
  }

  scheduleChirps(ctx, { minDelay = 2000, maxDelay = 6000, freqRange = [1800, 3200], gain = 0.04 } = {}) {
    const tick = () => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freqRange[0] + Math.random() * (freqRange[1] - freqRange[0]);
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(this.master);
      const now = ctx.currentTime;
      g.gain.linearRampToValueAtTime(gain, now + 0.05);
      g.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.35);
      this.nodes.push(osc, g);
      const next = minDelay + Math.random() * (maxDelay - minDelay);
      const id = setTimeout(tick, next);
      this.timers.push(id);
    };
    tick();
  }

  play(categoryId) {
    const ctx = this.ensureContext();
    this.stop();
    this.currentId = categoryId;

    const baseGain = this.ctx.createGain();
    baseGain.gain.value = 1;

    switch (categoryId) {
      case "whitenoise": {
        const src = this.noiseSource(ctx);
        const g = ctx.createGain();
        g.gain.value = 0.18;
        src.connect(g).connect(this.master);
        src.start();
        this.nodes.push(src, g);
        break;
      }
      case "rain": {
        const src = this.noiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1200;
        const g = ctx.createGain();
        g.gain.value = 0.22;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.05;
        lfo.connect(lfoGain).connect(g.gain);
        src.connect(filter).connect(g).connect(this.master);
        src.start();
        lfo.start();
        this.nodes.push(src, filter, g, lfo, lfoGain);
        break;
      }
      case "nature": {
        const src = this.noiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 900;
        const g = ctx.createGain();
        g.gain.value = 0.1;
        src.connect(filter).connect(g).connect(this.master);
        src.start();
        this.nodes.push(src, filter, g);
        this.scheduleChirps(ctx);
        break;
      }
      case "cafe": {
        const src = this.noiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 500;
        filter.Q.value = 0.6;
        const g = ctx.createGain();
        g.gain.value = 0.16;
        src.connect(filter).connect(g).connect(this.master);
        src.start();
        this.nodes.push(src, filter, g);
        break;
      }
      case "night": {
        const src = this.noiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 300;
        const g = ctx.createGain();
        g.gain.value = 0.14;
        src.connect(filter).connect(g).connect(this.master);
        src.start();
        this.nodes.push(src, filter, g);
        this.scheduleChirps(ctx, { minDelay: 4000, maxDelay: 9000, freqRange: [2600, 3400], gain: 0.025 });
        break;
      }
      case "piano": {
        this.scheduleChordPad(ctx, { gain: 0.05, interval: 5000 });
        break;
      }
      case "lofi":
      default: {
        const src = this.noiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 4000;
        const g = ctx.createGain();
        g.gain.value = 0.025;
        src.connect(filter).connect(g).connect(this.master);
        src.start();
        this.nodes.push(src, filter, g);
        this.scheduleChordPad(ctx, { detune: -4, gain: 0.045, interval: 6000 });
        break;
      }
    }
  }
}

export const ambientEngine = new AmbientEngine();
