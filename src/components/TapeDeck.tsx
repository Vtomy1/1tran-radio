import React, { useState, useRef, useEffect } from 'react';
import { RadioStation } from '../types/radio';
import { audioEngine } from '../services/audioEngine';
import { Play, Square, Circle, RotateCcw, Volume2, Disc3 } from 'lucide-react';

interface TapeDeckProps {
  currentStation: RadioStation | null;
  powered: boolean;
}

interface TapeItem {
  id: string;
  title: string;
  timestamp: string;
  duration: number;
}

export const TapeDeck: React.FC<TapeDeckProps> = ({ currentStation, powered }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [tapes, setTapes] = useState<TapeItem[]>([
    {
      id: 'demo-tape-1',
      title: '77 WABC Radio Broadcast Aircheck',
      timestamp: 'Nov 14, 1961',
      duration: 18
    }
  ]);
  const [activeTapeIndex, setActiveTapeIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecSeconds(prev => {
          if (prev >= 30) {
            // Stop recording at 30 seconds
            handleStop();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleRecord = () => {
    if (!powered) return;
    audioEngine.playMechanicalClick('power');
    setIsPlaying(false);
    setIsRecording(true);
    setRecSeconds(0);
  };

  const handleStop = () => {
    audioEngine.playMechanicalClick('preset');
    if (isRecording) {
      setIsRecording(false);
      const newTape: TapeItem = {
        id: `tape-${Date.now()}`,
        title: currentStation ? `${currentStation.callsign} Aircheck (${currentStation.name})` : 'Atmospheric Static Broadcast',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: recSeconds || 1
      };
      setTapes(prev => [newTape, ...prev]);
      setActiveTapeIndex(0);
    }
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (tapes.length === 0) return;
    audioEngine.playMechanicalClick('power');
    setIsRecording(false);
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, (tapes[activeTapeIndex]?.duration || 10) * 1000);
  };

  return (
    <div className="relative w-full max-w-xl bg-[#211d19] rounded-lg border-2 border-[#3d362e] p-3 shadow-xl">
      {/* Deck Header */}
      <div className="flex items-center justify-between border-b border-[#3b342b] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-[#cfa459]" />
          <span className="text-[11px] font-mono-dial font-bold tracking-wider text-[#dcd4c7] uppercase">
            SOLID STATE CASSETTE RECORDER
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono-dial text-[#8c8070]">
          <span>FERRIC TAPE TYPE I</span>
          <span aria-hidden="true">·</span>
          <span>AUTO-STOP</span>
        </div>
      </div>

      {/* Cassette Well & Spinning Spools */}
      <div className="relative h-24 bg-[#141210] rounded border border-[#2b251f] p-2 flex items-center justify-between shadow-inner overflow-hidden">
        {/* Cassette Body */}
        <div className="relative w-full h-full bg-[#302b25] rounded border border-[#4a4237] flex items-center justify-around px-6">
          {/* Left Spool */}
          <div className="relative w-12 h-12 rounded-full border-2 border-[#1c1916] bg-[#211d19] flex items-center justify-center">
            <div
              className={`w-7 h-7 rounded-full border border-[#52493d] flex items-center justify-center ${
                isRecording || isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '2.5s' }}
            >
              <div className="w-2 h-2 rounded-full bg-[#1c1916]" />
            </div>
          </div>

          {/* Cassette Center Label Window */}
          <div className="flex-1 max-w-[200px] h-14 bg-[#ede2cb] rounded border border-[#c4b395] mx-4 p-1 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center text-[8px] font-mono-dial text-[#61513e] font-bold border-b border-[#cfbe9e] pb-0.5">
              <span>SIDE A</span>
              <span>C-60</span>
            </div>
            <div className="text-[10px] font-mono-dial font-semibold text-[#292219] truncate text-center">
              {isRecording ? (
                <span className="text-red-600 animate-pulse font-bold">RECORDING IN PROGRESS...</span>
              ) : tapes[activeTapeIndex] ? (
                tapes[activeTapeIndex].title
              ) : (
                'BLANK TAPE'
              )}
            </div>
            <div className="text-[8px] font-mono-dial text-[#7a6b57] text-right">
              {isRecording ? `${recSeconds}s / 30s` : `${tapes[activeTapeIndex]?.duration || 0}s SEC`}
            </div>
          </div>

          {/* Right Spool */}
          <div className="relative w-12 h-12 rounded-full border-2 border-[#1c1916] bg-[#211d19] flex items-center justify-center">
            <div
              className={`w-7 h-7 rounded-full border border-[#52493d] flex items-center justify-center ${
                isRecording || isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '2.5s' }}
            >
              <div className="w-2 h-2 rounded-full bg-[#1c1916]" />
            </div>
          </div>
        </div>
      </div>

      {/* Transport Pushbuttons */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Record Button */}
          <button
            type="button"
            onClick={handleRecord}
            disabled={isRecording || !powered}
            className={`px-3 py-1.5 rounded text-xs font-mono-dial font-bold flex items-center gap-1 transition-all ${
              isRecording
                ? 'bg-red-700 text-white shadow-inner translate-y-0.5'
                : 'bg-[#992222] hover:bg-[#b02a2a] text-white shadow'
            } disabled:opacity-40`}
            title="Record current radio transmission"
          >
            <Circle className="w-3.5 h-3.5 fill-current" />
            <span>REC</span>
          </button>

          {/* Play Button */}
          <button
            type="button"
            onClick={handlePlay}
            disabled={isPlaying || isRecording || tapes.length === 0}
            className={`px-3 py-1.5 rounded text-xs font-mono-dial font-bold flex items-center gap-1 transition-all ${
              isPlaying
                ? 'bg-[#3b3328] text-[#ffdd99] shadow-inner translate-y-0.5'
                : 'bg-[#40382d] hover:bg-[#4f4538] text-[#f4ecd8] shadow'
            } disabled:opacity-40`}
            title="Play back tape"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY</span>
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={handleStop}
            className="px-3 py-1.5 rounded text-xs font-mono-dial font-bold bg-[#332c24] hover:bg-[#423a2f] text-[#ded4c5] flex items-center gap-1 transition-all shadow"
            title="Stop transport"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>
        </div>

        {/* Tapes Drawer Selector */}
        {tapes.length > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono-dial text-[#8c8070]">TAPE:</span>
            <select
              value={activeTapeIndex}
              onChange={e => setActiveTapeIndex(Number(e.target.value))}
              className="text-[10px] font-mono-dial bg-[#1c1815] text-[#e0d6c5] border border-[#3d3429] rounded px-2 py-1"
            >
              {tapes.map((t, idx) => (
                <option key={t.id} value={idx}>
                  #{idx + 1} {t.title.substring(0, 18)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
