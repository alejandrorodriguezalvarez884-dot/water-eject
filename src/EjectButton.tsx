import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { colors } from './theme';

const SIZE = 200;
const RIPPLES = 3;
const RIPPLE_MS = 1800;

type Props = {
  running: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

export function EjectButton({ running, onPress, accessibilityLabel }: Props) {
  const [ripples] = useState(() => Array.from({ length: RIPPLES }, () => new Animated.Value(0)));

  useEffect(() => {
    if (!running) {
      ripples.forEach((r) => r.setValue(0));
      return;
    }
    const loops = ripples.map((r, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay((RIPPLE_MS / RIPPLES) * i),
          Animated.timing(r, {
            toValue: 1,
            duration: RIPPLE_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [running, ripples]);

  return (
    <View style={styles.wrap}>
      {ripples.map((r, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ripple,
            {
              opacity: r.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }],
            },
          ]}
        />
      ))}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [styles.button, running && styles.buttonRunning, pressed && styles.pressed]}
      >
        {running ? <View style={styles.stopIcon} /> : <View style={styles.drop} />}
      </Pressable>
    </View>
  );
}

const DROP = 64;

const styles = StyleSheet.create({
  wrap: {
    width: SIZE * 1.7,
    height: SIZE * 1.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  buttonRunning: {
    backgroundColor: colors.accentDark,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  // A square with three rounded corners, rotated so the sharp one points up.
  drop: {
    width: DROP,
    height: DROP,
    marginTop: DROP * 0.3,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: DROP / 2,
    borderBottomLeftRadius: DROP / 2,
    borderBottomRightRadius: DROP / 2,
    transform: [{ rotate: '45deg' }],
  },
  stopIcon: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
