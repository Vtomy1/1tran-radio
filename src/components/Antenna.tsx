import React from 'react';
import { audioEngine } from '../services/audioEngine';

interface AntennaProps {
  isExtended: boolean;
  onToggle: () => void;
}

export const Antenna: React.FC<AntennaProps> = ({ isExtended, onToggle }) => {
  const handleClick = () => {
    audioEngine.playMechanicalClick('antenna');
    onToggle();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Chrome Base Pivot Mount */}
      <div className="relative w-6 h-4 bg-gradient-to-r from-[#4d4841] via-[#e6e1d8] to-[#615a51] rounded-t border-t border-[#8f8577] shadow cursor-pointer z-10" />

      {/* Telescoping Antenna Rods */}
      <div
        onClick={handleClick}
        className="cursor-pointer group flex flex-col items-center select-none"
        title={isExtended ? "Click to retract antenna" : "Click to extend telescopic antenna"}
      >
        {/* Antenna Top Ball Tip */}
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#999] via-[#fff] to-[#555] border border-[#333] shadow-md group-hover:scale-110 transition-transform -mb-0.5 z-20" />

        {/* Segment 1 (Top / Thinnest) */}
        <div
          className="w-1 bg-gradient-to-r from-[#888] via-[#eee] to-[#999] border-x border-[#555] transition-all duration-300 ease-out origin-bottom"
          style={{ height: isExtended ? '42px' : '8px' }}
        />

        {/* Segment 2 */}
        <div
          className="w-1.5 bg-gradient-to-r from-[#777] via-[#ddd] to-[#888] border-x border-[#444] transition-all duration-300 ease-out origin-bottom"
          style={{ height: isExtended ? '48px' : '10px' }}
        />

        {/* Segment 3 */}
        <div
          className="w-2 bg-gradient-to-r from-[#666] via-[#ccc] to-[#777] border-x border-[#333] transition-all duration-300 ease-out origin-bottom"
          style={{ height: isExtended ? '54px' : '12px' }}
        />

        {/* Segment 4 (Bottom / Thickest) */}
        <div
          className="w-2.5 bg-gradient-to-r from-[#555] via-[#bbb] to-[#666] border-x border-[#222] transition-all duration-300 ease-out origin-bottom"
          style={{ height: isExtended ? '60px' : '14px' }}
        />
      </div>

      {/* Subtle indicator tag */}
      <button
        type="button"
        onClick={handleClick}
        className="mt-1 px-1.5 py-0.5 text-[8px] font-mono-dial rounded bg-[#24211d] hover:bg-[#332e28] text-[#c9bfae] border border-[#423a31] transition-colors whitespace-nowrap shadow-sm"
      >
        {isExtended ? 'ANT: EXTENDED' : 'ANT: RETRACTED'}
      </button>
    </div>
  );
};
