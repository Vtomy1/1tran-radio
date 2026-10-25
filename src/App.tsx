import React, { useState } from 'react';
import { RadioChassis } from './components/RadioChassis';
import { StationGuideDrawer } from './components/StationGuideDrawer';
import { RadioStation } from './types/radio';
import { STATIONS, BAND_CONFIG } from './data/stations';
import { Radio, Volume2, Sparkles, BookOpen, Music, Info, Disc } from 'lucide-react';

export default function App() {
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'am' | 'fm' | 'sw'>('all');

  return (
    <div className="min-h-screen bg-[#100e0c] text-[#e8e2d8] flex flex-col selection:bg-[#cfa459] selection:text-black">
      {/* Top Bar adhering strictly to Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#161310]/95 backdrop-blur-md border-b border-[#2b241c] px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <a href="#" className="text-base font-bold tracking-tight text-[#f4ecd8] font-display-retro whitespace-nowrap shrink-0 hover:text-[#ffdd99] transition-colors">
          AetherTone Radio
        </a>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#a69986]">
          <a href="#tuner" className="hover:text-[#f4ecd8] transition-colors whitespace-nowrap shrink-0">
            Transistor Receiver
          </a>
          <a href="#featured" className="hover:text-[#f4ecd8] transition-colors whitespace-nowrap shrink-0">
            Station Airwaves
          </a>
          <a href="#history" className="hover:text-[#f4ecd8] transition-colors whitespace-nowrap shrink-0">
            Solid State History
          </a>
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="hover:text-[#f4ecd8] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Dial Guide
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-[#1c1813] bg-[#deb868] hover:bg-[#ebd08c] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Station Directory</span>
          </button>
        </div>
      </header>

      {/* Main Experience Hero: Cozy 1960s Mid-Century Tabletop Scene */}
      <main className="flex-1 flex flex-col items-center">
        {/* Tabletop Atmosphere Hero Container */}
        <section
          id="tuner"
          className="relative w-full py-8 sm:py-12 px-3 sm:px-6 flex flex-col items-center justify-center overflow-hidden border-b border-[#29221a]"
          style={{
            backgroundImage: `radial-gradient(ellipse 90% 80% at 50% 30%, rgba(28, 22, 17, 0.4) 0%, rgba(13, 11, 9, 0.95) 100%), url('/src/assets/images/vintage_radio_tabletop_1792888541833.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top'
          }}
        >
          {/* Subtle Ambient Lamp Warmth Glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#f59e0b]/10 blur-3xl pointer-events-none" />

          {/* Section Kicker and Title */}
          <div className="text-center max-w-2xl mb-4 z-10 px-4">
            <div className="flex items-center justify-center gap-2 text-xs text-[#cfa459] font-mono-dial tracking-widest uppercase mb-1.5">
              <span>9-Transistor Superheterodyne</span>
              <span aria-hidden="true">·</span>
              <span>Solid State Tuner</span>
              <span aria-hidden="true">·</span>
              <span>1964 Acoustic Spec</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-display-retro tracking-tight text-[#f7eed9] text-balance">
              Stream Retro AM, FM & Shortwave Radio
            </h1>
            <p className="text-xs sm:text-sm text-[#b0a28f] mt-1.5 max-w-xl mx-auto leading-relaxed">
              Experience the analog warmth of mid-century radio. Turn the milled rotary knob to tune across authentic jazz, big band swing, rock & roll, and historical broadcasts with realistic atmospheric static.
            </p>
          </div>

          {/* The Transistor Radio Chassis Unit */}
          <RadioChassis />
        </section>

        {/* Featured Broadcasts Section: Zero-Pill Curated Airwaves */}
        <section id="featured" className="w-full max-w-6xl px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#a69986] font-mono-dial uppercase">
                <span>Frequency Airwaves</span>
                <span aria-hidden="true">·</span>
                <span>Live Audio Streams</span>
              </div>
              <h2 className="text-2xl font-bold font-display-retro text-[#f4ecd8] tracking-tight mt-1">
                Curated Vintage Radio Stations
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1c1814] rounded-lg border border-[#332b22]">
              {(['all', 'am', 'fm', 'sw'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-[#3b3227] text-[#ffdd99] shadow-sm'
                      : 'text-[#8c8070] hover:text-[#d9cebe]'
                  }`}
                >
                  {tab === 'all' ? 'All Broadcasts' : tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STATIONS.filter(s => activeTab === 'all' || s.band.toLowerCase() === activeTab).map(station => (
              <div
                key={station.id}
                className="group p-5 rounded-xl bg-[#181410] border border-[#2b241c] hover:border-[#4a3e30] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs font-mono-dial text-[#8c8070] mb-2">
                    <span className="font-bold text-[#cfa459]">
                      {station.frequency} {station.band === 'AM' ? 'kHz' : 'MHz'} {station.band}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{station.callsign}</span>
                    <span aria-hidden="true">·</span>
                    <span>{station.era}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#f2ebd9] group-hover:text-[#ffdd99] transition-colors font-display-retro">
                    {station.name}
                  </h3>

                  <p className="text-xs text-[#a69986] mt-1.5 line-clamp-2 leading-relaxed">
                    {station.description}
                  </p>

                  <div className="mt-3 text-[11px] text-[#736758] italic line-clamp-1">
                    "{station.historicalCallout}"
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#262018] flex items-center justify-between text-xs text-[#8c8070]">
                  <span>{station.location}</span>
                  <span className="text-[#cfa459] group-hover:translate-x-0.5 transition-transform">
                    Tune on Radio Dial &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vintage Engineering & Historical Significance Section */}
        <section id="history" className="w-full bg-[#14110e] border-t border-[#2b241c] py-14 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Historical Overview */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 text-xs text-[#cfa459] font-mono-dial uppercase">
                <span>The Transistor Revolution</span>
                <span aria-hidden="true">·</span>
                <span>Bell Labs to Tokyo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display-retro text-[#f5ebd8] tracking-tight mt-1">
                How 9 Germanium Transistors Liberated Sound
              </h2>
              <p className="text-xs sm:text-sm text-[#a89d8d] mt-3 leading-relaxed">
                Before 1954, listening to the radio meant gathering around heavy vacuum tube wooden consoles anchored to living room wall outlets. Tubes required high plate voltages and seconds of warm-up time.
              </p>
              <p className="text-xs sm:text-sm text-[#a89d8d] mt-2.5 leading-relaxed">
                The invention of the point-contact and junction transistor replaced red-hot filaments with microscopic crystals of germanium. Powered by a single 9-volt battery, radios suddenly slipped into coat pockets. Teenagers tuned into rock & roll on beaches, city stoops, and backseats—sparking the modern popular music era.
              </p>

              {/* Technical Specifications Strip */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#2b241c]">
                <div>
                  <div className="text-lg font-bold font-mono-dial text-[#cfa459] tabular-nums">455 kHz</div>
                  <div className="text-[11px] text-[#8c8070] mt-0.5">Intermediate Frequency (IF)</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono-dial text-[#cfa459] tabular-nums">9 Volts</div>
                  <div className="text-[11px] text-[#8c8070] mt-0.5">Dry Cell Battery Supply</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono-dial text-[#cfa459] tabular-nums">0.5 Watt</div>
                  <div className="text-[11px] text-[#8c8070] mt-0.5">Alnico Permanent Magnet Audio</div>
                </div>
              </div>
            </div>

            {/* Right Column: Radio Ephemera Image Showcase */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden border-2 border-[#3d3326] shadow-2xl">
                <img
                  src="/src/assets/images/vintage_radio_ephemera_1792888542754.jpg"
                  alt="Vintage 1960s Radio Station Guide & Frequency Finder ephemera card"
                  className="w-full h-auto object-cover max-h-80"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 bg-[#1e1914] border-t border-[#382f23] text-center">
                  <span className="text-[10px] font-mono-dial text-[#9c8e7c]">
                    Authentic 1961 New York Radio Dial Log & Station Guide
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0c0a08] border-t border-[#241e17] py-6 px-6 text-center text-xs text-[#736859] font-mono-dial">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            AetherTone 9-Transistor Solid State Receiver · Vintage Radio Simulator
          </div>
          <div className="flex items-center gap-4 text-[#8a7c6a]">
            <span>Web Audio Acoustic Emulation</span>
            <span aria-hidden="true">·</span>
            <span>Zero Slop Tactile Design</span>
          </div>
        </div>
      </footer>

      {/* Global Station Guide Modal */}
      <StationGuideDrawer
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        currentFrequency={BAND_CONFIG.FM.defaultFreq}
        currentBand="FM"
        onTuneToStation={st => {
          // Handled via chassis or direct tune
        }}
        onSavePreset={() => {}}
        onAddCustomStation={st => {
          STATIONS.push(st);
        }}
      />
    </div>
  );
}
