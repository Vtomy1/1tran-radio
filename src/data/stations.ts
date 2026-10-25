import { RadioStation } from '../types/radio';

export const STATIONS: RadioStation[] = [
  // ==================== AM BAND (kHz) ====================
  {
    id: 'am-540',
    name: 'Old Time Radio Theater',
    callsign: 'WOTR-AM',
    frequency: 540,
    band: 'AM',
    genre: 'Classic Radio Drama & Mystery',
    location: 'New York, NY',
    streamUrl: 'https://ice2.somafm.com/secretagent-128-mp3',
    backupStreamUrl: 'https://ice6.somafm.com/specials-128-mp3',
    description: 'Golden Age of Radio serials: Suspense, The Shadow, Dragnet, and vintage detective audio.',
    era: '1940s - 1950s',
    historicalCallout: 'Broadcasting from Studio 4B with full Foley sound effects and organ stings.'
  },
  {
    id: 'am-680',
    name: 'Big Band & Ballroom Swing',
    callsign: 'WGN-AM',
    frequency: 680,
    band: 'AM',
    genre: '1940s Swing & Big Band',
    location: 'Chicago, IL',
    streamUrl: 'https://ice1.somafm.com/specials-128-mp3',
    backupStreamUrl: 'https://ice4.somafm.com/lush-128-mp3',
    description: 'Live ballroom broadcasts from the Hotel Sherman: Glenn Miller, Tommy Dorsey, Benny Goodman.',
    era: '1940s',
    historicalCallout: 'Clear Channel 50,000-Watt Giant of the Midwest.'
  },
  {
    id: 'am-770',
    name: 'Musicradio 77 Golden 50s',
    callsign: 'WABC-AM',
    frequency: 770,
    band: 'AM',
    genre: '1950s Rockabilly & Early Rock',
    location: 'New York, NY',
    streamUrl: 'https://ice1.somafm.com/illstreet-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/bootliquor-128-mp3',
    description: 'High-energy top-40 rock & roll: Chuck Berry, Little Richard, Buddy Holly, and Frankie Lymon.',
    era: '1950s',
    historicalCallout: 'The powerhouse that defined American teenage AM car radio.'
  },
  {
    id: 'am-930',
    name: 'Deep South Stax & Soul',
    callsign: 'WLAC-AM',
    frequency: 930,
    band: 'AM',
    genre: 'Classic Rhythm & Blues & Motown',
    location: 'Nashville, TN',
    streamUrl: 'https://ice1.somafm.com/sevensoul-128-mp3',
    backupStreamUrl: 'https://ice6.somafm.com/sonicuniverse-128-mp3',
    description: 'Late-night rhythm & blues, gospel grooves, early Motown singles, and electrifying soul.',
    era: '1960s',
    historicalCallout: 'Randy\'s Record Shop mail-order sponsor sponsor announcements at midnight.'
  },
  {
    id: 'am-1150',
    name: 'Grand Ole Opry Country',
    callsign: 'WSM-AM',
    frequency: 1150,
    band: 'AM',
    genre: 'Vintage Country & Honky-Tonk',
    location: 'Nashville, TN',
    streamUrl: 'https://ice2.somafm.com/bootliquor-128-mp3',
    backupStreamUrl: 'https://ice1.somafm.com/illstreet-128-mp3',
    description: 'Direct from the Ryman Auditorium: Hank Williams, Patsy Cline, Johnny Cash, and western swing.',
    era: '1950s - 1960s',
    historicalCallout: 'We Shield Millions — broadcasting live on clear channel frequency.'
  },
  {
    id: 'am-1310',
    name: 'Great American Songbook',
    callsign: 'KDKA-AM',
    frequency: 1310,
    band: 'AM',
    genre: 'Crooners & Standard Ballads',
    location: 'Pittsburgh, PA',
    streamUrl: 'https://ice4.somafm.com/lush-128-mp3',
    backupStreamUrl: 'https://ice6.somafm.com/sonicuniverse-128-mp3',
    description: 'Timeless standards: Frank Sinatra, Nat King Cole, Ella Fitzgerald, and romantic strings.',
    era: '1950s',
    historicalCallout: 'The Pioneer Broadcasting Station of the World.'
  },
  {
    id: 'am-1540',
    name: 'Vintage Newsreel & Space Race',
    callsign: 'WINS-AM',
    frequency: 1540,
    band: 'AM',
    genre: 'Historic News & Telemetry',
    location: 'Cape Canaveral / NY',
    streamUrl: 'https://ice2.somafm.com/missioncontrol-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/secretagent-128-mp3',
    description: 'Historic audio archives: Apollo mission radio loops, emergency bulletins, and vintage newscasts.',
    era: '1960s',
    historicalCallout: 'Give us 22 minutes and we\'ll give you the world.'
  },

  // ==================== FM BAND (MHz) ====================
  {
    id: 'fm-88.5',
    name: 'Blue Note Midnight Jazz',
    callsign: 'WBGO-FM',
    frequency: 88.5,
    band: 'FM',
    genre: 'Vintage Bebop & Cool Jazz',
    location: 'Newark / New York',
    streamUrl: 'https://ice6.somafm.com/sonicuniverse-128-mp3',
    backupStreamUrl: 'https://ice4.somafm.com/lush-128-mp3',
    description: 'Analog vinyl masters of Miles Davis, John Coltrane, Thelonious Monk, and Horace Silver.',
    era: '1950s - 1960s',
    historicalCallout: 'FM stereo fidelity with warm tube compression.'
  },
  {
    id: 'fm-91.3',
    name: 'Radio Caroline Pirate Airwaves',
    callsign: 'CARO-FM',
    frequency: 91.3,
    band: 'FM',
    genre: '1960s British Invasion & Mod',
    location: 'North Sea Offshore Vessel',
    streamUrl: 'https://ice1.somafm.com/leftcoast70s-128-mp3',
    backupStreamUrl: 'https://ice1.somafm.com/bagel-128-mp3',
    description: 'Offshore pirate rock: The Kinks, The Who, Rolling Stones, Yardbirds, and psychedelic 45s.',
    era: '1960s',
    historicalCallout: 'Broadcasting in defiance of the Marine Offences Act from MV Mi Amigo.'
  },
  {
    id: 'fm-94.7',
    name: 'San Francisco Freeform Vinyl',
    callsign: 'KSAN-FM',
    frequency: 94.7,
    band: 'FM',
    genre: '1970s Classic Album Rock',
    location: 'San Francisco, CA',
    streamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    backupStreamUrl: 'https://ice1.somafm.com/leftcoast70s-128-mp3',
    description: 'Deep cuts, gatefold album tracks: Pink Floyd, Led Zeppelin, Fleetwood Mac, and Neil Young.',
    era: '1970s',
    historicalCallout: 'The Jive 95 — where the DJ picked the records without commercial formulas.'
  },
  {
    id: 'fm-97.5',
    name: 'Studio 54 Disco Express',
    callsign: 'WBLS-FM',
    frequency: 97.5,
    band: 'FM',
    genre: '1970s Disco & Philly Groove',
    location: 'Manhattan, NY',
    streamUrl: 'https://ice4.somafm.com/defcon-128-mp3',
    backupStreamUrl: 'https://ice1.somafm.com/sevensoul-128-mp3',
    description: '12-inch extended club vinyl mixes: Chic, Donna Summer, Earth Wind & Fire, and Sister Sledge.',
    era: '1970s',
    historicalCallout: 'Direct from the 54th Street dancefloor.'
  },
  {
    id: 'fm-101.9',
    name: 'Underground Cassette New Wave',
    callsign: 'KROQ-FM',
    frequency: 101.9,
    band: 'FM',
    genre: '1980s Post-Punk & Synth Pop',
    location: 'Pasadena, CA',
    streamUrl: 'https://ice2.somafm.com/underground-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    description: 'Synthesizers, drum machines, and trench coats: Depeche Mode, New Order, The Cure, Bauhaus.',
    era: '1980s',
    historicalCallout: 'The Roq of the 80s — pushing the boundary of modern rock radio.'
  },
  {
    id: 'fm-104.5',
    name: 'Pacific Coast Yacht Rock',
    callsign: 'KYCH-FM',
    frequency: 104.5,
    band: 'FM',
    genre: '1970s - 80s Soft Rock & AM Gold',
    location: 'Marina del Rey, CA',
    streamUrl: 'https://ice4.somafm.com/lush-128-mp3',
    backupStreamUrl: 'https://ice1.somafm.com/leftcoast70s-128-mp3',
    description: 'Silky Fender Rhodes and smooth vocal harmonies: Steely Dan, Michael McDonald, Hall & Oates.',
    era: '1970s - 1980s',
    historicalCallout: 'Cruising the Pacific Coast Highway with the windows down.'
  },
  {
    id: 'fm-107.1',
    name: 'Space-Age Pop & Exotica',
    callsign: 'WBAZ-FM',
    frequency: 107.1,
    band: 'FM',
    genre: 'Vintage Exotica & Lounge',
    location: 'Palm Springs, CA',
    streamUrl: 'https://ice1.somafm.com/bagel-128-mp3',
    backupStreamUrl: 'https://ice6.somafm.com/specials-128-mp3',
    description: 'Bongos, vibraphones, and tiki lounge hi-fi: Martin Denny, Les Baxter, Esquivel, and Henry Mancini.',
    era: '1950s - 1960s',
    historicalCallout: 'Designed for high-fidelity stereophonic consoles in modern living rooms.'
  },

  // ==================== SHORTWAVE BAND (MHz) ====================
  {
    id: 'sw-6.075',
    name: 'Lincolnshire Poacher Spy Station',
    callsign: 'E03-SW',
    frequency: 6.075,
    band: 'SW',
    genre: 'Cold War Numbers Station',
    location: 'RAF Akrotiri / Unidentified',
    streamUrl: 'https://ice4.somafm.com/dronezone-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/missioncontrol-128-mp3',
    description: 'Enigmatic interval chimes followed by synthetic voice reading five-digit cypher groups.',
    era: '1970s',
    historicalCallout: 'Broadcast over high-power HF directional arrays to deep-cover operatives.'
  },
  {
    id: 'sw-9.420',
    name: 'BBC World Service DX Relay',
    callsign: 'BWS-SW',
    frequency: 9.420,
    band: 'SW',
    genre: 'International News & Atmospheric DX',
    location: 'Bush House, London',
    streamUrl: 'https://ice1.somafm.com/defcon-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/secretagent-128-mp3',
    description: 'The iconic Greenwich pips, Big Ben chimes, and international foreign correspondents.',
    era: '1960s - 1970s',
    historicalCallout: 'This is London calling: broad-spectrum shortwave transmission across four continents.'
  },
  {
    id: 'sw-14.150',
    name: 'North Atlantic Maritime Marine',
    callsign: 'WLO-SW',
    frequency: 14.150,
    band: 'SW',
    genre: 'High Seas Weather & Morse Code',
    location: 'Mobile, AL / North Atlantic',
    streamUrl: 'https://ice6.somafm.com/spacestation-128-mp3',
    backupStreamUrl: 'https://ice4.somafm.com/dronezone-128-mp3',
    description: 'Continuous maritime automated weather broadcasts, navigational warnings, and morse beacons.',
    era: '1960s - 1980s',
    historicalCallout: 'Keeping ships safe across the Atlantic sea lanes on 14 MHz HF.'
  }
];

export const BAND_CONFIG = {
  AM: {
    name: 'AM (Medium Wave)',
    unit: 'kHz',
    min: 530,
    max: 1710,
    step: 10,
    defaultFreq: 770,
    captureWindow: 16, // within 16 kHz we begin picking up station
    scaleMarks: [540, 600, 700, 800, 950, 1150, 1310, 1450, 1600, 1710]
  },
  FM: {
    name: 'FM (VHF Band II)',
    unit: 'MHz',
    min: 88.0,
    max: 108.0,
    step: 0.1,
    defaultFreq: 94.7,
    captureWindow: 0.5, // within 0.5 MHz we begin picking up station
    scaleMarks: [88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108]
  },
  SW: {
    name: 'SW (Shortwave HF)',
    unit: 'MHz',
    min: 5.9,
    max: 18.0,
    step: 0.025,
    defaultFreq: 9.42,
    captureWindow: 0.12, // within 0.12 MHz
    scaleMarks: [6.0, 7.0, 9.5, 11.8, 13.6, 15.2, 17.8]
  }
} as const;

export const DEFAULT_PRESETS: { [slot: number]: string } = {
  1: 'am-770',  // WABC 50s Rock
  2: 'am-540',  // Old Time Radio
  3: 'fm-88.5', // WBGO Jazz
  4: 'fm-94.7', // KSAN Classic Vinyl Rock
  5: 'sw-9.420' // BBC World Service DX
};
