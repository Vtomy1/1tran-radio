import React, { useState, useEffect, useRef } from 'react';
import { Band, RadioStation } from '../types/radio';
import { BAND_CONFIG, STATIONS, DEFAULT_PRESETS } from '../data/stations';
import { audioEngine } from '../services/audioEngine';
import { SignalMeter } from './SignalMeter';
import { TuningScale } from './TuningScale';
import { RotaryKnob } from './RotaryKnob';
import { Antenna } from './Antenna';
import { PresetButtons } from './PresetButtons';
import { StationGuideDrawer } from './StationGuideDrawer';
import { TapeDeck } from './TapeDeck';
import { BookOpen, Radio, Sparkles, Volume2, ShieldAlert, Compass } from 'lucide-react';

export const RadioChassis: React.FC = () => {
  // Radio State
  const [powered, setPowered] = useState(true);
  const [band, setBand] = useState<Band>('FM');
  const [frequency, setFrequency] = useState<number>(BAND_CONFIG.FM.defaultFreq);
  const [volume, setVolume] = useState<number>(65);
  const [tone, setTone] = useState<number>(55);
  const [dialLight, setDialLight] = useState<boolean>(true);
  const [speakerMode, setSpeakerMode] = useState<'transistor' | 'hifi'>('transistor');
  const [staticNoiseEnabled, setStaticNoiseEnabled] = useState<boolean>(true);
  const [antennaExtended, setAntennaExtended] = useState<boolean>(true);
  const [presets, setPresets] = useState<{ [slot: number]: string }>(DEFAULT_PRESETS);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  
  // UI Panels
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showTapeDeck, setShowTapeDeck] = useState(false);
  const [meterValue, setMeterValue] = useState(0);

  // Active Station Lock & Animation
  const [activeStation, setActiveStation] = useState<RadioStation | null>(null);

  // Meter Animation Loop
  useEffect(() => {
    let animId: number;
    const updateMeter = () => {
      if (powered) {
        const val = audioEngine.getSignalMeterReading();
        setMeterValue(val);
      } else {
        setMeterValue(0);
      }
      animId = requestAnimationFrame(updateMeter);
    };
    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [powered]);

  // Update Audio Engine on any state change
  useEffect(() => {
    audioEngine.updateTuning(
      frequency,
      band,
      powered ? volume : 0,
      tone,
      speakerMode,
      staticNoiseEnabled,
      antennaExtended,
      powered
    );
    setActiveStation(audioEngine.tunedStation);
  }, [frequency, band, volume, tone, speakerMode, staticNoiseEnabled, antennaExtended, powered]);

  // Handle Band Change
  const handleBandChange = (newBand: Band) => {
    if (newBand === band) return;
    audioEngine.playMechanicalClick('band');
    setBand(newBand);
    setFrequency(BAND_CONFIG[newBand].defaultFreq);
    setActivePreset(null);
  };

  // Handle Power Toggle
  const handlePowerToggle = () => {
    audioEngine.playMechanicalClick('power');
    setPowered(prev => !prev);
  };

  // Preset Selection
  const handleSelectPreset = (slot: number) => {
    const stationId = presets[slot];
    if (!stationId) return;
    const station = STATIONS.find(s => s.id === stationId);
    if (!station) return;

    setActivePreset(slot);
    setBand(station.band);
    setFrequency(station.frequency);
  };

  const handleSetPreset = (slot: number) => {
    if (!activeStation) return;
    setPresets(prev => ({
      ...prev,
      [slot]: activeStation.id
    }));
    setActivePreset(slot);
  };

  // Auto Scan / Seek Next Station
  const handleScanNext = () => {
    if (!powered) return;
    audioEngine.playMechanicalClick('preset');
    const bandStations = STATIONS.filter(s => s.band === band).sort((a, b) => a.frequency - b.frequency);
    if (bandStations.length === 0) return;

    const nextStation = bandStations.find(s => s.frequency > frequency + 0.1) || bandStations[0];
    if (nextStation) {
      setFrequency(nextStation.frequency);
    }
  };

  // Tune to station from guide
  const handleTuneToStation = (station: RadioStation) => {
    if (!powered) setPowered(true);
    setBand(station.band);
    setFrequency(station.frequency);
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
      {/* Retractable Antenna */}
      <div className="w-full flex justify-start pl-8 -mb-3 z-30">
        <Antenna
          isExtended={antennaExtended}
          onToggle={() => setAntennaExtended(prev => !prev)}
        />
      </div>

      {/* Chrome Top Carrying Handle */}
      <div className="w-[85%] h-7 -mb-2 z-20 flex justify-between items-end px-6 pointer-events-none">
        <div className="w-4 h-5 rounded-t bg-gradient-to-r from-[#999] via-[#fff] to-[#555] border-t border-[#333] shadow" />
        <div className="flex-1 h-3.5 bg-gradient-to-b from-[#eee] via-[#bbb] to-[#777] rounded-t-sm shadow-md border-t border-white flex items-center justify-center">
          <div className="w-48 h-2 bg-[#1c1815] rounded-full opacity-80" />
        </div>
        <div className="w-4 h-5 rounded-t bg-gradient-to-r from-[#999] via-[#fff] to-[#555] border-t border-[#333] shadow" />
      </div>

      {/* Main Transistor Radio Body Enclosure */}
      <div className="relative w-full rounded-2xl bg-[#2b241e] p-3 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-4 border-[#3a3229] transition-all">
        {/* Outer Walnut Wood & Chrome Rim Trim */}
        <div className="relative rounded-xl bg-gradient-to-b from-[#211b15] via-[#2c241d] to-[#18130f] p-3 sm:p-4 border border-[#4d4233] shadow-inner">
          {/* Top Panel: Brand Emblem, S-Meter & Tuning Slide-Rule Dial */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Left Column: Galvanometer Signal Meter & Brand Plate */}
            <div className="md:col-span-4 flex flex-col items-center justify-between h-full bg-[#171411] p-3 rounded-lg border border-[#383025] shadow-inner">
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono-dial tracking-widest text-[#cfc7bc] font-bold">
                  AETHERTONE
                </span>
                <span className="text-[8px] font-mono-dial text-[#cfa459] border border-[#524430] px-1 rounded">
                  MODEL 900
                </span>
              </div>

              {/* Galvanometer Meter */}
              <SignalMeter
                value={meterValue}
                dialLight={dialLight}
                powered={powered}
              />

              {/* Band Status LED / Dial */}
              <div className="w-full mt-2 flex items-center justify-between text-[9px] font-mono-dial px-1">
                <span className="text-[#8c8070]">BAND LOCKED:</span>
                <span className="text-[#ffcc66] font-bold">{band}</span>
              </div>
            </div>

            {/* Right Column: Large Slide-Rule Tuning Scale */}
            <div className="md:col-span-8 flex flex-col justify-between h-full">
              <TuningScale
                band={band}
                frequency={frequency}
                onFrequencyChange={newFreq => {
                  setFrequency(newFreq);
                  setActivePreset(null);
                }}
                dialLight={dialLight}
                powered={powered}
              />

              {/* Pushbutton Presets Bar */}
              <div className="mt-2 w-full flex justify-center">
                <PresetButtons
                  activeSlot={activePreset}
                  presets={presets}
                  onSelectPreset={handleSelectPreset}
                  onSetPreset={handleSetPreset}
                  powered={powered}
                />
              </div>
            </div>
          </div>

          {/* Middle Decorative Brushed Aluminum Separator Trim */}
          <div className="my-3 sm:my-4 h-1.5 w-full bg-brushed-metal rounded shadow-sm" />

          {/* Lower Deck: Speaker Grille (Left) & Tactile Knobs / Switches (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left: Vintage Perforated Circular Speaker Grille */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#181512] rounded-xl border border-[#362e24] shadow-inner relative overflow-hidden">
              {/* Speaker Cloth / Perforated Grille */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full speaker-grille flex items-center justify-center border-4 border-[#332a21] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]">
                {/* Central Brushed Brass Emblem Badge */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3d3119] via-[#8c6f34] to-[#deb868] border-2 border-[#52411e] shadow-lg flex flex-col items-center justify-center text-center p-1 select-none">
                  <span className="text-[9px] font-mono-dial font-bold tracking-widest text-[#211a0c] uppercase">
                    AETHER
                  </span>
                  <div className="w-8 h-[1px] bg-[#211a0c] my-0.5" />
                  <span className="text-[7px] font-mono-dial font-semibold text-[#3b2e15] leading-tight">
                    9 TRANSISTOR<br />SOLID STATE
                  </span>
                </div>
              </div>

              {/* Speaker & Acoustic Mode Switch Below */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-mono-dial text-[#8c8070]">
                  <span>SPEAKER:</span>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playMechanicalClick('preset');
                      setSpeakerMode(prev => (prev === 'transistor' ? 'hifi' : 'transistor'));
                    }}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      speakerMode === 'transistor'
                        ? 'bg-[#42372a] text-[#ffdd99] border-[#6b583f]'
                        : 'bg-[#241f1a] text-[#9c8e7c] border-[#383025]'
                    }`}
                  >
                    {speakerMode === 'transistor' ? '3" TRANSISTOR WARMTH' : 'HI-FI DIRECT'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Rotary Knobs & Mechanical Toggle Switches */}
            <div className="md:col-span-7 flex flex-col justify-between bg-[#1a1713] p-4 rounded-xl border border-[#383025] shadow-inner">
              {/* Active Station Identity Card HUD */}
              <div className="mb-3 p-2.5 rounded bg-[#120f0d] border border-[#2e261d] flex items-center justify-between">
                <div className="flex-1 mr-2 truncate">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      powered && activeStation ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-[#3b3226]'
                    }`} />
                    <span className="text-xs font-mono-dial font-bold text-[#f7ecd5] truncate">
                      {powered
                        ? activeStation
                          ? `${activeStation.callsign} · ${activeStation.name}`
                          : 'INTERSTATION AIRWAVES'
                        : 'RADIO DISCONNECTED'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9e907d] truncate mt-0.5">
                    {powered && activeStation
                      ? `${activeStation.genre} · ${activeStation.era} · ${activeStation.location}`
                      : powered
                      ? 'Rotate the large Tuning knob to lock onto a broadcast frequency'
                      : 'Switch Volume Knob to Power On'}
                  </div>
                </div>

                {/* Quick Scan Seek Button */}
                <button
                  type="button"
                  onClick={handleScanNext}
                  disabled={!powered}
                  className="px-2.5 py-1.5 text-xs font-mono-dial font-semibold bg-[#2e261e] hover:bg-[#3d3227] disabled:opacity-30 text-[#f5ebd8] rounded border border-[#4a3f31] flex items-center gap-1 transition-colors whitespace-nowrap shadow-sm"
                  title="Scan / Seek Next Radio Station"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>SEEK</span>
                </button>
              </div>

              {/* Heavy Rotary Knobs Row */}
              <div className="grid grid-cols-3 gap-2 py-1 items-center justify-items-center">
                {/* 1. Volume & Power Switch Knob */}
                <RotaryKnob
                  label="VOL / POWER"
                  value={powered ? volume : 0}
                  min={0}
                  max={100}
                  step={2}
                  onChange={newVol => {
                    if (newVol === 0) {
                      setPowered(false);
                    } else {
                      if (!powered) setPowered(true);
                      setVolume(newVol);
                    }
                  }}
                  size="md"
                  hasPowerSwitch={true}
                  isPowered={powered}
                />

                {/* 2. Tone Control Knob */}
                <RotaryKnob
                  label="TONE"
                  sublabel={tone > 55 ? 'TREBLE' : tone < 45 ? 'BASS' : 'BALANCED'}
                  value={tone}
                  min={0}
                  max={100}
                  step={5}
                  onChange={setTone}
                  size="md"
                  isPowered={powered}
                />

                {/* 3. Big Milled Tuning Knob */}
                <RotaryKnob
                  label="TUNING"
                  sublabel={`${frequency} ${band === 'AM' ? 'kHz' : 'MHz'}`}
                  value={frequency}
                  min={BAND_CONFIG[band].min}
                  max={BAND_CONFIG[band].max}
                  step={BAND_CONFIG[band].step}
                  onChange={newFreq => {
                    const clamped = Math.max(
                      BAND_CONFIG[band].min,
                      Math.min(BAND_CONFIG[band].max, newFreq)
                    );
                    const formatted = band === 'AM' ? Math.round(clamped) : Number(clamped.toFixed(band === 'SW' ? 3 : 1));
                    setFrequency(formatted);
                    setActivePreset(null);
                  }}
                  size="lg"
                  isContinuous={true}
                  isPowered={powered}
                />
              </div>

              {/* Hardware Rocker / Toggle Switches Row */}
              <div className="mt-4 pt-3 border-t border-[#2e261d] flex flex-wrap items-center justify-between gap-2">
                {/* Band Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-dial tracking-widest text-[#a89d8d] uppercase font-bold">
                    BAND:
                  </span>
                  <div className="flex items-center bg-[#120f0d] p-0.5 rounded border border-[#3b3227]">
                    {(['AM', 'FM', 'SW'] as Band[]).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleBandChange(b)}
                        className={`px-2.5 py-1 text-xs font-mono-dial font-bold rounded transition-all ${
                          band === b
                            ? 'bg-[#cfc7bc] text-[#1c1813] shadow-md'
                            : 'text-[#7a6f60] hover:text-[#d4c9b8]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dial Lamp Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-dial text-[#8c8070] uppercase">
                    DIAL LIGHT:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playMechanicalClick('preset');
                      setDialLight(prev => !prev);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono-dial rounded border transition-colors ${
                      dialLight
                        ? 'bg-[#e5a039] text-[#1f1608] font-bold border-[#ffbf66]'
                        : 'bg-[#211b15] text-[#6b6051] border-[#382f25]'
                    }`}
                  >
                    {dialLight ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Static Noise Squelch Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-dial text-[#8c8070] uppercase">
                    STATIC:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playMechanicalClick('preset');
                      setStaticNoiseEnabled(prev => !prev);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono-dial rounded border transition-colors ${
                      staticNoiseEnabled
                        ? 'bg-[#3b3328] text-[#ffdd99] font-bold border-[#61523f]'
                        : 'bg-[#211b15] text-[#6b6051] border-[#382f25]'
                    }`}
                  >
                    {staticNoiseEnabled ? 'ANALOG' : 'MUTED'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chassis Bottom Feet Pads */}
        <div className="flex justify-between px-8 -mb-5 mt-1">
          <div className="w-8 h-2.5 bg-[#17130f] rounded-b border-b border-[#3b3226]" />
          <div className="w-8 h-2.5 bg-[#17130f] rounded-b border-b border-[#3b3226]" />
        </div>
      </div>

      {/* Auxiliary Companion Controls: Station Guide & Tape Recorder Drawer */}
      <div className="w-full mt-6 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          {/* Station Guide Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-4 py-2 bg-[#2d251d] hover:bg-[#3d3227] text-[#f4ecd8] rounded-lg border border-[#4d4032] text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-[#cfa459]" />
            <span>Open Dial Guide & Station Directory</span>
          </button>

          {/* Cassette Deck Toggle */}
          <button
            type="button"
            onClick={() => setShowTapeDeck(prev => !prev)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              showTapeDeck
                ? 'bg-[#403426] text-[#ffdd99] border-[#6e5a42]'
                : 'bg-[#211c16] hover:bg-[#2e261f] text-[#cfc5b4] border-[#3d3328]'
            }`}
          >
            <Radio className="w-4 h-4 text-[#cfa459]" />
            <span>{showTapeDeck ? 'Hide Cassette Deck' : 'Attach Cassette Deck'}</span>
          </button>
        </div>

        <div className="text-[11px] font-mono-dial text-[#8a7e6f]">
          Tip: Click & drag anywhere on the scale or rotary knobs to tune
        </div>
      </div>

      {/* Optional Attached Cassette Deck Companion */}
      {showTapeDeck && (
        <div className="w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <TapeDeck
            currentStation={activeStation}
            powered={powered}
          />
        </div>
      )}

      {/* Station Guide Ephemera Drawer */}
      <StationGuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentFrequency={frequency}
        currentBand={band}
        onTuneToStation={handleTuneToStation}
        onSavePreset={(slot, stationId) => {
          setPresets(prev => ({ ...prev, [slot]: stationId }));
        }}
        onAddCustomStation={newStation => {
          STATIONS.push(newStation);
          handleTuneToStation(newStation);
        }}
      />
    </div>
  );
};
