import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '../i18n';
import type { ProgramId } from '../programs';
import { type Accent, colors, fontScale } from '../theme';

type Props = {
  programs: ProgramId[];
  value: ProgramId;
  onChange: (program: ProgramId) => void;
  disabled: boolean;
  accent: Accent;
};

export function ProgramPicker({ programs, value, onChange, disabled, accent }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {programs.map((program) => {
          const selected = program === value;
          return (
            <Pressable
              key={program}
              onPress={() => onChange(program)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
              style={({ pressed }) => [
                styles.chip,
                selected && { backgroundColor: accent.soft, borderColor: accent.from },
                pressed && styles.pressed,
                disabled && !selected && styles.dimmed,
              ]}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
                maxFontSizeMultiplier={fontScale.heading}
              >
                {t.programs[program].label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.description} maxFontSizeMultiplier={fontScale.body}>
        {t.programs[value].description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: colors.text,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
    minHeight: 38,
    paddingHorizontal: 8,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  dimmed: {
    opacity: 0.4,
  },
});
