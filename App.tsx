import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CleanButton } from './src/components/CleanButton';
import { SpeakerIcon, VibrateIcon } from './src/components/Icons';
import { ProgramPicker } from './src/components/ProgramPicker';
import { TargetSelector } from './src/components/TargetSelector';
import { Tips } from './src/components/Tips';
import { t } from './src/i18n';
import { TARGET_PROGRAMS, type ProgramId, type TargetId } from './src/programs';
import { accents, colors } from './src/theme';
import { useCleaner } from './src/useCleaner';

const tap = () => Haptics.selectionAsync().catch(() => {});

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.backgroundTop, colors.backgroundBottom]} style={StyleSheet.absoluteFill} />
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const [target, setTarget] = useState<TargetId>('water');
  const [programByTarget, setProgramByTarget] = useState<Record<TargetId, ProgramId>>({
    water: 'tone',
    dust: 'shake',
  });
  const [vibrate, setVibrate] = useState(true);
  const program = programByTarget[target];
  const cleaner = useCleaner(program, vibrate);
  const accent = accents[target];

  const selectTarget = (next: TargetId) => {
    if (next === target) return;
    tap();
    cleaner.reset();
    setTarget(next);
  };

  const selectProgram = (next: ProgramId) => {
    if (next === program) return;
    tap();
    cleaner.reset();
    setProgramByTarget((prev) => ({ ...prev, [target]: next }));
  };

  const toggleRun = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (cleaner.running) cleaner.stop();
    else cleaner.start();
  };

  const statusText = cleaner.error
    ? t.playError
    : cleaner.running
      ? t.targets[target].running
      : cleaner.finished
        ? t.targets[target].done
        : t.tapToStart;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#1B2F6B', colors.backgroundBottom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logo}
          >
            <SpeakerIcon size={26} color={colors.white} innerWave={accents.water.from} outerWave={accents.dust.to} />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>
          <Pressable
            onPress={() => {
              tap();
              setVibrate((v) => !v);
            }}
            accessibilityRole="switch"
            accessibilityState={{ checked: vibrate }}
            accessibilityLabel={vibrate ? t.vibrationOn : t.vibrationOff}
            style={[styles.iconButton, vibrate && { backgroundColor: accent.soft, borderColor: accent.from }]}
          >
            <VibrateIcon size={20} color={vibrate ? accent.from : colors.textFaint} />
          </Pressable>
        </View>

        <TargetSelector value={target} onChange={selectTarget} disabled={cleaner.running} />

        <CleanButton
          target={target}
          running={cleaner.running}
          finished={cleaner.finished}
          progress={cleaner.progress}
          remaining={cleaner.remaining}
          onPress={toggleRun}
          startLabel={t.start}
          secondsLabel={t.seconds}
          accessibilityLabel={cleaner.running ? t.tapToStop : t.start}
        />

        <Text
          style={[styles.status, cleaner.finished && styles.statusDone, cleaner.error && styles.statusError]}
          accessibilityLiveRegion="polite"
        >
          {statusText}
        </Text>

        <ProgramPicker
          programs={TARGET_PROGRAMS[target]}
          value={program}
          onChange={selectProgram}
          disabled={cleaner.running}
          accent={accent}
        />

        <Tips title={t.tipsTitle} tips={t.targets[target].tips} accent={accent} />

        <Text style={styles.disclaimer}>{t.disclaimer}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  status: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -20,
    minHeight: 22,
  },
  statusDone: {
    color: colors.success,
  },
  statusError: {
    color: colors.error,
  },
  disclaimer: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
