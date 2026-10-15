import { StyleSheet, Text, View } from 'react-native';

import { type Accent, colors, fontScale } from '../theme';

type Props = {
  title: string;
  tips: string[];
  accent: Accent;
};

export function Tips({ title, tips, accent }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} maxFontSizeMultiplier={fontScale.body}>
        {title}
      </Text>
      {tips.map((tip, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.badge, { backgroundColor: accent.soft }]}>
            <Text style={[styles.badgeText, { color: accent.from }]} maxFontSizeMultiplier={fontScale.fixed}>
              {i + 1}
            </Text>
          </View>
          <Text style={styles.tip} maxFontSizeMultiplier={fontScale.body}>
            {tip}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  tip: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
