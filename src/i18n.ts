import { getLocales } from 'expo-localization';

import type { ProgramId, TargetId } from './programs';

type TargetStrings = {
  label: string;
  caption: string;
  running: string;
  done: string;
  tips: string[];
};

type Strings = {
  title: string;
  subtitle: string;
  targets: Record<TargetId, TargetStrings>;
  programs: Record<ProgramId, { label: string; description: string }>;
  start: string;
  tapToStart: string;
  tapToStop: string;
  seconds: string;
  vibrationOn: string;
  vibrationOff: string;
  tipsTitle: string;
  disclaimer: string;
  playError: string;
};

const es: Strings = {
  title: 'Limpiar altavoz',
  subtitle: 'Saca el agua y el polvo con sonido',
  targets: {
    water: {
      label: 'Agua',
      caption: '165 Hz',
      running: 'Expulsando agua…',
      done: '¡Listo! Si aún suena apagado, repite.',
      tips: [
        'Sube el volumen al máximo.',
        'Pon el altavoz mirando hacia abajo.',
        'Quita la funda si tapa el altavoz.',
        'Repite 2 o 3 veces si hace falta.',
      ],
    },
    dust: {
      label: 'Polvo',
      caption: '60–1500 Hz',
      running: 'Soltando polvo…',
      done: '¡Listo! Sopla suavemente la rejilla para terminar.',
      tips: [
        'Sube el volumen al máximo.',
        'Pon el altavoz mirando hacia abajo para que caiga el polvo.',
        'Después, pasa un cepillo suave y seco por la rejilla.',
        'No metas agujas ni palillos: dañan la membrana.',
      ],
    },
  },
  programs: {
    tone: { label: 'Tono', description: 'Tono continuo de 165 Hz, el mismo que usa el Apple Watch.' },
    pulse: { label: 'Pulsos', description: 'Ráfagas de 165 Hz. Las pausas ayudan a soltar gotas pegadas.' },
    sweep: { label: 'Barrido', description: 'Recorre de 100 a 300 Hz para dar con la resonancia de tu altavoz.' },
    shake: { label: 'Sacudida', description: 'Golpes graves y secos que hacen vibrar la rejilla con fuerza.' },
    wideSweep: { label: 'Barrido amplio', description: 'Recorre de 60 a 1500 Hz para mover el polvo de toda la rejilla.' },
  },
  start: 'Empezar',
  tapToStart: 'Toca el botón para empezar',
  tapToStop: 'Toca para parar',
  seconds: 'seg',
  vibrationOn: 'Vibración activada',
  vibrationOff: 'Vibración desactivada',
  tipsTitle: 'Para mejores resultados',
  disclaimer: 'Ayuda tras salpicaduras o con polvo suelto. No repara daños por líquidos ni sustituye una limpieza física.',
  playError: 'No se pudo reproducir el sonido.',
};

const en: Strings = {
  title: 'Speaker Cleaner',
  subtitle: 'Clear water and dust with sound',
  targets: {
    water: {
      label: 'Water',
      caption: '165 Hz',
      running: 'Ejecting water…',
      done: 'Done! If it still sounds muffled, run it again.',
      tips: [
        'Turn the volume all the way up.',
        'Hold the phone with the speaker facing down.',
        'Remove the case if it covers the speaker.',
        'Repeat 2 or 3 times if needed.',
      ],
    },
    dust: {
      label: 'Dust',
      caption: '60–1500 Hz',
      running: 'Shaking dust loose…',
      done: 'Done! Gently blow on the grille to finish.',
      tips: [
        'Turn the volume all the way up.',
        'Hold the speaker facing down so the dust falls out.',
        'Afterwards, brush the grille with a soft, dry brush.',
        'Never poke it with pins or toothpicks: they damage the membrane.',
      ],
    },
  },
  programs: {
    tone: { label: 'Tone', description: 'Steady 165 Hz tone, the same one the Apple Watch uses.' },
    pulse: { label: 'Pulses', description: '165 Hz bursts. The pauses help shake off stuck droplets.' },
    sweep: { label: 'Sweep', description: 'Sweeps 100 to 300 Hz to hit your speaker’s resonance.' },
    shake: { label: 'Shake', description: 'Short, punchy bass hits that rattle the grille hard.' },
    wideSweep: { label: 'Wide sweep', description: 'Sweeps 60 to 1500 Hz to move dust across the whole grille.' },
  },
  start: 'Start',
  tapToStart: 'Tap the button to start',
  tapToStop: 'Tap to stop',
  seconds: 'sec',
  vibrationOn: 'Vibration on',
  vibrationOff: 'Vibration off',
  tipsTitle: 'For best results',
  disclaimer: 'Helps after splashes or with loose dust. It does not repair liquid damage or replace a physical clean.',
  playError: 'Could not play the sound.',
};

const language = getLocales()[0]?.languageCode;

export const t: Strings = language === 'es' ? es : en;
