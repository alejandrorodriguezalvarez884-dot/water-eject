// Generates the WAV files in assets/sounds. Run with: node scripts/generate-tones.mjs
// Mono 16-bit PCM, phase-continuous so frequency changes never click.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 22050;
const DURATION_S = 30;
const AMPLITUDE = 0.95;
const FADE_S = 0.02;
const BASE_HZ = 165;

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');

// Each generator returns { freq, gain } for time t (seconds).
const tones = {
  // Steady 165 Hz, the frequency the Apple Watch Water Lock uses.
  'tone-165': () => ({ freq: BASE_HZ, gain: 1 }),

  // 165 Hz bursts: 0.6 s on, 0.25 s off. The repeated push/stop helps break surface tension.
  'pulse-165': (t) => {
    const period = 0.85;
    const on = 0.6;
    const pos = t % period;
    const ramp = 0.015;
    let gain = 0;
    if (pos < on) gain = Math.min(1, pos / ramp, (on - pos) / ramp);
    return { freq: BASE_HZ, gain };
  },

  // Logarithmic sweep 100 -> 300 -> 100 Hz every 4 s, to hit the speaker's resonance whatever the model.
  'sweep': (t) => {
    const cycle = 4;
    const pos = (t % cycle) / cycle;
    const x = pos < 0.5 ? pos * 2 : (1 - pos) * 2;
    return { freq: 100 * Math.pow(3, x), gain: 1 };
  },
};

function render(gen) {
  const n = SAMPLE_RATE * DURATION_S;
  const pcm = Buffer.alloc(n * 2);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const { freq, gain } = gen(t);
    const fade = Math.min(1, t / FADE_S, (DURATION_S - t) / FADE_S);
    const sample = Math.sin(phase) * AMPLITUDE * gain * fade;
    pcm.writeInt16LE(Math.round(sample * 32767), i * 2);
    phase = (phase + (2 * Math.PI * freq) / SAMPLE_RATE) % (2 * Math.PI);
  }
  return pcm;
}

function wav(pcm) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

mkdirSync(outDir, { recursive: true });
for (const [name, gen] of Object.entries(tones)) {
  const file = join(outDir, `${name}.wav`);
  writeFileSync(file, wav(render(gen)));
  console.log(`wrote ${file}`);
}
