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

// Each generator returns { freq, gain, drive? } for time t (seconds).
// drive > 0 soft-clips the sine: more harmonics, so tiny phone speakers move harder.
const tones = {
  // --- Water ---
  // Steady 165 Hz, the frequency the Apple Watch Water Lock uses.
  'water-tone': () => ({ freq: BASE_HZ, gain: 1 }),

  // 165 Hz bursts: 0.6 s on, 0.25 s off. The repeated push/stop helps break surface tension.
  'water-pulse': (t) => {
    const period = 0.85;
    const on = 0.6;
    const pos = t % period;
    const ramp = 0.015;
    let gain = 0;
    if (pos < on) gain = Math.min(1, pos / ramp, (on - pos) / ramp);
    return { freq: BASE_HZ, gain };
  },

  // Logarithmic sweep 100 -> 300 -> 100 Hz every 4 s, to hit the speaker's resonance whatever the model.
  'water-sweep': (t) => {
    const cycle = 4;
    const pos = (t % cycle) / cycle;
    const x = pos < 0.5 ? pos * 2 : (1 - pos) * 2;
    return { freq: 100 * Math.pow(3, x), gain: 1 };
  },

  // --- Dust ---
  // Short, hard low-frequency jolts alternating 90 / 140 Hz: maximum cone excursion to shake particles loose.
  'dust-shake': (t) => {
    const period = 0.45;
    const on = 0.3;
    const pos = t % period;
    const ramp = 0.008;
    let gain = 0;
    if (pos < on) gain = Math.min(1, pos / ramp, (on - pos) / ramp);
    const freq = Math.floor(t / period) % 2 === 0 ? 90 : 140;
    return { freq, gain, drive: 2.5 };
  },

  // Wide logarithmic sweep 60 Hz -> 1.5 kHz -> 60 Hz every 6 s, so every part of the grille vibrates at some point.
  'dust-sweep': (t) => {
    const cycle = 6;
    const pos = (t % cycle) / cycle;
    const x = pos < 0.5 ? pos * 2 : (1 - pos) * 2;
    return { freq: 60 * Math.pow(25, x), gain: 1 };
  },
};

function render(gen) {
  const n = SAMPLE_RATE * DURATION_S;
  const pcm = Buffer.alloc(n * 2);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const { freq, gain, drive = 0 } = gen(t);
    const fade = Math.min(1, t / FADE_S, (DURATION_S - t) / FADE_S);
    const wave = drive > 0 ? Math.tanh(drive * Math.sin(phase)) / Math.tanh(drive) : Math.sin(phase);
    const sample = wave * AMPLITUDE * gain * fade;
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
