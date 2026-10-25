import React from 'react';

interface SignalMeterProps {
  value: number; // 0 to 100
  dialLight: boolean;
  powered: boolean;
}

export const SignalMeter: React.FC<SignalMeterProps> = ({ value, dialLight, powered }) => {
  // Convert 0-100 to angle: -38deg to +38deg
  const targetAngle = powered ? -36 + (value / 100) * 72 : -42;

  return (
    <div className="relative w-36 h-24 bg-[#141210] rounded-t-lg border-2 border-[#38332c] overflow-hidden shadow-inner flex flex-col items-center justify-between p-1.5">
      {/* Warm meter backlight */}
      {dialLight && powered && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb443]/30 via-[#e28414]/15 to-transparent pointer-events-none" />
      )}

      {/* Meter Glass Reflection */}
      <div className="absolute inset-0 meter-glass pointer-events-none" />

      {/* Top Header Label */}
      <div className="z-10 flex items-center justify-between w-full px-1 text-[9px] font-mono-dial tracking-widest text-[#a89d8d] uppercase">
        <span>SIGNAL</span>
        <span className="text-[#cfa459]">TUNING</span>
        <span>VU</span>
      </div>

      {/* Curved Scale Arc & Tick Marks */}
      <div className="relative w-full h-14 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 120 60">
          {/* Background arc */}
          <path
            d="M 15 50 A 45 45 0 0 1 105 50"
            fill="none"
            stroke="#453e34"
            strokeWidth="1.5"
          />

          {/* S-Units Colored segments */}
          {/* Green / Good signal zone */}
          <path
            d="M 75 22 A 45 45 0 0 1 105 50"
            fill="none"
            stroke="#5c8a4d"
            strokeWidth="2.5"
            strokeOpacity={powered ? 0.9 : 0.3}
          />
          {/* Amber / Mid zone */}
          <path
            d="M 45 22 A 45 45 0 0 1 75 22"
            fill="none"
            stroke="#d49b38"
            strokeWidth="2.5"
            strokeOpacity={powered ? 0.8 : 0.3}
          />
          {/* Red / Low zone */}
          <path
            d="M 15 50 A 45 45 0 0 1 45 22"
            fill="none"
            stroke="#9c3b30"
            strokeWidth="2.5"
            strokeOpacity={powered ? 0.7 : 0.3}
          />

          {/* Scale Numbers */}
          <text x="20" y="46" fill="#8f8576" fontSize="6.5" fontFamily="monospace" textAnchor="middle">1</text>
          <text x="38" y="27" fill="#8f8576" fontSize="6.5" fontFamily="monospace" textAnchor="middle">2</text>
          <text x="60" y="19" fill="#d49b38" fontSize="6.5" fontFamily="monospace" textAnchor="middle">3</text>
          <text x="82" y="27" fill="#8f8576" fontSize="6.5" fontFamily="monospace" textAnchor="middle">4</text>
          <text x="100" y="46" fill="#7ba36c" fontSize="6.5" fontFamily="monospace" textAnchor="middle">5</text>
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-1 w-0.5 h-11 bg-gradient-to-t from-[#262422] via-[#e63946] to-[#ff4d4d] origin-bottom transition-transform duration-100 ease-out z-20 shadow-sm"
          style={{
            transform: `rotate(${targetAngle}deg)`
          }}
        >
          {/* Needle tip glow when active */}
          {powered && value > 50 && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute -top-1 -left-0.5 blur-[1px]" />
          )}
        </div>

        {/* Needle Pivot Brass Cap */}
        <div className="absolute bottom-0 w-3 h-3 rounded-full bg-gradient-to-tr from-[#3a2f1b] via-[#a38038] to-[#deb868] border border-[#211b0e] shadow z-30" />
      </div>

      {/* Meter Bottom Subtitle */}
      <div className="z-10 w-full flex justify-between px-2 text-[8px] font-mono-dial text-[#786e61]">
        <span>S-UNITS</span>
        <span className={powered && value > 60 ? 'text-[#7ba36c] font-semibold' : 'text-[#61594e]'}>
          {powered ? (value > 65 ? 'LOCK' : value > 25 ? 'WEAK' : 'NOISE') : 'OFF'}
        </span>
      </div>
    </div>
  );
};
