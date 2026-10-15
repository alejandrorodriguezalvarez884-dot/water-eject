import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, RadialGradient, Stop } from 'react-native-svg';

import type { TargetId } from '../programs';
import { accents, colors, fontScale } from '../theme';
import { CheckIcon, TargetIcon } from './Icons';

const STAGE = 316;
const RING = 256;
const STROKE = 10;
const BUTTON = 184;
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const RIPPLES = 3;
const RIPPLE_MS = 2100;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  target: TargetId;
  running: boolean;
  finished: boolean;
  progress: number;
  remaining: number;
  onPress: () => void;
  startLabel: string;
  secondsLabel: string;
  accessibilityLabel: string;
};

export function CleanButton({
  target,
  running,
  finished,
  progress,
  remaining,
  onPress,
  startLabel,
  secondsLabel,
  accessibilityLabel,
}: Props) {
  const accent = accents[target];
  const [ripples] = useState(() => Array.from({ length: RIPPLES }, () => new Animated.Value(0)));
  const [breath] = useState(() => new Animated.Value(0));
  const [ring] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(ring, {
      toValue: progress,
      duration: 120,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress, ring]);

  // Ripples while playing, a slow "breathing" pulse while idle to invite a tap.
  useEffect(() => {
    if (running) {
      breath.setValue(0);
      const loops = ripples.map((r, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay((RIPPLE_MS / RIPPLES) * i),
            Animated.timing(r, { toValue: 1, duration: RIPPLE_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ]),
        ),
      );
      loops.forEach((l) => l.start());
      return () => {
        loops.forEach((l) => l.stop());
        ripples.forEach((r) => r.setValue(0));
      };
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [running, ripples, breath]);

  const gradientId = `ring-${target}`;
  const glowId = `glow-${target}`;

  return (
    <View style={styles.stage}>
      <Svg width={STAGE} height={STAGE} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={accent.glow} stopOpacity={running ? 0.45 : 0.28} />
            <Stop offset="1" stopColor={accent.glow} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={STAGE / 2} cy={STAGE / 2} r={STAGE / 2} fill={`url(#${glowId})`} />
      </Svg>

      {ripples.map((r, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.ripple,
            {
              borderColor: accent.glow,
              opacity: r.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
              transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [1, STAGE / BUTTON] }) }],
            },
          ]}
        />
      ))}

      <Svg width={RING} height={RING} style={styles.ring}>
        <Defs>
          <SvgGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={accent.from} />
            <Stop offset="1" stopColor={accent.to} />
          </SvgGradient>
        </Defs>
        <Circle cx={RING / 2} cy={RING / 2} r={RADIUS} stroke={colors.track} strokeWidth={STROKE} fill="none" />
        <AnimatedCircle
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={ring.interpolate({ inputRange: [0, 1], outputRange: [CIRCUMFERENCE, 0] })}
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </Svg>

      <Animated.View
        style={{ transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }] }}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={({ pressed }) => [styles.pressable, { shadowColor: accent.glow }, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={[accent.from, accent.to]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.button}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.6 }}
              style={StyleSheet.absoluteFill}
            />
            {running ? (
              <>
                <Text style={styles.count} allowFontScaling={false}>
                  {remaining}
                </Text>
                <Text style={styles.unit} maxFontSizeMultiplier={fontScale.fixed}>
                  {secondsLabel}
                </Text>
              </>
            ) : finished ? (
              <CheckIcon size={76} color={colors.white} />
            ) : (
              <>
                <TargetIcon target={target} size={64} color={colors.white} />
                <Text style={styles.startLabel} maxFontSizeMultiplier={fontScale.fixed}>
                  {startLabel}
                </Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    borderWidth: 2,
  },
  ring: {
    position: 'absolute',
  },
  pressable: {
    borderRadius: BUTTON / 2,
    shadowOpacity: 0.7,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  button: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  count: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 70,
  },
  unit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  startLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 8,
  },
});
