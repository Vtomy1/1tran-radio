export type Band = 'AM' | 'FM' | 'SW';

export interface RadioStation {
  id: string;
  name: string;
  callsign: string;
  frequency: number; // in kHz for AM, MHz for FM & SW
  band: Band;
  genre: string;
  location: string;
  streamUrl: string;
  backupStreamUrl?: string;
  description: string;
  era: string;
  historicalCallout?: string;
}

export interface Preset {
  slot: number; // 1 to 5
  stationId: string | null;
}

export interface RadioState {
  powered: boolean;
  band: Band;
  frequency: number; // current frequency pointer
  volume: number; // 0 to 100
  tone: number; // 0 (Warm bass) to 100 (Bright treble)
  dialLight: boolean;
  speakerMode: 'transistor' | 'hifi';
  staticNoiseEnabled: boolean;
  antennaExtended: boolean;
  activePreset: number | null;
}

export interface RecordedTape {
  id: string;
  timestamp: string;
  stationName: string;
  frequencyText: string;
  durationSeconds: number;
  audioBlobUrl: string;
}
