import React, { useRef, useCallback } from 'react';
import { Band, RadioStation } from '../types/radio';
import { BAND_CONFIG, STATIONS } from '../data/stations';

interface TuningScaleProps {
  band: Band;
  frequency: number;
  onFrequencyChange: (newFreq: number) => void;
  dialLight: boolean;
  powered: boolean;
}

export const TuningScale: React.FC<TuningScaleProps> = ({
  band,
  frequency,
  onFrequencyChange,
  dialLight,
  powered
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const currentCfg = BAND_CONFIG[band];
  const minFreq = currentCfg.min;
  const maxFreq = currentCfg.max;

  // Calculate needle horizontal percentage (0% to 100%)
  const percentage = Math.min(100, Math.max(0, ((frequency - minFreq) / (maxFreq - minFreq)) * 100));

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current || !powered) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = x / rect.width;
    const rawFreq = minFreq + ratio * (maxFreq - minFreq);

    // Snap to band step
    const steppedFreq = Math.round(rawFreq / currentCfg.step) * currentCfg.step;
    // Format precision to avoid float issues
    const formatted = band === 'AM' ? Math.round(steppedFreq) : Number(steppedFreq.toFixed(band === 'SW' ? 3 : 1));
    onFrequencyChange(formatted);
  }, [minFreq, maxFreq, currentCfg.step, band, onFrequencyChange, powered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!powered) return;
    isDraggingRef.current = true;
    handlePointerMove(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      if (isDraggingRef.current) {
        handlePointerMove(ev.clientX);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!powered) return;
    isDraggingRef.current = true;
    handlePointerMove(e.touches[0].clientX);

    const onTouchMove = (ev: TouchEvent) => {
      if (isDraggingRef.current && ev.touches[0]) {
        handlePointerMove(ev.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // Stations in this band to draw subtle station indicator pips
  const bandStations = STATIONS.filter(s => s.band === band);

  return (
    <div className="relative w-full select-none">
      {/* Outer Vintage Bezel */}
      <div className="relative p-2 rounded-md bg-[#1d1b18] border border-[#3d3831] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
        {/* Amber Backlight Glow behind glass */}
        {dialLight && powered && (
          <div className="absolute inset-0 rounded amber-dial-glow pointer-events-none transition-opacity duration-300" />
        )}

        {/* Dial Scale Glass Plate */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative h-28 bg-[#0e0d0b] rounded border border-[#2e2a24] overflow-hidden cursor-ew-resize dial-glass"
        >
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-x-0 top-6 border-b border-[#2a2620]/60" />
          <div className="absolute inset-x-0 top-12 border-b border-[#2a2620]/60" />
          <div className="absolute inset-x-0 top-18 border-b border-[#2a2620]/60" />

          {/* Scale 1: FM Band (88 - 108 MHz) */}
          <div className={`absolute top-1 inset-x-4 flex justify-between items-center text-[10px] font-mono-dial tracking-tight transition-opacity ${
            band === 'FM' ? 'text-[#ffdd99] font-bold' : 'text-[#6e6659]'
          }`}>
            <span className="text-[9px] font-semibold text-[#cfa459] mr-2">FM</span>
            {BAND_CONFIG.FM.scaleMarks.map(mark => (
              <div key={mark} className="flex flex-col items-center">
                <span>{mark}</span>
                <div className={`w-[1px] h-2 ${band === 'FM' ? 'bg-[#ffcc66]' : 'bg-[#4a443a]'}`} />
              </div>
            ))}
            <span className="text-[8px] text-[#8c8273] ml-2">MHz</span>
          </div>

          {/* Scale 2: LOGGING SCALE (0 to 100) */}
          <div className="absolute top-10 inset-x-4 flex justify-between items-center text-[8px] font-mono-dial text-[#5a5347]">
            <span className="text-[8px] font-normal mr-2">LOG</span>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => (
              <div key={val} className="flex flex-col items-center">
                <div className="w-[1px] h-1.5 bg-[#3d372e]" />
                <span>{val}</span>
              </div>
            ))}
            <span className="text-[8px] ml-2">DIV</span>
          </div>

          {/* Scale 3: AM Band (530 - 1710 kHz) */}
          <div className={`absolute top-16 inset-x-4 flex justify-between items-center text-[10px] font-mono-dial tracking-tight transition-opacity ${
            band === 'AM' ? 'text-[#ffdd99] font-bold' : 'text-[#6e6659]'
          }`}>
            <span className="text-[9px] font-semibold text-[#cfa459] mr-2">AM</span>
            {BAND_CONFIG.AM.scaleMarks.map(mark => (
              <div key={mark} className="flex flex-col items-center">
                <div className={`w-[1px] h-2 ${band === 'AM' ? 'bg-[#ffcc66]' : 'bg-[#4a443a]'}`} />
                <span>{mark >= 1000 ? mark / 100 : mark}</span>
              </div>
            ))}
            <span className="text-[8px] text-[#8c8273] ml-2">x10 kHz</span>
          </div>

          {/* Station Frequency Pips for the active band */}
          {bandStations.map(station => {
            const pipPercent = ((station.frequency - minFreq) / (maxFreq - minFreq)) * 100;
            const isNear = Math.abs(station.frequency - frequency) < currentCfg.captureWindow;
            return (
              <div
                key={station.id}
                className="absolute top-22 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-150"
                style={{ left: `${pipPercent}%` }}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isNear && powered
                      ? 'bg-[#ff9d00] shadow-[0_0_8px_#ffaa00]'
                      : 'bg-[#4d4436]'
                  }`}
                />
                <span className={`text-[7px] font-mono-dial mt-0.5 whitespace-nowrap ${
                  isNear && powered ? 'text-[#ffdd99] font-bold' : 'text-[#544d41]'
                }`}>
                  {station.callsign.split('-')[0]}
                </span>
              </div>
            );
          })}

          {/* Red Illuminated Tuning Cursor Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none transition-all duration-75 ease-out z-20"
            style={{ left: `${percentage}%` }}
          >
            {/* Upper cursor bead */}
            <div className="absolute -top-0.5 -left-1 w-2.5 h-1.5 rounded-sm bg-[#c92a2a] border border-[#ff6666] shadow-sm" />
            {/* Red Hairline */}
            <div className={`w-0.5 h-full bg-[#e63946] ${powered && dialLight ? 'amber-needle-glow shadow-[0_0_8px_#ff4d4d]' : ''}`} />
            {/* Lower cursor bead */}
            <div className="absolute -bottom-0.5 -left-1 w-2.5 h-1.5 rounded-sm bg-[#c92a2a] border border-[#ff6666] shadow-sm" />
          </div>

          {/* Glass Specular Sheen Diagonal Line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>

        {/* Dial Scale Bottom Inscription */}
        <div className="mt-1 flex items-center justify-between text-[8px] font-mono-dial text-[#786e61] px-1">
          <span>HIGH SENSITIVITY SOLID STATE TUNER</span>
          <span className="text-[#a38c6b]">AETHERTONE CHASSIS MK-IV</span>
          <span>LINEAR DRIVE SLIDE-RULE</span>
        </div>
      </div>
    </div>
  );
};
