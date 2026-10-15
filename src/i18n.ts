import { getLocales } from 'expo-localization';

const es = {
  title: 'Expulsar agua',
  subtitle: 'Saca el agua del altavoz con un tono grave de 165 Hz',
  modes: {
    tone: { label: 'Tono', description: 'Tono continuo de 165 Hz, el mismo que usa el Apple Watch.' },
    pulse: { label: 'Pulsos', description: 'Ráfagas de 165 Hz. Las paradas ayudan a soltar gotas pegadas.' },
    sweep: { label: 'Barrido', description: 'Recorre de 100 a 300 Hz para dar con la resonancia de tu altavoz.' },
  },
  tapToStart: 'Pulsa para empezar',
  tapToStop: 'Pulsa para parar',
  done: '¡Listo! Si el sonido aún suena apagado, repite.',
  vibration: 'Vibración',
  tipsTitle: 'Para mejores resultados',
  tips: [
    'Sube el volumen al máximo.',
    'Pon el altavoz mirando hacia abajo.',
    'Quita la funda si tapa el altavoz.',
    'Repite 2 o 3 veces si hace falta.',
  ],
  disclaimer: 'Ayuda a expulsar agua tras salpicaduras. No repara daños por líquidos.',
  playError: 'No se pudo reproducir el sonido.',
};

type Strings = typeof es;

const en: Strings = {
  title: 'Water Eject',
  subtitle: 'Push water out of your speaker with a 165 Hz bass tone',
  modes: {
    tone: { label: 'Tone', description: 'Steady 165 Hz tone, the same one the Apple Watch uses.' },
    pulse: { label: 'Pulses', description: '165 Hz bursts. The pauses help shake off stuck droplets.' },
    sweep: { label: 'Sweep', description: 'Sweeps 100 to 300 Hz to hit your speaker’s resonance.' },
  },
  tapToStart: 'Tap to start',
  tapToStop: 'Tap to stop',
  done: 'Done! If it still sounds muffled, run it again.',
  vibration: 'Vibration',
  tipsTitle: 'For best results',
  tips: [
    'Turn the volume all the way up.',
    'Hold the phone with the speaker facing down.',
    'Remove the case if it covers the speaker.',
    'Repeat 2 or 3 times if needed.',
  ],
  disclaimer: 'Helps push out water after splashes. It does not repair liquid damage.',
  playError: 'Could not play the sound.',
};

const language = getLocales()[0]?.languageCode;

export const t: Strings = language === 'es' ? es : en;
