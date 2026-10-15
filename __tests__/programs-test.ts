import { readFileSync } from 'fs';
import { join } from 'path';

import { DURATION_S, PROGRAM_SOURCES, TARGET_PROGRAMS, TARGETS } from '../src/programs';

const FILES = {
  tone: 'water-tone.wav',
  pulse: 'water-pulse.wav',
  sweep: 'water-sweep.wav',
  shake: 'dust-shake.wav',
  wideSweep: 'dust-sweep.wav',
} as const;

// Reads the length of a PCM WAV file from its fmt and data chunks.
function wavSeconds(file: string) {
  const buf = readFileSync(join(__dirname, '../assets/sounds', file));
  expect(buf.toString('ascii', 0, 4)).toBe('RIFF');
  expect(buf.toString('ascii', 8, 12)).toBe('WAVE');
  let byteRate = 0;
  for (let offset = 12; offset < buf.length; ) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'fmt ') byteRate = buf.readUInt32LE(offset + 16);
    if (id === 'data') return size / byteRate;
    offset += 8 + size + (size % 2);
  }
  throw new Error(`${file} has no data chunk`);
}

test('every target lists at least one program, each with a sound', () => {
  for (const target of TARGETS) {
    expect(TARGET_PROGRAMS[target].length).toBeGreaterThan(0);
    for (const program of TARGET_PROGRAMS[target]) expect(PROGRAM_SOURCES[program]).toBeDefined();
  }
});

test.each(Object.entries(FILES))('%s sound lasts DURATION_S seconds', (_program, file) => {
  expect(wavSeconds(file)).toBeCloseTo(DURATION_S, 1);
});
