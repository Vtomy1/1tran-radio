import React from 'react';
import { audioEngine } from '../services/audioEngine';
import { STATIONS } from '../data/stations';

interface PresetButtonsProps {
  activeSlot: number | null;
  presets: { [slot: number]: string };
  onSelectPreset: (slot: number) => void;
  onSetPreset: (slot: number) => void;
  powered: boolean;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  activeSlot,
  presets,
  onSelectPreset,
  onSetPreset,
  powered
}) => {
  const handlePush = (slot: number) => {
    if (!powered) return;
    audioEngine.playMechanicalClick('preset');
    onSelectPreset(slot);
  };

  const handleContextMenu = (e: React.MouseEvent, slot: number) => {
    e.preventDefault();
    if (!powered) return;
    audioEngine.playMechanicalClick('preset');
    onSetPreset(slot);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1816] rounded border border-[#38322a] shadow-inner">
        {[1, 2, 3, 4, 5].map(slot => {
          const stationId = presets[slot];
          const station = STATIONS.find(s => s.id === stationId);
          const isPressed = activeSlot === slot;

          return (
            <div key={slot} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handlePush(slot)}
                onContextMenu={e => handleContextMenu(e, slot)}
                title={station ? `Preset ${slot}: ${station.name} (${station.frequency} ${station.band})\nRight-click or press & hold to overwrite preset` : `Preset ${slot} (Empty)`}
                className={`relative w-8 h-9 rounded-sm flex flex-col items-center justify-between p-1 transition-all duration-100 select-none ${
                  isPressed
                    ? 'translate-y-1 bg-gradient-to-b from-[#3a342c] to-[#24201a] border border-[#594f42] shadow-inner'
                    : 'bg-gradient-to-b from-[#e3ded5] via-[#cfc7bb] to-[#b0a696] border border-[#8a8071] shadow-md hover:brightness-105 active:translate-y-0.5'
                }`}
              >
                {/* Mechanical chrome top highlight */}
                <div className={`w-full h-1 rounded-xs ${isPressed ? 'bg-[#52493d]' : 'bg-white/70'}`} />

                {/* Number numeral */}
                <span className={`text-[12px] font-mono-dial font-bold ${
                  isPressed ? 'text-[#ffdd99]' : 'text-[#2e2a24]'
                }`}>
                  {slot}
                </span>

                {/* Station Frequency Tag */}
                <span className={`text-[7px] font-mono-dial truncate w-full text-center ${
                  isPressed ? 'text-[#e0c896]' : 'text-[#595042]'
                }`}>
                  {station ? (station.band === 'AM' ? station.frequency : station.frequency.toFixed(1)) : '---'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <span className="text-[8px] font-mono-dial text-[#7a7063] mt-1 tracking-wider uppercase">
        PUSHBUTTON PRESETS (RIGHT-CLICK TO STORE)
      </span>
    </div>
  );
};
