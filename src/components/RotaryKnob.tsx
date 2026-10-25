import React, { useRef, useState, useEffect } from 'react';
import { audioEngine } from '../services/audioEngine';

interface RotaryKnobProps {
  label: string;
  sublabel?: string;
  value: number; // For bounded knobs: 0 to 100.
  min?: number;
  max?: number;
  step?: number;
  onChange: (newValue: number) => void;
  size?: 'sm' | 'md' | 'lg';
  isContinuous?: boolean; // For tuning knob: spins continuously
  hasPowerSwitch?: boolean; // Volume knob clicks off at 0
  isPowered?: boolean;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  label,
  sublabel,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  size = 'md',
  isContinuous = false,
  hasPowerSwitch = false,
  isPowered = true
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(value);
  const [continuousAngle, setContinuousAngle] = useState(0);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }[size];

  // Map value to angle (-135deg to +135deg) for standard bounded knobs
  const boundedAngle = -135 + ((value - min) / (max - min)) * 270;
  const currentAngle = isContinuous ? continuousAngle : boundedAngle;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
    knobRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.clientY;
    const sensitivity = isContinuous ? 0.8 : (max - min) / 140;
    
    if (isContinuous) {
      const nextAngle = continuousAngle + deltaY * 3.5;
      setContinuousAngle(nextAngle);
      startY.current = e.clientY;
      const stepDelta = deltaY > 0 ? step : -step;
      if (Math.abs(deltaY) > 2) {
        onChange(value + stepDelta);
        audioEngine.playMechanicalClick('tuning-tick');
      }
    } else {
      const raw = startVal.current + deltaY * sensitivity;
      const clamped = Math.min(max, Math.max(min, Math.round(raw / step) * step));
      if (clamped !== value) {
        onChange(clamped);
        audioEngine.playMechanicalClick('tuning-tick');
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    knobRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    if (isContinuous) {
      setContinuousAngle(prev => prev + dir * 15);
      onChange(value + dir * step);
      audioEngine.playMechanicalClick('tuning-tick');
    } else {
      const next = Math.min(max, Math.max(min, value + dir * step * 2));
      if (next !== value) {
        onChange(next);
        audioEngine.playMechanicalClick('tuning-tick');
      }
    }
  };

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Label above */}
      <span className="text-[10px] font-mono-dial tracking-widest text-[#cfc7bc] font-semibold uppercase mb-1">
        {label}
      </span>

      {/* Rotary Knob Body */}
      <div className="relative flex items-center justify-center">
        {/* Subtle radial dial tick markings on the chassis plate */}
        {!isContinuous && (
          <div className="absolute -inset-2 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {Array.from({ length: 11 }).map((_, i) => {
                const angle = -135 + i * 27;
                const rad = (angle * Math.PI) / 180;
                const x1 = 50 + Math.sin(rad) * 44;
                const y1 = 50 - Math.cos(rad) * 44;
                const x2 = 50 + Math.sin(rad) * 48;
                const y2 = 50 - Math.cos(rad) * 48;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={i === 0 && hasPowerSwitch ? '#c92a2a' : '#574f43'}
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>
        )}

        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={`relative ${sizeClasses} rounded-full knurled-edge cursor-ns-resize shadow-2xl flex items-center justify-center transition-transform active:scale-98`}
        >
          {/* Anodized spun metal inner cap */}
          <div
            className="w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#3a352e] via-[#615a4f] to-[#26231e] border border-[#7d7465] shadow-inner flex items-center justify-center"
            style={{
              transform: `rotate(${currentAngle}deg)`
            }}
          >
            {/* Machined Indicator Notch / Line */}
            <div className="absolute top-1 w-1 h-3 rounded-full bg-[#f4ebd0] shadow-[0_0_2px_#000]" />
            {/* Center brass screw point */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#9e7d3b] border border-[#423315]" />
          </div>
        </div>
      </div>

      {/* Sublabel or Value */}
      <div className="mt-1 flex items-center gap-1 text-[9px] font-mono-dial text-[#9e9484]">
        {hasPowerSwitch && value === 0 ? (
          <span className="text-[#e63946] font-bold">POWER OFF</span>
        ) : sublabel ? (
          <span>{sublabel}</span>
        ) : (
          <span>{isContinuous ? value : `${Math.round(value)}%`}</span>
        )}
      </div>

      {/* Step buttons for effortless fine-tuning */}
      <div className="flex items-center gap-1.5 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => {
            if (isContinuous) {
              setContinuousAngle(prev => prev - 15);
              onChange(value - step);
            } else {
              onChange(Math.max(min, value - step * 5));
            }
            audioEngine.playMechanicalClick('tuning-tick');
          }}
          className="w-5 h-4 bg-[#26231f] hover:bg-[#38332d] text-[#a89d8d] text-[10px] rounded border border-[#474035] flex items-center justify-center active:bg-[#1a1815]"
          title="Decrease"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            if (isContinuous) {
              setContinuousAngle(prev => prev + 15);
              onChange(value + step);
            } else {
              onChange(Math.min(max, value + step * 5));
            }
            audioEngine.playMechanicalClick('tuning-tick');
          }}
          className="w-5 h-4 bg-[#26231f] hover:bg-[#38332d] text-[#a89d8d] text-[10px] rounded border border-[#474035] flex items-center justify-center active:bg-[#1a1815]"
          title="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
};
