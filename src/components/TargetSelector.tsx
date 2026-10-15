import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { t } from '../i18n';
import { TARGETS, type TargetId } from '../programs';
import { accents, colors, fontScale } from '../theme';
import { TargetIcon } from './Icons';

type Props = {
  value: TargetId;
  onChange: (target: TargetId) => void;
  disabled: boolean;
};

export function TargetSelector({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      {TARGETS.map((target) => {
        const selected = target === value;
        const accent = accents[target];
        const content = (
          <>
            <View style={[styles.iconWrap, { backgroundColor: selected ? 'rgba(255,255,255,0.22)' : accent.soft }]}>
              <TargetIcon target={target} size={24} color={selected ? colors.white : accent.from} />
            </View>
            <View style={styles.texts}>
              <Text style={styles.label} maxFontSizeMultiplier={fontScale.heading}>
                {t.targets[target].label}
              </Text>
              <Text
                style={[styles.caption, selected && styles.captionSelected]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                maxFontSizeMultiplier={fontScale.heading}
              >
                {t.targets[target].caption}
              </Text>
            </View>
          </>
        );
        return (
          <Pressable
            key={target}
            onPress={() => onChange(target)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            style={({ pressed }) => [styles.card, pressed && styles.pressed, disabled && !selected && styles.dimmed]}
          >
            {selected ? (
              <LinearGradient
                colors={[accent.from, accent.to]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.inner, styles.innerSelected, { shadowColor: accent.glow }]}
              >
                {content}
              </LinearGradient>
            ) : (
              <View style={[styles.inner, styles.innerIdle]}>{content}</View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  card: {
    flex: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    minHeight: 76,
  },
  innerIdle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  innerSelected: {
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  captionSelected: {
    color: 'rgba(255,255,255,0.85)',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  dimmed: {
    opacity: 0.4,
  },
});
