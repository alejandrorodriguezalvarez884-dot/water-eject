import type { AudioSource } from 'expo-audio';

export type TargetId = 'water' | 'dust';
export type ProgramId = 'tone' | 'pulse' | 'sweep' | 'shake' | 'wideSweep';

export const TARGETS: TargetId[] = ['water', 'dust'];

export const TARGET_PROGRAMS: Record<TargetId, ProgramId[]> = {
  water: ['tone', 'pulse', 'sweep'],
  dust: ['shake', 'wideSweep'],
};

export const PROGRAM_SOURCES: Record<ProgramId, AudioSource> = {
  tone: require('../assets/sounds/water-tone.wav'),
  pulse: require('../assets/sounds/water-pulse.wav'),
  sweep: require('../assets/sounds/water-sweep.wav'),
  shake: require('../assets/sounds/dust-shake.wav'),
  wideSweep: require('../assets/sounds/dust-sweep.wav'),
};

// Must match DURATION_S in scripts/generate-tones.mjs.
export const DURATION_S = 30;
