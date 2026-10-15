import type { AudioSource } from 'expo-audio';

export type ModeId = 'tone' | 'pulse' | 'sweep';

export const MODES: { id: ModeId; source: AudioSource }[] = [
  { id: 'tone', source: require('../assets/sounds/tone-165.wav') },
  { id: 'pulse', source: require('../assets/sounds/pulse-165.wav') },
  { id: 'sweep', source: require('../assets/sounds/sweep.wav') },
];

// Must match DURATION_S in scripts/generate-tones.mjs.
export const DURATION_S = 30;
