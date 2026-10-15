import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Vibration } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

import { DURATION_S, PROGRAM_SOURCES, type ProgramId } from './programs';

const KEEP_AWAKE_TAG = 'speaker-cleaner';
const VIBRATION_INTERVAL_MS = 900;
const VIBRATION_MS = 500;

export function useCleaner(program: ProgramId, vibrate: boolean) {
  const players = {
    tone: useAudioPlayer(PROGRAM_SOURCES.tone),
    pulse: useAudioPlayer(PROGRAM_SOURCES.pulse),
    sweep: useAudioPlayer(PROGRAM_SOURCES.sweep),
    shake: useAudioPlayer(PROGRAM_SOURCES.shake),
    wideSweep: useAudioPlayer(PROGRAM_SOURCES.wideSweep),
  };
  const player = players[program];
  const status = useAudioPlayerStatus(player);

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);
  // A playback error (e.g. audio focus lost) ends the run without an extra render pass.
  const active = running && !status.error;

  useEffect(() => {
    // Play even with the iPhone silent switch on, and pause other apps' audio.
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'doNotMix' });
  }, []);

  const stop = useCallback(() => {
    player.pause();
    setRunning(false);
    setElapsed(0);
  }, [player]);

  const start = useCallback(async () => {
    setFinished(false);
    setElapsed(0);
    await player.seekTo(0);
    player.play();
    startedAt.current = Date.now();
    setRunning(true);
  }, [player]);

  const reset = useCallback(() => {
    setFinished(false);
    setElapsed(0);
  }, []);

  // Drive progress from wall-clock time so the UI never stalls on a late status update.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const secs = (Date.now() - startedAt.current) / 1000;
      if (secs >= DURATION_S) {
        stop();
        setElapsed(DURATION_S); // keep the ring full after a completed run
        setFinished(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        setElapsed(secs);
      }
    }, 100);
    return () => clearInterval(id);
  }, [active, stop]);

  useEffect(() => {
    if (!active || !vibrate) return;
    Vibration.vibrate(VIBRATION_MS);
    const id = setInterval(() => Vibration.vibrate(VIBRATION_MS), VIBRATION_INTERVAL_MS);
    return () => {
      clearInterval(id);
      Vibration.cancel();
    };
  }, [active, vibrate]);

  useEffect(() => {
    if (!active) return;
    // Best effort: browsers can deny the wake lock, and the tone should play anyway.
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, [active]);

  // No background playback: stop cleanly instead of leaving the UI out of sync.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') stop();
    });
    return () => sub.remove();
  }, [stop]);

  return {
    running: active,
    finished,
    progress: elapsed / DURATION_S,
    remaining: Math.ceil(DURATION_S - elapsed),
    error: status.error,
    start,
    stop,
    reset,
  };
}
