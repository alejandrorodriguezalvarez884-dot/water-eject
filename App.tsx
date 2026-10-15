import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { EjectButton } from './src/EjectButton';
import { t } from './src/i18n';
import { MODES, type ModeId } from './src/modes';
import { colors } from './src/theme';
import { useWaterEject } from './src/useWaterEject';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const [mode, setMode] = useState<ModeId>('tone');
  const [vibrate, setVibrate] = useState(true);
  const eject = useWaterEject(mode, vibrate);

  const statusText = eject.error
    ? t.playError
    : eject.running
      ? t.tapToStop
      : eject.finished
        ? t.done
        : t.tapToStart;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.segmented}>
          {MODES.map(({ id }) => {
            const selected = id === mode;
            return (
              <Pressable
                key={id}
                onPress={() => setMode(id)}
                disabled={eject.running}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: eject.running }}
                style={[styles.segment, selected && styles.segmentSelected, eject.running && !selected && styles.dimmed]}
              >
                <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{t.modes[id].label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.modeDescription}>{t.modes[mode].description}</Text>

        <EjectButton
          running={eject.running}
          onPress={eject.running ? eject.stop : eject.start}
          accessibilityLabel={eject.running ? t.tapToStop : t.tapToStart}
        />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${eject.progress * 100}%` }]} />
        </View>
        <Text
          style={[styles.status, eject.finished && styles.statusDone, eject.error && styles.statusError]}
          accessibilityLiveRegion="polite"
        >
          {eject.running ? `${eject.remaining} s · ${statusText}` : statusText}
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t.vibration}</Text>
          <Switch
            value={vibrate}
            onValueChange={setVibrate}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.tipsTitle}</Text>
          {t.tips.map((tip, i) => (
            <Text key={i} style={styles.tip}>
              {i + 1}. {tip}
            </Text>
          ))}
        </View>

        <Text style={styles.disclaimer}>{t.disclaimer}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  segmentTextSelected: {
    color: colors.white,
  },
  dimmed: {
    opacity: 0.4,
  },
  modeDescription: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    minHeight: 36,
  },
  progressTrack: {
    alignSelf: 'stretch',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  status: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  statusDone: {
    color: colors.success,
  },
  statusError: {
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 24,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 16,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  tip: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
  },
});
