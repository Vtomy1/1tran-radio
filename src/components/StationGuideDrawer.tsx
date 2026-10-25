import React, { useState } from 'react';
import { RadioStation, Band } from '../types/radio';
import { STATIONS } from '../data/stations';
import { Search, Radio, Music, BookmarkCheck, ExternalLink, Plus, X } from 'lucide-react';

interface StationGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrequency: number;
  currentBand: Band;
  onTuneToStation: (station: RadioStation) => void;
  onSavePreset: (slot: number, stationId: string) => void;
  onAddCustomStation: (newStation: RadioStation) => void;
}

export const StationGuideDrawer: React.FC<StationGuideDrawerProps> = ({
  isOpen,
  onClose,
  currentFrequency,
  currentBand,
  onTuneToStation,
  onSavePreset,
  onAddCustomStation
}) => {
  const [selectedBand, setSelectedBand] = useState<'ALL' | Band>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCallsign, setCustomCallsign] = useState('');
  const [customFreq, setCustomFreq] = useState('');
  const [customBand, setCustomBand] = useState<Band>('FM');
  const [customGenre, setCustomGenre] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const filteredStations = STATIONS.filter(s => {
    const matchesBand = selectedBand === 'ALL' || s.band === selectedBand;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.era.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBand && matchesSearch;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customUrl || !customFreq) return;
    const newStation: RadioStation = {
      id: `custom-${Date.now()}`,
      name: customName,
      callsign: customCallsign || 'USER-FM',
      frequency: parseFloat(customFreq),
      band: customBand,
      genre: customGenre || 'Custom Stream',
      location: 'User Defined',
      streamUrl: customUrl,
      description: 'Custom added stream broadcast.',
      era: 'Custom'
    };
    onAddCustomStation(newStation);
    setIsAddingCustom(false);
    setCustomName('');
    setCustomUrl('');
    setCustomFreq('');
    setCustomCallsign('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container with Vintage Ephemera Paper Styling */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#f7f2e7] text-[#2c2824] rounded-lg shadow-2xl border-4 border-[#3d3326] flex flex-col overflow-hidden">
        {/* Paper Header Strip */}
        <div className="relative p-5 bg-[#eee5d3] border-b-2 border-[#d6c7ac] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d261e] text-[#f7f2e7] flex items-center justify-center font-bold font-mono-dial text-lg shadow">
              RAD
            </div>
            <div>
              <h2 className="text-xl font-bold font-display-retro tracking-tight text-[#2b241c] uppercase">
                Official Radio Dial Guide & Station Directory
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#6e6150] mt-0.5">
                <span>Verified Vintage Streams</span>
                <span aria-hidden="true">·</span>
                <span>AM / FM / Shortwave Bands</span>
                <span aria-hidden="true">·</span>
                <span>Analog Frequency Log</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5e5345] hover:text-[#1c1813] hover:bg-[#dfd3bc] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#fbf9f4] border-b border-[#ded3be] flex flex-wrap items-center justify-between gap-3">
          {/* Band Selector Tabs */}
          <div className="flex items-center gap-1 bg-[#ede4d2] p-1 rounded-md border border-[#dacbb1]">
            {(['ALL', 'FM', 'AM', 'SW'] as const).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBand(b)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  selectedBand === b
                    ? 'bg-[#2e261e] text-[#f7f2e7] shadow-sm'
                    : 'text-[#695d4d] hover:text-[#1a1714]'
                }`}
              >
                {b === 'ALL' ? 'All Bands' : b}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#8c7e6b]" />
            <input
              type="text"
              placeholder="Search genre, city, artist, decade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f4ece0] border border-[#d8cabb] rounded text-[#2c2824] placeholder-[#8f8270] focus:outline-none focus:ring-1 focus:ring-[#8c7e6b]"
            />
          </div>

          {/* Custom Stream Button */}
          <button
            type="button"
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#3d3429] hover:bg-[#2b241c] text-[#f4ece0] rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Stream</span>
          </button>
        </div>

        {/* Custom Station Form (if open) */}
        {isAddingCustom && (
          <form onSubmit={handleCreateCustom} className="p-4 bg-[#ede2cb] border-b-2 border-[#d4c3a3] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-dial uppercase font-semibold text-[#57493a]">Station Name</label>
              <input
                type="text"
                placeholder="e.g. Vintage Jazz Lounge"
                required
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-white rounded border border-[#cfbe9e] text-[#2c2824]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-dial uppercase font-semibold text-[#57493a]">Stream URL (MP3/AAC)</label>
              <input
                type="url"
                placeholder="https://example.com/stream.mp3"
                required
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-white rounded border border-[#cfbe9e] text-[#2c2824]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono-dial uppercase font-semibold text-[#57493a]">Band</label>
                <select
                  value={customBand}
                  onChange={e => setCustomBand(e.target.value as Band)}
                  className="w-full px-2.5 py-1 text-xs bg-white rounded border border-[#cfbe9e] text-[#2c2824]"
                >
                  <option value="FM">FM</option>
                  <option value="AM">AM</option>
                  <option value="SW">SW</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono-dial uppercase font-semibold text-[#57493a]">Frequency</label>
                <input
                  type="number"
                  step="any"
                  placeholder={customBand === 'AM' ? '1280' : '99.5'}
                  required
                  value={customFreq}
                  onChange={e => setCustomFreq(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-white rounded border border-[#cfbe9e] text-[#2c2824]"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2d261e] text-[#f7f2e7] text-xs font-semibold rounded hover:bg-[#1a1611] transition-colors"
              >
                Save Station
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 bg-transparent text-[#615444] text-xs hover:text-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Station List Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredStations.map(station => {
            const isCurrentlyTuned =
              station.band === currentBand &&
              Math.abs(station.frequency - currentFrequency) < 0.2;

            return (
              <div
                key={station.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCurrentlyTuned
                    ? 'bg-[#eae0cb] border-[#a89270] shadow-md ring-1 ring-[#c2a981]'
                    : 'bg-[#faf7f0] border-[#e6dbc8] hover:border-[#cfc1a7] shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Station Metadata */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold font-mono-dial rounded bg-[#2e261e] text-[#f7f2e7]">
                        {station.frequency} {station.band === 'AM' ? 'kHz' : 'MHz'}
                      </span>
                      <span className="text-xs font-mono-dial font-semibold text-[#7d6b54]">
                        [{station.callsign}]
                      </span>
                      <span className="text-xs font-semibold text-[#8a7a63]">
                        {station.location}
                      </span>
                      <span aria-hidden="true" className="text-[#a89a85]">·</span>
                      <span className="text-xs text-[#8a7a63] font-mono-dial">
                        {station.era}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#241f19] mt-1 font-display-retro">
                      {station.name}
                    </h3>

                    <p className="text-xs text-[#524738] mt-0.5 leading-relaxed">
                      {station.description}
                    </p>

                    {station.historicalCallout && (
                      <p className="text-[11px] italic text-[#786650] mt-1">
                        "{station.historicalCallout}"
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onTuneToStation(station);
                        onClose();
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-sm ${
                        isCurrentlyTuned
                          ? 'bg-[#9c382d] text-white'
                          : 'bg-[#3b3227] hover:bg-[#262018] text-[#f4ebd9]'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isCurrentlyTuned ? 'Tuned In' : 'Tune Dial'}</span>
                    </button>

                    {/* Quick Preset Assign Dropdown */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="px-2 py-1.5 text-xs font-mono-dial rounded bg-[#e8ded0] hover:bg-[#dacdbd] text-[#4d4233] border border-[#cfc1ae] transition-colors"
                        title="Assign to Preset Button"
                      >
                        P+
                      </button>
                      <div className="hidden group-hover:flex absolute right-0 bottom-full mb-1 flex-col bg-[#2e261e] text-[#f7f2e7] rounded shadow-lg border border-[#4a3f32] p-1 z-30">
                        <span className="text-[9px] font-mono-dial text-[#a39480] px-2 py-0.5">STORE TO:</span>
                        {[1, 2, 3, 4, 5].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              onSavePreset(slot, station.id);
                            }}
                            className="text-left text-xs px-3 py-1 hover:bg-[#473b2f] rounded font-mono-dial text-[#ffdd99]"
                          >
                            Preset {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper Guide Footer */}
        <div className="p-3 bg-[#eee5d3] border-t border-[#d6c7ac] text-center text-xs text-[#6e6150] font-mono-dial">
          <span>AetherTone Transistor Tuning Chart · Calibrated for 530–1710 kHz & 88–108 MHz</span>
        </div>
      </div>
    </div>
  );
};
