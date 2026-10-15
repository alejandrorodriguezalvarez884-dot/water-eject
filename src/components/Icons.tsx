import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { TargetId } from '../programs';

type IconProps = { size?: number; color: string };

export function DropIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.6c-.3 0-.5.1-.7.3C9.6 4.9 5 10.4 5 14.6a7 7 0 0 0 14 0c0-4.2-4.6-9.7-6.3-11.7a.9.9 0 0 0-.7-.3Z"
        fill={color}
      />
      <Path d="M9.2 14.4a3 3 0 0 0 2.4 3" stroke="rgba(255,255,255,0.55)" strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function DustIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2.5 8.5h9a2.5 2.5 0 1 0-2.5-2.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M2.5 12.5h13a2.5 2.5 0 1 1-2.5 2.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M2.5 16.5h5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17.5} cy={5} r={1.4} fill={color} />
      <Circle cx={21} cy={8.5} r={1} fill={color} />
      <Circle cx={20.5} cy={3} r={0.8} fill={color} />
      <Circle cx={20.5} cy={19} r={1.2} fill={color} />
    </Svg>
  );
}

export function TargetIcon({ target, ...props }: IconProps & { target: TargetId }) {
  return target === 'water' ? <DropIcon {...props} /> : <DustIcon {...props} />;
}

// Same glyph as the app icon; the two waves can be tinted separately (water / dust).
export function SpeakerIcon({
  size = 24,
  color,
  innerWave = color,
  outerWave = color,
}: IconProps & { innerWave?: string; outerWave?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9.2h2.8L11 5.5v13l-4.2-3.7H4a1 1 0 0 1-1-1V10.2a1 1 0 0 1 1-1Z" fill={color} />
      <Path d="M14.8 9a4.2 4.2 0 0 1 0 6" stroke={innerWave} strokeWidth={2} strokeLinecap="round" />
      <Path d="M17.8 6.3a8 8 0 0 1 0 11.4" stroke={outerWave} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function VibrateIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={7.5} y={3.5} width={9} height={17} rx={2.2} stroke={color} strokeWidth={2} />
      <Path d="M4 9v6M20 9v6M1.5 10.5v3M22.5 10.5v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
