import type { TargetId } from './programs';

export const colors = {
  backgroundTop: '#0E1A3A',
  backgroundBottom: '#050A18',
  surface: 'rgba(255,255,255,0.06)',
  surfaceBorder: 'rgba(255,255,255,0.10)',
  track: 'rgba(255,255,255,0.08)',
  text: '#F1F5FF',
  textMuted: '#9AA8C7',
  textFaint: '#66738F',
  success: '#4ADE80',
  error: '#F87171',
  white: '#FFFFFF',
};

// Caps for Dynamic Type so the largest accessibility sizes don't break words mid-line.
// fixed: text inside fixed-size shapes; heading: short labels in tight rows; body: text that wraps freely.
export const fontScale = {
  fixed: 1.15,
  heading: 1.35,
  body: 2,
};

export type Accent = {
  from: string;
  to: string;
  glow: string;
  soft: string;
};

export const accents: Record<TargetId, Accent> = {
  water: { from: '#38BDF8', to: '#2563EB', glow: '#38BDF8', soft: 'rgba(56,189,248,0.16)' },
  dust: { from: '#FCD34D', to: '#F97316', glow: '#FB923C', soft: 'rgba(251,146,60,0.16)' },
};
