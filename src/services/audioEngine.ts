import { Band, RadioStation } from '../types/radio';
import { BAND_CONFIG, STATIONS } from '../data/stations';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentStreamUrl: string = '';
  private currentStation: RadioStation | null = null;
  private masterGain: GainNode | null = null;
  private staticGain: GainNode | null = null;
  private staticFilter: BiquadFilterNode | null = null;
  private whistleOsc: OscillatorNode | null = null;
  private whistleGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private toneLowShelf: BiquadFilterNode | null = null;
  private toneHighShelf: BiquadFilterNode | null = null;
  private speakerFilterHp: BiquadFilterNode | null = null;
  private speakerFilterLp: BiquadFilterNode | null = null;
  private speakerPeak: BiquadFilterNode | null = null;
  private waveshaper: WaveShaperNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isUnlocked: boolean = false;
  private isPlayingAudio: boolean = false;
  private retryTimer: number | null = null;

  // Signal & Tuning calculation
  public activeSignalStrength: number = 0; // 0 to 1
  public tunedStation: RadioStation | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.setupAudioGraph();
      this.setupAudioElement();
    } catch (e) {
      console.warn('AudioContext initialization failed or deferred:', e);
    }
  }

  public unlock() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
    }
  }

  private setupAudioElement() {
    if (this.audioEl) return;
    this.audioEl = new Audio();
    this.audioEl.crossOrigin = 'anonymous';
    this.audioEl.preload = 'none';

    this.audioEl.addEventListener('playing', () => {
      this.isPlayingAudio = true;
    });

    this.audioEl.addEventListener('waiting', () => {
      this.isPlayingAudio = false;
    });

    this.audioEl.addEventListener('error', () => {
      this.isPlayingAudio = false;
      // If primary stream encounters network error, try backup stream if available
      if (this.currentStation && this.currentStation.backupStreamUrl && this.currentStreamUrl !== this.currentStation.backupStreamUrl) {
        this.currentStreamUrl = this.currentStation.backupStreamUrl;
        if (this.audioEl) {
          this.audioEl.src = this.currentStreamUrl;
          this.audioEl.play().catch(() => {});
        }
      }
    });
  }

  private setupAudioGraph() {
    if (!this.ctx) return;

    // Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    // Tone Control Shelving
    this.toneLowShelf = this.ctx.createBiquadFilter();
    this.toneLowShelf.type = 'lowshelf';
    this.toneLowShelf.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.toneLowShelf.gain.setValueAtTime(0, this.ctx.currentTime);

    this.toneHighShelf = this.ctx.createBiquadFilter();
    this.toneHighShelf.type = 'highshelf';
    this.toneHighShelf.frequency.setValueAtTime(3200, this.ctx.currentTime);
    this.toneHighShelf.gain.setValueAtTime(0, this.ctx.currentTime);

    // 3-inch Transistor Radio Speaker Acoustic Filter Simulation
    this.speakerFilterHp = this.ctx.createBiquadFilter();
    this.speakerFilterHp.type = 'highpass';
    this.speakerFilterHp.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.speakerFilterHp.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.speakerPeak = this.ctx.createBiquadFilter();
    this.speakerPeak.type = 'peaking';
    this.speakerPeak.frequency.setValueAtTime(1900, this.ctx.currentTime);
    this.speakerPeak.gain.setValueAtTime(3.5, this.ctx.currentTime);
    this.speakerPeak.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.speakerFilterLp = this.ctx.createBiquadFilter();
    this.speakerFilterLp.type = 'lowpass';
    this.speakerFilterLp.frequency.setValueAtTime(4500, this.ctx.currentTime);
    this.speakerFilterLp.Q.setValueAtTime(0.8, this.ctx.currentTime);

    // Vintage Germanium Transistor Soft-Clipping Waveshaper
    this.waveshaper = this.ctx.createWaveShaper();
    this.waveshaper.curve = this.makeDistortionCurve(18) as Float32Array<ArrayBuffer>;
    this.waveshaper.oversample = '2x';

    // Analyser Node for Real-Time VU / Signal Needle
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    // Connect Output Chain:
    // toneLow -> toneHigh -> speakerHp -> speakerPeak -> speakerLp -> waveshaper -> masterGain -> analyser -> destination
    this.toneLowShelf.connect(this.toneHighShelf);
    this.toneHighShelf.connect(this.speakerFilterHp);
    this.speakerFilterHp.connect(this.speakerPeak);
    this.speakerPeak.connect(this.speakerFilterLp);
    this.speakerFilterLp.connect(this.waveshaper);
    this.waveshaper.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Setup Synthetic Radio Static Noise Loop
    this.setupStaticSynthesizer();
  }

  private setupStaticSynthesizer() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 4-second looping realistic atmospheric noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter algorithm
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      // Occasional crackle pops (atmospheric static bursts)
      const crackle = Math.random() > 0.997 ? (Math.random() - 0.5) * 1.8 : 0;
      output[i] = (pink * 0.14 + crackle) * 0.35;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // Static Filter (Bandpass)
    this.staticFilter = this.ctx.createBiquadFilter();
    this.staticFilter.type = 'bandpass';
    this.staticFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    this.staticFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Static Gain
    this.staticGain = this.ctx.createGain();
    this.staticGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    // Whistle Oscillator for Heterodyne detuning
    this.whistleOsc = this.ctx.createOscillator();
    this.whistleOsc.type = 'sine';
    this.whistleOsc.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.whistleGain = this.ctx.createGain();
    this.whistleGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.whistleOsc.connect(this.whistleGain);
    this.whistleGain.connect(this.staticGain);

    this.noiseSource.connect(this.staticFilter);
    this.staticFilter.connect(this.staticGain);
    this.staticGain.connect(this.masterGain);

    try {
      this.noiseSource.start(0);
      this.whistleOsc.start(0);
    } catch {
      // Ignored if already started
    }
  }

  private makeDistortionCurve(amount: number = 20): Float32Array {
    const k = amount;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Calculate tuning match, signal strength, and update audio levels
  public updateTuning(
    frequency: number,
    band: Band,
    volume: number,
    tone: number,
    speakerMode: 'transistor' | 'hifi',
    staticNoiseEnabled: boolean,
    antennaExtended: boolean,
    powered: boolean
  ) {
    if (!powered) {
      if (this.audioEl && !this.audioEl.paused) {
        this.audioEl.pause();
      }
      if (this.staticGain && this.ctx) {
        this.staticGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.whistleGain && this.ctx) {
        this.whistleGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      this.activeSignalStrength = 0;
      this.tunedStation = null;
      return;
    }

    const bandCfg = BAND_CONFIG[band];
    const stationsInBand = STATIONS.filter(s => s.band === band);

    // Find nearest station on this band
    let nearestStation: RadioStation | null = null;
    let minDiff = Infinity;

    for (const station of stationsInBand) {
      const diff = Math.abs(station.frequency - frequency);
      if (diff < minDiff) {
        minDiff = diff;
        nearestStation = station;
      }
    }

    const antennaFactor = antennaExtended ? 1.0 : 0.65;
    let signalStrength = 0;
    const captureWindow = bandCfg.captureWindow;

    if (nearestStation && minDiff <= captureWindow) {
      // Smooth bell curve around center frequency
      const normalizedDiff = minDiff / captureWindow;
      signalStrength = Math.max(0, 1 - Math.pow(normalizedDiff, 1.8)) * antennaFactor;
    }

    this.activeSignalStrength = signalStrength;
    this.tunedStation = signalStrength > 0.4 ? nearestStation : null;

    // Adjust Static Frequency & Characteristics based on Band
    if (this.staticFilter && this.ctx) {
      if (band === 'AM') {
        this.staticFilter.frequency.setTargetAtTime(1100, this.ctx.currentTime, 0.05);
        this.staticFilter.Q.setTargetAtTime(1.8, this.ctx.currentTime, 0.05);
      } else if (band === 'SW') {
        this.staticFilter.frequency.setTargetAtTime(1800, this.ctx.currentTime, 0.05);
        this.staticFilter.Q.setTargetAtTime(2.4, this.ctx.currentTime, 0.05);
      } else {
        // FM
        this.staticFilter.frequency.setTargetAtTime(3200, this.ctx.currentTime, 0.05);
        this.staticFilter.Q.setTargetAtTime(0.8, this.ctx.currentTime, 0.05);
      }
    }

    // Master volume scalar (0 to 1)
    const volScalar = Math.pow(volume / 100, 1.5);

    // Static Noise Level: inversely proportional to signal strength
    if (this.staticGain && this.ctx) {
      if (!staticNoiseEnabled) {
        this.staticGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      } else {
        // High static between stations, quiet when locked into strong signal
        const staticLevel = Math.max(0.01, 1 - signalStrength * 0.96) * 0.28 * volScalar;
        this.staticGain.gain.setTargetAtTime(staticLevel, this.ctx.currentTime, 0.05);
      }
    }

    // Heterodyne Whistle (beat note when slightly off-center)
    if (this.whistleGain && this.whistleOsc && this.ctx) {
      if (signalStrength > 0.1 && signalStrength < 0.85 && staticNoiseEnabled) {
        const beatFreq = 400 + minDiff * (band === 'AM' ? 80 : 3000);
        this.whistleOsc.frequency.setTargetAtTime(Math.min(4000, Math.max(250, beatFreq)), this.ctx.currentTime, 0.05);
        const whistleVolume = Math.sin(signalStrength * Math.PI) * 0.06 * volScalar;
        this.whistleGain.gain.setTargetAtTime(whistleVolume, this.ctx.currentTime, 0.05);
      } else {
        this.whistleGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    }

    // Tone shaping: low/high shelf
    if (this.toneLowShelf && this.toneHighShelf && this.ctx) {
      // tone: 0 (warm bass) to 100 (bright treble)
      const bassGain = (50 - tone) * 0.2; // +10dB at 0, -10dB at 100
      const trebleGain = (tone - 50) * 0.2; // -10dB at 0, +10dB at 100
      this.toneLowShelf.gain.setTargetAtTime(bassGain, this.ctx.currentTime, 0.05);
      this.toneHighShelf.gain.setTargetAtTime(trebleGain, this.ctx.currentTime, 0.05);
    }

    // Speaker Acoustic Simulation
    if (this.speakerFilterHp && this.speakerFilterLp && this.speakerPeak && this.ctx) {
      if (speakerMode === 'transistor') {
        this.speakerFilterHp.frequency.setTargetAtTime(360, this.ctx.currentTime, 0.05);
        this.speakerFilterLp.frequency.setTargetAtTime(4200, this.ctx.currentTime, 0.05);
        this.speakerPeak.gain.setTargetAtTime(4.0, this.ctx.currentTime, 0.05);
      } else {
        // Hi-Fi Line Out
        this.speakerFilterHp.frequency.setTargetAtTime(40, this.ctx.currentTime, 0.05);
        this.speakerFilterLp.frequency.setTargetAtTime(18000, this.ctx.currentTime, 0.05);
        this.speakerPeak.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    }

    // Manage Stream Audio Element
    if (this.audioEl) {
      if (signalStrength > 0.35 && nearestStation) {
        // Update stream source if different station
        if (this.currentStreamUrl !== nearestStation.streamUrl) {
          this.currentStation = nearestStation;
          this.currentStreamUrl = nearestStation.streamUrl;
          this.audioEl.src = this.currentStreamUrl;
          this.audioEl.load();
          this.audioEl.play().catch(err => {
            console.log('Stream play deferred or blocked until user gesture:', err);
          });
        } else if (this.audioEl.paused) {
          this.audioEl.play().catch(() => {});
        }

        // Adjust stream audio volume based on signal strength & master volume
        const streamVolume = Math.min(1.0, Math.max(0, signalStrength * volScalar));
        this.audioEl.volume = streamVolume;
      } else {
        // Detuned completely away from station
        this.audioEl.volume = 0;
        if (signalStrength === 0 && !this.audioEl.paused) {
          // Pause stream after a short delay to conserve bandwidth
          if (!this.retryTimer) {
            this.retryTimer = window.setTimeout(() => {
              if (this.activeSignalStrength === 0 && this.audioEl) {
                this.audioEl.pause();
              }
              this.retryTimer = null;
            }, 1200);
          }
        }
      }
    }
  }

  // Synthesize realistic tactile hardware sounds
  public playMechanicalClick(type: 'power' | 'band' | 'preset' | 'tuning-tick' | 'antenna') {
    if (!this.ctx) return;
    this.unlock();

    try {
      const now = this.ctx.currentTime;
      if (type === 'tuning-tick') {
        // Micro tooth tick
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.02);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === 'band' || type === 'power') {
        // Heavy metallic toggle / rocker snap
        const noise = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
        }
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(type === 'power' ? 650 : 920, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noiseNode.start(now);
      } else if (type === 'preset') {
        // Mechanical pushbutton spring clack
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'antenna') {
        // Metallic friction click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.linearRampToValueAtTime(1800, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio fallback
    }
  }

  // Get dynamic Signal Needle deflection (0 to 100) combining RF signal strength + stream audio punch
  public getSignalMeterReading(): number {
    if (!this.analyser) {
      return this.activeSignalStrength * 85;
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    const rms = sum / data.length / 255;
    const audioJitter = this.isPlayingAudio ? rms * 20 : 0;
    return Math.min(100, Math.max(0, this.activeSignalStrength * 80 + audioJitter));
  }
}

export const audioEngine = new AudioEngine();
